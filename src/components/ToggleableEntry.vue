<script setup>
import toggle from './../lib/toggle-fn.js';

const props = defineProps({
	item: Object,
	alias: String,
	name: String,
	isa: String,
	highlighted: {
		type: Boolean,
		default: false
	}
});
</script>

<template>
	<a 
		@click="toggle( item, alias, isa )" 
		:class="[ 
			item.active ? 'active' : '' , 
			item.enabled ? 'enabled' : '',
			item.highlighted ? 'highlighted' : ''
		]">{{ name }}</a>
</template>
