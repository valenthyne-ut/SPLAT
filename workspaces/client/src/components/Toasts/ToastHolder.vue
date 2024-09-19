<script setup lang="ts">
	import { useToastStore } from "@/stores/Toast";
	import vToast from "./vToast.vue";

	const toastStore = useToastStore();
</script>

<template>
	<div id="toast-holder">
		<vToast v-for="toast in toastStore.toasts" :key="toast.id" :toast-id="toast.id"/>
	</div>
</template>

<style lang="scss" scoped>
	@use "sass:map";
	@use "../../assets/variables";

	#toast-holder {
		z-index: 1;

		position: absolute;
		bottom: 2em;

		pointer-events: none;

		max-height: 50vh;

		overflow: auto;

		display: flex;
		flex-direction: column;

		gap: 1em;

		@media screen and (min-width: map.get(variables.$BREAKPOINTS, "xsm")){
			width: 100%;
			padding: 0 2em;

			opacity: 0.75;
		}

		@media screen and (min-width: map.get(variables.$BREAKPOINTS, "sm")) {
			right: 2em;
			width: 45%;

			padding: 0;

			opacity: 1;
		}

		@media screen and (min-width: map.get(variables.$BREAKPOINTS, "md")){
			width: 40%;
		}

		@media screen and (min-width: map.get(variables.$BREAKPOINTS, "lg")) {
			width: 35%;
		}

		@media screen and (min-width: map.get(variables.$BREAKPOINTS, "xl")){
			width: 30%;
		}

		@media screen and (min-width: map.get(variables.$BREAKPOINTS, "2xl")){
			width: 25%;
		}
	}
</style>