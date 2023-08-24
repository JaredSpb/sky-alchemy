class EventsDispatcher {

	handlers = {};

	subscribe( event, fn ){
		if( !this.handlers[ event ] )
			this.handlers[ event ] = [];

		this.handlers[event].push( fn );
	}

	dispatch( event, ...args ){
		if( this.handlers[ event ] )
			for( let handler of Object.values( this.handlers[ event ] ) )
				handler( ...args );
	}
	
}


export default new EventsDispatcher();

