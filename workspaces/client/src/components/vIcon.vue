<script setup lang="ts">
	import { computed } from "vue";

	const props = defineProps<{
		iconName: string,
		accessibilityLabel?: string,
		fillVariant?: boolean
	}>();

	const computed_bootstrapIconName = computed(() => {
		return "bi-" + props.iconName + (props.fillVariant ? "-fill" : "");
	});
</script>

<template>
	<i class="icon" :class="computed_bootstrapIconName">
		<span v-if="props.accessibilityLabel" class="hidden">{{ props.accessibilityLabel }}</span>
	</i>
</template>

<style lang="scss" scoped>
	.hidden {
		display: none;
	}
</style>