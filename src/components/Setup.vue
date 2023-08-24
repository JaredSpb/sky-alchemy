<script setup>
import Pane from './Pane.vue';
import dispatcher from './../lib/event-dispatcher.js';

let props = defineProps({
	ingredients: Object,
	effects: Object,
	active_pane: {
	    default: 'ingredients',
	    type: Number
	},
	dlcs: Object
})

function togglePane(pane){
	props.active_pane = pane;
}

function toggleDlc( dlc, enabled ){
	dispatcher.dispatch('toggle-dlc', dlc, enabled);
}

</script>

<template>
	<aside>
		<div class='dlcs'>
			<label v-for="(enabled, dlc) in dlcs"><input @change="toggleDlc(dlc, dlcs[dlc] = !enabled)" :checked="enabled" type="checkbox" name='{{ dlc }}'/><span>{{ dlc }}</span></label>
		</div>

		<nav class='pane_type'>
			<a :class='active_pane == "ingredients" ? "active" : ""' @click="togglePane('ingredients')">{{ i18n.getTerm( 'iface', 'ingredients' ) }}</a>
			<a :class='active_pane == "effects" ? "active" : ""' @click="togglePane('effects')">{{ i18n.getTerm( 'iface', 'effects' ) }}</a>
		</nav>

		<Pane
			:items="ingredients"
			:isa="'ingredients'"
			:class='[active_pane == "ingredients" ? "active": "", "ingredients", "setup"]'/>

		<Pane
			:items="effects"
			:isa="'effects'"
			:class='[active_pane == "effects" ? "active": "", "effects", "setup"]'/>

	</aside>
</template>

