import dispatcher from './event-dispatcher.js';

export default function( item, name, isa, value ){

	if( value === undefined )
		value = (
			item.active
			? false
			: item.enabled
		);

	if( item.active )
		item.active = value;
	else
		item.active = value;

	let state_change = {}
	state_change[name] = value;

	dispatcher.dispatch('toggled', {state: state_change, isa: isa });
}