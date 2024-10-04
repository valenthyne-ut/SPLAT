<script setup lang="ts">
	import NavigationBar from "@/components/Views/RootView/NavigationBar.vue";
</script>

<template>
	<NavigationBar />
	<main>
		<RouterView />
	</main>
</template>

<style lang="scss" scoped>
	main {
		margin: 1em 1em 1em 0;
	}
</style>