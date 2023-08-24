<script setup>
import Potion from './Potion.vue';
import toggle from './../lib/toggle-fn.js';

defineProps({
	potion: Object,
});

function highlight( e, tied ){

	let source = e.target;
	let root = source.closest('.potion');
	let target = (
		source.closest('.ingredients')
		? root.querySelector('.effects')
		: root.querySelector('.ingredients')
	)
	if( tied ){
		tied = Object.keys(tied);

		for( let c of target.children ){
			if( tied.includes( c.getAttribute('data-alias') ) ){
				c.classList.add('emphasized')
			} else{
				c.classList.add('not_emphasized')
			}
		}
	} else{
		for( let c of target.children ){
			c.classList.remove('emphasized')
			c.classList.remove('not_emphasized')
		}
	}
	

}


</script>

<template>
	<div class='potion'>
		<header>
			<strong>{{ potion.value }}</strong>
			<span :class="potion.is_poison ? 'is_poison' : 'is_potion'">
				{{ potion.is_poison ? i18n.getTerm('iface', 'poison') : i18n.getTerm('iface', 'potion') }} {{ i18n.getTerm('effects', potion.alias, 'name', 1) }}
			</span>
		</header>

		<div class='ingredients'>
			<span 
				v-for="(ingredient, alias) in potion.ingredients"
				@mouseenter="(e) => highlight( e, ingredient.effects )"
				@mouseleave="(e) => highlight( e )"
				:data-alias="alias"
				:class='["dropable", "icon", alias]' 
				>
					<a @click="toggle( ingredient, alias, 'ingredients' )">☓</a>
					{{ i18n.getTerm('ingredients', alias, 'name') }}
					
			</span>
		</div>

		<div class='effects'>
			<span 
				v-for="effect in Object.keys( potion.eeffects ) "
				@mouseenter="(e) => highlight( e, potion.effects[effect].ingredients )"
				@mouseleave="(e) => highlight( e )"
				:data-alias="effect"
				:class="[ potion.eeffects[effect].poison ? 'harmfull' : 'harmless', 'dropable' ]"
				>
					{{ i18n.getTerm('effects', effect, 'name') }}
					<a @click="toggle( potion.effects[effect], effect, 'effects' )">☓</a>
			</span>
		</div>

		<div class='details'>
			<span 
				v-for="effect in Object.keys( potion.eeffects ) "
				>
				{{ i18n.getTerm(
						'effects', 
						effect, 
						'description', 
						0,
						{
							'<mag>': potion.eeffects[effect].magnitude,
							'<dur>': potion.eeffects[effect].duration,
						}
					)
				}}
			</span>
		</div>
	</div>
</template>
