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
	#toast-holder {
		z-index: 1;

		position: absolute;
		bottom: 2em;
		right: 2em;
		
		width: 25%;

		pointer-events: none;

		max-height: 50vh;

		overflow: auto;

		display: flex;
		flex-direction: column;

		gap: 1em;
	}
</style>