let getSliderOptions = (function( alias, redefines ){

	if( !this.initialized[ alias ] ){
		this.initialized[alias] = JSON.parse(JSON.stringify( this.defaults ));

		if( redefines )
			for( let f in redefines )
				this.initialized[alias][ f ] = redefines[ f ];

	}

	return this.initialized[alias];

}).bind({
	defaults: {
		tooltips: false,
		lazy: false,
		max: 100,
		options: {
			handleAttributes: [
		        { 'tabindex': '100' }
		    ],
		}
	},
	initialized: {}
});

export default getSliderOptions;
