class EEffect{
	base = {
		magnitude_raw: 0,
		duration_raw: 0,
		value: 0,
	}

	purified = false;
	
	magnitude = 0;
	magnitude_raw = 0;
	duration = 0;
	duration_raw = 0;
	value = 0;
	no_value_magnifier = false;

	poison = false;
	primary_prop = 'magnitude_raw';

	magnifiers = {};
	magnifiers_special = {};

	constructor( magnitude, duration, value, poison, primary_prop, no_value_magnifier ){
		this.base.magnitude_raw = magnitude;
		this.base.duration_raw = duration;
		this.base.value = value;
		this.poison = poison;
		this.primary_prop = primary_prop + '_raw';
		if( no_value_magnifier )
			this.no_value_magnifier = true;
	}

	setSpecialMagnifier( prop, value ){
		this.magnifiers_special[ prop + '_raw' ] = value;
	}

	setMagnifier( tag, value ){
		this.magnifiers[tag] = value;
	}
	removeMagnifier( tag ){
		delete( this.magnifiers[tag] );
	}

	round(){
		this.duration = Math.round( this.duration_raw );
		this.magnitude = Math.round( this.magnitude_raw );
	}

	calc(){

		if( this.purified ){
			this.value = 0;
			return 0;
		}

		// Calculating with base magnifiers
		for( let prop of ['magnitude_raw', 'duration_raw'] ){
			this[ prop ] = this.base[ prop ];
			// Applying magnifiers to primary prop only
			if( prop == this.primary_prop ){
				for( let magnifier of Object.values(this.magnifiers) )
					this[ prop ] *= magnifier;
			}

			if( this.magnifiers_special[prop] ){
				this[ prop ] = this[ prop ] * this.magnifiers_special[ prop ];
			}
		}

		this.value = Math.floor(
			(
				( this.magnitude ? this.magnitude ** 1.1 : 1 )
				*
				( this.duration ? ((this.duration / 10) ** 1.1) : 1 )
			) * this.base.value
		);

		if( this.magnifiers_special['value_raw'] && !this.no_value_magnifier )
			this.value = this.value * this.magnifiers_special['value_raw'];

		this.round();
		return this.value;
	}

}

class Potion{

	alias = null;
	effects = {};
	eeffects = null;
	ingredients = {};
	value = 0;
	is_poison = false;

	static options = null;

	digest(){
		return {
			is_poison: this.is_poison,
			eeffects: this.eeffects,
			effects: this.effects,
			ingredients: this.ingredients,
			value: this.value,
			alias: this.alias,
			key: this.key
		};
	}

	constructor( ingredients, effects, key ) {

		this.ingredients = ingredients;
		this.effects = effects;
		this.key = key;

		this.calculateValue();

	}
	
