<script setup lang="ts">
	import vIcon from "@/components/vIcon.vue";
	import { ref, computed, type InputTypeHTMLAttribute } from "vue";

	const props = defineProps<{
		valueVisibleInputType: InputTypeHTMLAttribute;
		valueInvisibleInputType: InputTypeHTMLAttribute;
	}>();

	const inputType = defineModel<InputTypeHTMLAttribute>(); 

	const valueVisible = ref<boolean>(false);
	const visibleTimer = ref<number>(0);
	const visibleTimerId = ref<number | undefined>();

	const computed_visibilityIconName = computed(() => {
		return valueVisible.value ? "eye-slash" : "eye";
	});

	function toggleVisibility() {
		if(!valueVisible.value) {
			valueVisible.value = true;
			visibleTimer.value = 5;
			inputType.value = props.valueVisibleInputType;

			visibleTimerId.value = setInterval(() => {
				visibleTimer.value--;
				if(visibleTimer.value <= 0) {
					valueVisible.value = false;
					clearInterval(visibleTimerId.value);
					inputType.value = props.valueInvisibleInputType;
				}
			}, 1000);
		} else {
			valueVisible.value = false;
			visibleTimer.value = 0;
			clearInterval(visibleTimerId.value);
			inputType.value = props.valueInvisibleInputType;
		}
	}
</script>

<template>
	<button 
		type="button"
		@click.passive="toggleVisibility"
		class="input-value-visible-toggle">
		<span v-if="valueVisible" class="input-value-visible-timer">{{ visibleTimer }}s</span>
		<vIcon 
			:icon-name="computed_visibilityIconName" 
			:fill-variant="true" 
			accessibility-label="Toggle input value visibility"
		/>
	</button>
</template>

<style lang="scss" scoped>
	.input-value-visible-toggle {
		display: flex;
		justify-content: right;

		margin-left: 0.3em;
	}

	.input-value-visible-timer {
		min-width: 2ch;
		margin-right: 0.3em;

		font-weight: bold;
	}
</style>