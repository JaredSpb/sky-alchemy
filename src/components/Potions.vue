<script setup>
import { ref, onMounted } from 'vue';

import Potion from './Potion.vue';

const emit = defineEmits(['iToggled', 'potionsMounted', 'eToggled']);

defineProps({
	potions: Array,
});

onMounted(() => emit('potionsMounted'));
</script>

<template>
	<div class='potions' :data-empty="i18n.getTerm('iface', 'no_potions')">
		<div class='progress' v-if="potions.progress !== false" :style="'--progress:' + potions.progress" :data-progress="potions.progress"></div>
		<Potion v-for="potion in potions.potions.value" :potion="potion" />
	</div>
</template>

