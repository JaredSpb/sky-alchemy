export default {

	strings: null,
	available_locales: [],
	active_locale: 'en', // Presuming english is always is there in our strings
	back_ref: null,

	backRef: function( ref ){
		this.back_ref = ref;
	},

	termContains: function( section, term, field, search ){

		for( let locale of this.available_locales ){
			if( this.strings[ section ][ locale ][ term ][ field ].some( (v) => v.toLowerCase().indexOf(search) != -1 ) )
				return true;
		}

		return false;
		
	},	
	setStrings: function( data, default_locale ){
		this.strings = data;

		// Presuming every key has full list of languanges
		for( let lang of Object.keys( data[Object.keys(data)[0]] ) ){

			if( !this.available_locales.includes( lang ) )
				this.available_locales.push( lang );
		}

		// Determining initial language
		let browser_lang = (
			default_locale
			? default_locale
			: (navigator.language || navigator.userLanguage)
		);		

		for( let lang of this.available_locales ){

			// Exact match, we'r done
			if( lang === browser_lang ){
				this.back_ref.active_locale = lang;
				break;
			}

			if( browser_lang.indexOf( lang ) === 0 )
				this.back_ref.active_locale = lang;

		}


		// Making i18n forms
		for( let section in this.strings ){
			for( let locale in this.strings[section] ){
				for( let term in this.strings[section][locale] ){

					if( typeof this.strings[section][locale][term] === 'string'  )
						continue;

					for( let field in this.strings[section][locale][term] ){

						let value = this.strings[section][locale][term][field];

						if( value.indexOf('{') == -1 )
							this.strings[section][locale][term][field] = [value];
						else{

							this.strings[section][locale][term][field] = [];

							let placeholders = [...value.matchAll(/\{.*?\}/g)];
							let replacements = [];
							let vlen = 0;
							for (let i = 0; i < placeholders.length; i++) {
								let vls = placeholders[i][0].replace(/[{}]/g,'').split(/\|/);

								for (let j = 0; j < vls.length; j++) {
									if( !replacements[j] )
										replacements[j] = [ vls[j] ];
									else
										replacements[j].push(vls[j]);
								}
							}

							for (var i = 0; i < replacements.length; i++) {
								let new_value = value;
								for( let replacement of replacements[i] ){
									new_value = new_value.replace(/\{.*?\}/, replacement);
								}
								this.strings[section][locale][term][field].push(new_value);								
							}

						}

					}
				}

			}
		}

	},

	getLocales: function(){
		return this.available_locales;
	},

	switchLocale: function( locale ){
		this.active_locale = locale;
	},

	getActiveLocale: function(){
		return this.active_locale;
	},

	getTerm: function( section, term, field, form, substitutions ){

		let value = this.strings[section][this.active_locale][term];
		let rv = null;
		if( typeof value === 'string' ){
			rv = value;
		}

		if( Array.isArray( value[field] ) ){

			if( form !== undefined && value[field][form] ){
				rv = value[field][form];
			} else{
				rv = value[field][0];
			}			
		}

		if( substitutions ){
			for( let subj in substitutions ){
				rv = rv.replace( subj, substitutions[subj] );

			}
		}

		return rv;

	}

};