	calculateValue(){

		let base_alchemy_power = 4; // Game base

		// From the skill
		base_alchemy_power = base_alchemy_power * ( 1 + this.constructor.options.alchemy / 200 );

		// From alchemy perk 
		base_alchemy_power = base_alchemy_power * ( 1 + (this.constructor.options.perks.alchemy * 20) / 100 );

		// From enchantments
		base_alchemy_power = base_alchemy_power * ( 1 + this.constructor.options.fortify / 100 );

		// Populating eefects
		if( this.eeffects === null ){

			this.eeffects = {};

			for( let effect_name in this.effects ){
				let effect = this.effects[effect_name];

				let eeffect = new EEffect(
					effect.magnitude,
					effect.duration,
					effect.base_cost,
					effect.poison == 1,
					effect.fixed == 'duration' ? 'magnitude' : 'duration',
					effect.no_value_magnifier
				);

				let primary_ingredient = null;
				let primary_ingredient_priority = null;

				for( let ingredient in effect.ingredients ){

					// No such ingredient added to current potion
					if( !this.ingredients[ingredient] )
						continue;

					// No ingredient does not have special magnifiers, skipping it
					if( effect.ingredients[ingredient] === null )
						continue;

					// Setting ingredient with lower `prio` field as primary
					if( primary_ingredient_priority === null || effect.ingredients[ingredient] < primary_ingredient_priority ){
						primary_ingredient = this.ingredients[ingredient];
						primary_ingredient_priority = effect.ingredients[ingredient];
					}
				}


				if( primary_ingredient && primary_ingredient.effects[effect_name] !== true ){
					for( let prop of ['magnitude','duration','value'] ){
						if( primary_ingredient.effects[effect_name] && primary_ingredient.effects[effect_name][prop] )
							eeffect.setSpecialMagnifier( prop, primary_ingredient.effects[effect_name][prop] );
					}
				}

				this.eeffects[effect_name] = eeffect;
			}
		}

		this.is_poison = false;
		let primary_effect = null;
		let primary_effect_value = null;

		for( let effect_name in this.eeffects ){
			let eeffect = this.eeffects[effect_name];
			eeffect.setMagnifier( 'base', base_alchemy_power );

			// The benefactor modifier
			eeffect.setMagnifier(
				'benefactor',
				(
					this.constructor.options.perks.benefactor && eeffect.poison != 1
					? 1.25
					: 1
				)
			);

			// The poisoner modifier
			eeffect.setMagnifier(
				'poisoner',
				(
					this.constructor.options.perks.poisoner && eeffect.poison == 1
					? 1.25
					: 1
				)
			);

			// The physician modifier
			eeffect.setMagnifier(
				'physician', 
				(
					this.constructor.options.perks.physician && (  effect_name == 'restore_health' || effect_name == 'restore_magicka' || effect_name == 'restore_stamina' )
					? 1.25
					: 1
				)
			);


			// The Seeker of Shadows modifier
			eeffect.setMagnifier( 
				'seeker_of_shadows', 
				(
					this.constructor.options.perks.seeker_of_shadows
					? 1.1
					: 1
				)
			);


			let eefect_value = eeffect.calc();

			if( primary_effect_value == null || primary_effect_value < eefect_value ){
				primary_effect_value = eefect_value;
				primary_effect = effect_name;
			}
		}


		// Now the primary effect is here, we'r ready to calculate the final result
		this.alias = primary_effect;
		this.is_poison = this.effects[ primary_effect ].poison == 1 ? 1 : 0;
		this.value = 0;

		// Calculating final values based on if we're making poison
		for( let effect_name in this.eeffects ){

			let effect = this.eeffects[effect_name];

			let canceled_effect_magnifier = false;
			if( this.is_poison && !effect.poison )
				canceled_effect_magnifier = 'benefactor';
			else if( !this.is_poison && effect.poison )
				canceled_effect_magnifier = 'poisoner';

			if( canceled_effect_magnifier ){
				if( this.constructor.options.perks.purity ){

					this.eeffects[effect_name].purified = true;

				} else{

					this.eeffects[effect_name].purified = false;

					effect.removeMagnifier( canceled_effect_magnifier );
					
					this.value += effect.calc();

				}

			} else{
				this.value += effect.calc();
			}

		}

	}
}

