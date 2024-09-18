<script setup lang="ts">
	import ToastHolder from "./components/Toasts/ToastHolder.vue";
	import { useToastStore } from "./stores/Toast";

	const toastStore = useToastStore();
</script>

<template>
	<RouterView />
	<ToastHolder />
</template>

<style lang="scss" scoped>
</style>
