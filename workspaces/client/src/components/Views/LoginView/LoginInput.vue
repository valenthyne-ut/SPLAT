<script setup lang="ts">
	import vIcon from "@/components/vIcon.vue";
	import type { InputTypeHTMLAttribute } from "vue";

	const props = defineProps<{
		id: string;
		type: InputTypeHTMLAttribute;
		labelText: string;
		icon?: {
			name: string;
			accessibilityLabel: string;
		}
	}>();

	const inputValue = defineModel<string>();
</script>

<template>
	<label :for="`${id}-input`" class="input-label-holder">
		<span class="input-label">
			<vIcon v-if="icon" :icon-name="icon.name" :fill-variant="true" :accessibility-label="icon.accessibilityLabel" />
			{{ labelText }}
		</span>
		<input :id="`${id}-input`" v-model="inputValue" :type="props.type">
		<slot />
	</label>
</template>

<style lang="scss" scoped>
	.input-label-holder {
		position: relative;

		display: flex;

		width: 100%;

		padding: 0.75em 0.5em;
		border: 2px solid #d4d4d8;
		border-radius: 4px;

		transition: 150ms border-color;
		cursor: text;

		&:focus-within {
			border-color: #2563eb;

			.input-label {
				color: #2563eb;
			}
		}
	}

	.input-label {
		position: absolute;
		left: 6px;
		top: -12px;

		padding: 0 0.3em;

		background-color: #ffffff;
		transition: 150ms color;
	}

	input {
		flex-grow: 1;
		outline: none;
	}
</style>