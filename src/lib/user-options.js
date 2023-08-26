class UserOptions{
	
	libs = {
		locale: null,
		options: {
			alchemy: 15,
			fortify: 0,
			perks:{
				alchemy: 0,
				physician: false,
				benefactor: false,
				poisoner: false,
				purity: false,
				seeker_of_shadows: false
			}
		},
		ingredients: [],
		effects: {},
		dlcs: [
			"[quest]",
			"Rare Curios Creation",
			"Fishing Creation",
			"Saints & Seducers Creation",
			"The Cause Creation",
			"Plague of the Dead Creation",
			"Goblins Creation"
		],
	};

	initialized = false;

	get( key ){
		if( !this.initialized )
			this.init();

		return this.libs[key];
	}

	set(key, value, save = true){
		this.libs[key] = value;
		if( save )
			this.save( key );
	}

	save(key){
		localStorage.setItem( key, JSON.stringify(this.libs[key]) )
	}

	updateTogglableEntities( key, entities ){
		for( let string in entities ){

			// For boolean entries
			if( entities[string] === true )
				this.removeString( key, string, false );
			else if( entities[string] === false )
				this.addString( key, string, false );

			// For int-value based
			else if( entities[string] === 0 )
				delete(this.libs[key][string]);
			else
				this.libs[key][string] = entities[string];

		}

		localStorage.setItem( key, JSON.stringify(this.libs[key]) );
	}

	addString( key, string, update = true ){
		this.libs[key].push(string);
		if(update)
			localStorage.setItem( key, JSON.stringify(this.libs[key]) )
	}

	removeString( key, string, update = true ){
		this.libs[key] = this.libs[key].filter( (str) => str != string);
		if(update)
			localStorage.setItem( key, JSON.stringify(this.libs[key]) )
		
	}


	init(){
		for( let key in this.libs ){

			let stored_value = localStorage.getItem( key );
			if( ! stored_value ){
				localStorage.setItem( key, JSON.stringify(this.libs[key]) )
			} else{
				this.libs[key] = JSON.parse(stored_value);
			}
		}
	}


}

export default new UserOptions();