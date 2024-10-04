<script setup lang="ts">
	import vIcon from "@/components/vIcon.vue";

	defineProps<{
		linkTo: string;
		title: string;
		iconName: string;
	}>();
</script>

<template>
	<RouterLink :to="linkTo">
		<vIcon :icon-name="iconName" :fill-variant="true" :accessibility-label="`Navigate to ${title}`"/>
		<span>{{ title }}</span>
	</RouterLink>
</template>

<style lang="scss" scoped>
	a {
		display: inline-block;
		width: 100%;

		padding: 0.5em;

		border-radius: 4px;

		transition: color 150ms, background-color 150ms;

		&:hover {
			background-color: #e4e4e7;
		}

		&.router-link-exact-active {
			color: #ffffff;
			background-color: #2563eb;
		}
	}

	a span {
		margin-left: 0.5ch;
	}
</style>