export default {

	ingredients: null,
	effects: null,
	options: null,
	potions: [],

	_processed: {},
	_init_complete_callback: null,
	_progess_callback: null,
	_potion_wrapper: null,

	init: function( ingredients, effects, options, ic_callback, p_callback ){
		this.ingredients = ingredients;
		this.effects = effects;
		this.options = options;
		this._init_complete_callback = ic_callback;
		this._progess_callback = p_callback;

		this._ingredients = {};
		this._effects = {};

		// Making ties copy for research
		for( let iname in this.ingredients  ){
			this._ingredients[ iname ] = {};
			for( let ename of Object.keys( this.ingredients[iname].effects ) ){
				this._ingredients[ iname ][ ename ] = true;
			}
		}

		for( let ename in this.effects  ){
			this._effects[ ename ] = {};
			for( let iname of Object.keys( this.effects[ename].ingredients ) ){
				this._effects[ ename ][ iname ] = true;
			}
		}

		
		let st = (new Date).getTime();

		Potion.options = this.options;

		this._proceed = {};
		let k = 0;

		this._effects_names = Object.keys(this._effects);
		let total = this._effects_names.length;

		this._research( k, total );

	},

	_research: function( k, total ){

		if( k == total ){

			this.potions.sort( (a,b) => b.value - a.value );
			
			this
				._init_complete_callback()
				.then( () => this._progess_callback( 1 ) );

		} else{

			let effect1_name = this._effects_names[ k ];
			let ingredients_names = Object.keys( this._effects[effect1_name] );
			for (var i = 0; i < ingredients_names.length; i++) {

				for (var j = i + 1; j < ingredients_names.length; j++) {

					let pair = [ ingredients_names[i], ingredients_names[j] ];

					let proceed_key = pair.join('/');
					if( this._proceed[proceed_key] )
						continue;
					this._proceed[proceed_key] = true;

					let pair_effects = {};
					for( let chunk of pair ){
						for( let initial_effect in this._ingredients[ chunk ] ){
							if( pair_effects[ initial_effect ] )
								pair_effects[ initial_effect ]++
							else
								pair_effects[ initial_effect ] = 1;
						}		
					}

					


					for( let ingredient1_name of pair ){
						
						let effects2_names = Object.keys(this._ingredients[ ingredient1_name ]);
						for( let effect2_name of effects2_names ){
							if( effect2_name == effect1_name || !this._effects[ effect2_name ] )
								continue;

							for( let ingredient3_name of Object.keys( this._effects[ effect2_name ] ) ){
								if( pair.includes( ingredient3_name )  )
									continue;


								let aliases = [ ingredients_names[i], ingredients_names[j], ingredient3_name ];
								aliases.sort();
								let proceed_key = aliases.join('/');
								if( this._proceed[proceed_key] )
									continue;

								this._proceed[proceed_key] = true;

								let trio_effects = Object.assign({}, pair_effects);
								let trio = [ pair[0], pair[1], ingredient3_name ];

								let potion_legit = false;
								for( let effect3_name in this._ingredients[ingredient3_name] ){
									if( trio_effects[effect3_name] ){

										// This ingredient brings something new
										if( trio_effects[effect3_name] == 1 )
											potion_legit = true;

										trio_effects[effect3_name]++;

									}
								}

								if( potion_legit ){

									let potion = new Potion(
										trio.reduce((obj, name) => {
											obj[name] = this.ingredients[name];
											return obj;
										}, {}),
										Object.keys( trio_effects )
											.filter( (k) => trio_effects[k] > 1 )
											.reduce((obj, name) => {
												obj[name] = this.effects[name];
												return obj;
											}, {}),
										proceed_key
									);

									this.potions.push(potion);

								}

							}

						}

					}

					let potion = new Potion(

						pair.reduce((obj, name) => {
							obj[name] = this.ingredients[name];
							return obj;
						}, {}),

						Object.keys( pair_effects )
							.filter( (k) => pair_effects[k] > 1 )
							.reduce((obj, name) => {
								obj[name] = this.effects[name];
								return obj;
							}, {}),

						proceed_key
					)

					this.potions.push(potion);

				}
			}

			delete( this._effects[ effect1_name ] );
			this._progess_callback( k / total );
			window.setTimeout(
				() => this._research( k + 1, total)
			);
		}
	},

	recalc_refresh_progress_ratio: 10,
	recalc: async function( i, progress ){

		if( i === undefined ) i = 0;
		if( progress === undefined ) progress = 0;

		let percent = Math.floor( this.recalc_refresh_progress_ratio * progress );

		this._progess_callback( progress );

		for (var j = i; j < this.potions.length; j++) {
			
			this.potions[ j ].calculateValue();

			let local_progress = (j + 1) / this.potions.length;
			let local_percent = Math.floor( this.recalc_refresh_progress_ratio * local_progress );

			if( local_percent < this.recalc_refresh_progress_ratio && local_percent != percent ){
				this._progess_callback( local_progress );
				setTimeout(() => this.recalc( j + 1, local_progress ));
				return;
			}
		}

		this.potions.sort( (a,b) => b.value - a.value );
		this
			._init_complete_callback()
			.then(
				() => this._progess_callback( 1 )
			);

	},

	getHead: function( total ){

		let out = [];

		POTIONS: for( let potion of this.potions ){

			for( let ingredient of Object.keys(potion.ingredients) ){
				if( !potion.ingredients[ingredient].active )
					continue POTIONS;
			}

			for( let effect of Object.keys(potion.effects) ){
				if( !potion.effects[effect].active ){
					continue POTIONS;
				}
			}

			out.push( potion.digest() );
			if( out.length == total )
				return out;

		}
		
		return out;

	}

};