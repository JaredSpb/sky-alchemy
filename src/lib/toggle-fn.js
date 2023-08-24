import dispatcher from './event-dispatcher.js';

export default function( item, name, isa ){

	if( item.active )
		item.active = false;
	else
		item.active = item.enabled;

	let state_change = {}
	state_change[name] = item.active;

	dispatcher.dispatch('toggled', {state: state_change, isa: isa });
}