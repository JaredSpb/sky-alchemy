<script setup>
import { ref, reactive, watch, onMounted, defineProps } from 'vue'

import Slider from '@vueform/slider';
import '@vueform/slider/themes/default.css';

import getSliderOptions from './lib/get-slider-options.js';
import i18n_raw from './lib/i18n.js';
import i18n_strings from './data/i18n.js';

import dispatcher from './lib/event-dispatcher.js';

import ingredients_list from './data/ingredients.js';
import effects_list from './data/effects.js';
import dlcs_raw from './data/dlcs.js';

import potion_maker from './models/potion_maker.js';

import userOptions from './lib/user-options.js';

import Setup from './components/Setup.vue'
import Potions from './components/Potions.vue'


let props = defineProps({});

// Init the i18n and watching for changes
i18n_raw.setStrings( i18n_strings, userOptions.get('locale') );


// Loading DLCs list with respect to banned items
let banned_dlcs = userOptions.get('dlcs');
for( let entry in dlcs_raw ){
	if( banned_dlcs.includes( entry ) ){
		dlcs_raw[ entry ] = false;
	} else{
		dlcs_raw[ entry ] = true;
	}
}
let dlcs = ref( dlcs_raw );

// Loading ingredient list with respect to banned items
let banned_ingredients = userOptions.get('ingredients');
for( let entry in ingredients_list ){
	if( banned_ingredients.includes( entry ) ){
		ingredients_list[ entry ].active = false;
	} else{
		ingredients_list[ entry ].active = dlcs_raw[ ingredients_list[ entry ].dlc ];
		ingredients_list[ entry ].enabled = dlcs_raw[ ingredients_list[ entry ].dlc ];
	}
}
let ingredients = ref( ingredients_list );

// Loading effects list with respect to banned items
let banned_effects = userOptions.get('effects');
for( let entry in effects_list ){
	if( banned_effects.includes( entry ) ){
		effects_list[ entry ].active = false;
	} else{
		effects_list[ entry ].active = dlcs_raw[ effects_list[ entry ].dlc ];
		effects_list[ entry ].enabled = dlcs_raw[ effects_list[ entry ].dlc ];
	}
}
let effects = ref( effects_list );

// User options
let options_raw = userOptions.get('options');
let options = reactive( options_raw );


// The potions container
let potions_list = reactive({
	progress: false,
	potions: []
});



// Updating user options on toggle - this is for ingredients and effects
dispatcher.subscribe('toggled', function( details ){

	if(details)
		userOptions.updateTogglableEntities( details.isa, details.state );

});

dispatcher.subscribe(
	'toggle-dlc',
	function( dlc, state ){
		if( state ){
			userOptions.removeString( 'dlcs', dlc );
		} else{
			userOptions.addString( 'dlcs', dlc );
		}
	}
);


// Initilize default poitions set
function handlePotionsMounted(){

	window.setTimeout(
		function(){

			let app_container = document.querySelector('#app');

			potions_list.progress = '0%';

			potion_maker.init(
				ingredients_list, 
				effects_list,
				options_raw,
				async () => {
					potions_list.potions.value = ref( potion_maker.getHead(50) );
				},
				( at ) => {
					
					if( at == 1 ){

						potions_list.progress = false;
						app_container.classList.remove('init');
						app_container.classList.remove('in_progress');

					} else{
						if( at == 0 ){
							app_container.classList.add('in_progress');
						}
						potions_list.progress = Math.round( at*100 ) + '%';
					}

					
				}
			);

		}
	)
}


// Refresh poitions list when something is toggled
dispatcher.subscribe(
	'toggled',
	function(){
		potions_list.potions.value = potion_maker.getHead(50)
	}
);

// Handle DLC toggle
dispatcher.subscribe(
	'toggle-dlc',
	function( dlc, state ){

		for( let item of Object.values(ingredients.value) ){
			if( item.dlc == dlc ){
				item.enabled = state;
				item.active = state;
			}
		}

		if( dlc != 'Skyrim' ){
			for( let item of Object.values(effects.value) ){
				if( item.dlc == dlc ){
					item.enabled = state;
					item.active = state;
				}
			}
		}

		dispatcher.dispatch('toggled');
	}
);

// Recalc poitions list when option is changed
function setOptionValue( id ){

	if( id ){
		document.getElementById(id).select();
	}

	userOptions.save('options');


	let app_container = document.querySelector('#app');
	app_container.classList.add('in_progress');
	potion_maker.recalc();

}

// Toggle locale
function switchLocale( i18n, locale ){
	i18n.switchLocale( locale );
	userOptions.set('locale', locale);
}

