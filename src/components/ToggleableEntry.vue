<script setup>
import toggle from './../lib/toggle-fn.js';

const props = defineProps({
	item: Object,
	alias: String,
	name: String,
	isa: String,
	type: String,
	highlighted: {
		type: Boolean,
		default: false
	}
});


function emphasize( target, klass ){
	target.parentNode.classList.add(klass);
	target.addEventListener('mouseleave', (e) => target.parentNode.classList.remove(klass), {once: true} );
}

</script>

<template>
	<a
		v-if="type == 'regular'" 
		@click="toggle( item, alias, isa )" 
		:class="[ 
			item.active ? 'active' : '' , 
			item.enabled ? 'enabled' : '',
			item.highlighted ? 'highlighted' : '',
			'regular'
		]">{{ name }}</a>

	<a
		v-if="type == 'special'" 
		:state="item.active"
		:class="[ 
			item.active == 1 
				? 'active' 
				: (
					item.active == -1 
					? 'inactive'
					: 'neutral'
				), 
			item.enabled ? 'enabled' : '',
			item.highlighted ? 'highlighted' : '',
			'special'
		]">
			<div>
				<span 
					:title="i18n.getTerm('iface', 'make_mandatory')" 
					@click="toggle( item, alias, isa, 1 )" 
					@mouseenter="(e) => emphasize(e.target, 'activatable')">+</span>
				<span 
					:title="i18n.getTerm('iface', 'make_neutral')" 
					@click="toggle( item, alias, isa, 0 )" 
					@mouseenter="(e) => emphasize(e.target, 'neutralizable')"></span>
				<span 
					:title="i18n.getTerm('iface', 'make_forbidden')" 
					@click="toggle( item, alias, isa, -1 )" 
					@mouseenter="(e) => emphasize(e.target, 'inactivatable')">-</span>
			</div>
			
			{{ name }}
			
		</a>
</template>
