<script setup>
import ToggleableEntry from './ToggleableEntry.vue';
import dispatcher from './../lib/event-dispatcher.js';

let props = defineProps({
	items: Object,
	isa: String,
	filter_applied: {
		type: Boolean,
		default: false
	}
});


function sortIList( set, type, i18n ){

	let names_tr = Object.keys( set ).reduce(
		( acc, name ) => {
			set[name].alias = name;
			acc[ i18n.getTerm( type, name, 'name' ) ] = name;
			return acc;
		},
		{}	
	);

	let names_tr_list = Object.keys( names_tr );
	names_tr_list.sort( (a,b) => a.localeCompare( b ) );

	let out = {};
	for( let name of names_tr_list ) {
		out[ name ] = set[ names_tr[name] ];
	}

	return out;
}

function toggleAll( set, state, isa ){

	let changelist = {};
	for( let key in set ){

		let prev_state = set[key].active;

		set[key].active = (
			state 
			? set[key].enabled
			: state
		);

		if( set[key].active != prev_state )
			changelist[key] = set[key].active;

	}

	dispatcher.dispatch('toggled', {isa, state: changelist});
}

function filter( e, isa, i18n ){

	if( e.target.value ){

		let filter = e.target.value.split(/[^\p{L}\s]+/u).filter((s) => s);

		ITEMS: for( let item_alias of Object.keys(props.items) ){
			for( let filter_string of filter ){
				if( i18n.termContains( isa, item_alias, 'name', filter_string ) ){
					props.items[item_alias].highlighted = true;
					continue ITEMS;
				}
			}
			props.items[item_alias].highlighted = false;
		}

		props.filter_applied = true;

	} else{

		props.filter_applied = false;
		for( let item of Object.values(props.items) )
			item.highlighted = false;

	}
}

function unfilter( e ){
	let input = e.target.closest('.controls').querySelector('input');
	input.value = '';
	input.blur();
	input.dispatchEvent(new Event("input"));
}


document.addEventListener('keydown', function( e ){

	if( e.ctrlKey || e.altKey )
		return true;

	let input = document.querySelector('.setup.active input');
	if( input.getAttribute('data-isa') != props.isa )
		return true;

	if(  
		input != document.activeElement
		&& (
			e.key.match(/^[a-zа-я]$/i) || e.key == '/' || e.key == 'Enter' 
		)
		
	){
		input.focus();

		if( e.key == '/' ){
			e.preventDefault();
			return false;
		}
	} else if( e.key == 'Escape' ){
		unfilter({ target: document.querySelector('.setup.active input') });
	} else if( e.key == 'Enter' ){

		for( let item of Object.values(props.items) ){
			if( item.enabled ){
				if( e.target.value == '' || item.highlighted ){
					item.active = !item.active;
				}
			}
		}

		dispatcher.dispatch('toggled');

	}
	
});

</script>

<template>
	
		<div>
			<nav :class="filter_applied ? 'filtered' : ''">
				<ToggleableEntry 
					v-for="(item, name) in sortIList(items, isa, i18n)" 
					:item="item"
					:isa="isa"
					:alias="item.alias"
					:name="name"
					/>
				
			</nav>

			<div class='controls'>
				<div>
					<input 
						type="text" 
						name='filter'
						:data-isa="isa"
						:placeholder="i18n.getTerm('iface', 'filter')" 
						@keyup="(event) => event.key == 'Escape' ? unfilter( event ) : '' "
						@input="(event) => filter(event, isa, i18n)"
						/>

					<div class='filter_controls'>
						<a class='drop' @click="event => unfilter( event )">☓</a>
						<a class='hint' :data-hint="i18n.getTerm('iface', 'filter_hint')">?</a>
					</div>					
				</div>
				<a @click="toggleAll(items, true, isa)">{{ i18n.getTerm('iface', 'select_all') }}</a>
				<a @click="toggleAll(items, false, isa)">{{ i18n.getTerm('iface', 'unselect_all') }}</a>
			</div>
			
		</div>

</template>