// Toggle options controls pane
let hide_controls_handler_manager = {
	container: null,
	callback: null,
	handler_bound: null,
	getHandler: function( container, callback ){

		if( container ) this.container = container;
		if( callback ) this.callback = callback;

		if( !this.handler_bound )
			this.handler_bound = this.handler.bind( this );

		return this.handler_bound;
	},
	handler: function( e ){

		let closest = e.target;
		while( closest != this.container && closest.parentNode ){
			closest = closest.parentNode;
		}
		
		if( closest != this.container ){
			this.callback();
		}

	}
};

function toggleControls(e){
	if( e.target.classList.contains('active') ){

		e.target.classList.remove('active');
		document.removeEventListener( 
			'click', 
			hide_controls_handler_manager.getHandler()
		);

	} else{
		e.target.classList.add('active');
		document.addEventListener( 'click', hide_controls_handler_manager.getHandler(
			e.target.parentNode,
			() => e.target.classList.remove('active')
		) );
	}
}

</script>


<template>
	<header>
		<a href="/" class='logo'>
			<img src="./assets/images/sky.png" alt="Sky"/>
			<span>alchemy</span>
		</a>


		<div class='controls'>
			<a @click="(e) => toggleControls(e)">⚙</a>
			<div>

				<div>
					<label for="options_alchemy">{{i18n.getTerm('iface', 'alchemy')}}</label>
					<div>
						<input 
							id='options_alchemy'
							type="number"
							min="0"
							max="100"
							tabindex="-1" 
							:value="options.alchemy"
	  						@input="options.alchemy = $event.target.value"
	  						@change="setOptionValue()"
	  						>

						<Slider 
							v-model="options.alchemy" 
							v-bind="getSliderOptions('options_alchemy')"
							@change="setOptionValue('options_alchemy')"
						/>
					</div>
				</div>
				<div>
					<label for="options_fortify">{{i18n.getTerm('iface', 'alchemy_fortify')}}</label>
					<div>
						<input 
							id='options_fortify'
							type="number"
							min="0"
							max="200"
							tabindex="-1" 
							:value="options.fortify"
							@change="setOptionValue()"
	  						@input="options.fortify = $event.target.value">


						<Slider 
							v-model="options.fortify" 
							v-bind="getSliderOptions('options_fortify', { max: 200 })"
							@change="setOptionValue('options_fortify')"
						/>
					</div>
				</div>
				<div>
					<label for="options_perks_alchemy">{{i18n.getTerm('iface', 'alchemy_perk')}}</label>
					<div>
						<input 
							id='options_perks_alchemy'
							type="number"
							min="0"
							max="5"
							tabindex="-1" 
							:value="options.perks.alchemy"
							@change="setOptionValue()"
	  						@input="options.perks.alchemy = $event.target.value">


						<Slider
							v-model="options.perks.alchemy" 
							v-bind="getSliderOptions('options_perks_alchemy', { max: 5 })"
							@change="setOptionValue('options_perks_alchemy')"
							/>
					</div>
				</div>
				<label>
					<input 
						type="checkbox" 
						tabindex="-1" 
						v-model="options.perks.physician" 
						@change="setOptionValue()"
						/>
					<span>{{i18n.getTerm('iface', 'physician_perk')}}</span>
				</label>
				<label>
					<input 
						type="checkbox" 
						tabindex="-1" 
						v-model="options.perks.purity" 
						@change="setOptionValue()"
						/>
					<span>{{i18n.getTerm('iface', 'purity_perk')}}</span>
				</label>
				<label>
					<input 
						type="checkbox" 
						tabindex="-1" 
						v-model="options.perks.benefactor" 
						@change="setOptionValue()"
						/>
					<span>{{i18n.getTerm('iface', 'benefactor_perk')}}</span>
				</label>
				<label>
					<input 
						type="checkbox" 
						tabindex="-1" 
						v-model="options.perks.poisoner" 
						@change="setOptionValue()"
						/>
					<span>{{i18n.getTerm('iface', 'poisoner_perk')}}</span>
				</label>

			</div>
		</div>

		<a href="https://github.com/JaredSpb/sky-alchemy" :title="i18n.getTerm('iface', 'github_link')" target="_blank"><img src="/images/github-mark-white.svg" alt="GitHub"/></a>
		

		<nav class='locale_switcher'>
			
			<template v-for="locale in i18n.getLocales()">
				 <a @click="switchLocale( i18n, locale )" :class="[locale, locale == i18n.getActiveLocale() ? 'active' : '']">{{ locale }}</a>
			</template>
		
		</nav>
	</header>
	<main>

		<Setup :ingredients="ingredients" :effects="effects" :dlcs="dlcs"/>
		<Potions @potions-mounted="handlePotionsMounted()" :potions="potions_list" />

	</main>
</template>
