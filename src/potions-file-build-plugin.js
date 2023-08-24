import * as fs from 'node:fs';

export default function(){
	return {
		name: 'potions-file-build',
		buildStart: function(){

			let prefix = 'src/data';
			let deps = {};

			let slurper = function(sources, target, builder){
				console.log(`Rebuilding ${target}\n`);

				let data = {};
				for( let source of sources ){
					try{
						data[source] = JSON.parse( fs.readFileSync( source ) );
					} catch( e ){
						console.log(source);
						console.log(e);
						process.exit();
					}
					
				}

				fs.writeFileSync(
					target,
					builder( data )
				);
			}

			let simple_builder = function( data ){
				let keys = Object.keys(data);
				return 'export default ' + JSON.stringify( data[keys[0]], null, "\t" );
			}


			// JSON to JS transform
			deps[ `${prefix}/effects.js` ] = { sources: [`${prefix}/_effects.json`], builder: simple_builder };
			deps[ `${prefix}/ingredients.js` ] = { sources: [`${prefix}/_ingredients.json`], builder: simple_builder };


			// Combining translations
			let i18n_prefix = `${prefix}/i18n`;
			let i18n_target = i18n_prefix + '.js';
			let translations = fs.readdirSync( `${i18n_prefix}` );

			deps[ i18n_target ] = {
				sources: [],
				builder: function( data ){

					let out = {};
					for( let file in data ){
						let filename = file.replace(/.*?([^\/]+)$/,'$1');

						let keys = filename.split(/\./);
						keys.pop(); // removing extention

						let pointer = out;
						while( keys.length ){
							let key = keys.shift();

							if( !pointer[ key ] )
								pointer[ key ] = {};

							if( !keys.length ){
								pointer[ key ] = data[file];
							} else {
								pointer = pointer[ key ];
							}
						}
					}

					return 'export default ' + JSON.stringify( out, null, "\t" )
				}
			}
			for( let tr of translations ){
				deps[i18n_target].sources.push( `${i18n_prefix}/${tr}` );
			}




			// Checking targets timestamps vs sources
			TARGET: for (const [target, defs] of Object.entries(deps)) {

				try{
					let target_mtime = fs.statSync( target ).mtimeMs

					for( let source of defs.sources ){

						if( fs.statSync( source ).mtimeMs > target_mtime ){

							// Got newer source, rebuilding
							slurper( defs.sources, target, defs.builder );

							continue TARGET;
						}
					}

					// No new sources found, removing this dep, its fine
					delete( deps[target] );

				} catch( e ){

					// No file at all probably, rebuilding
					slurper( defs.sources, target, defs.builder );					
				}
			}


		},
	}
};
