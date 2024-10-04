<script setup lang="ts">
	import vIcon from "@/components/vIcon.vue";
	import UserDetails from "./UserDetails.vue";
	import type { RouteRecordRaw } from "vue-router";
	import { computed, onBeforeMount, ref } from "vue";
	import { routes } from "@/router/Routes";
	import NavigationLink from "./NavigationLink.vue";

	type NavigableRoute = RouteRecordRaw & { meta: { displayInSidebar: true; navbarIcon: string; } };
	const navigableRoutes: NavigableRoute[] = [];

	onBeforeMount(() => {
		const rootRoute = routes.find(route => route.path === "/");
		if(!rootRoute) { throw new Error("No root route defined!"); }

		const rootRouteChildren = rootRoute.children;
		if(!rootRouteChildren) { throw new Error("No root route children defined!"); } 

		for(const route of rootRouteChildren) {
			if(route.meta && route.meta.displayInNavbar) { navigableRoutes.push(route as NavigableRoute); }
		}

		function collapseOnLgWidth() {
			if(document.body.clientWidth <= 1024) { collapsed.value = true; } 
		}

		window.addEventListener("resize", collapseOnLgWidth);

		collapseOnLgWidth();
	});

	const collapsed = ref<boolean>(false);

	function toggleCollapsed() {
		collapsed.value = !collapsed.value;
	}

	const computed_collapsedClass = computed(() => {
		return collapsed.value ? "collapsed" : "";
	});
</script>

<template>
	<section class="navigation-bar-holder" :class="computed_collapsedClass">
		<nav class="navigation-bar">
			<h1>
				<vIcon icon-name="water" />
				<span v-if="!collapsed">SPLAT</span>
			</h1>
			<ul class="navigation-links">
				<li v-for="route, index in navigableRoutes" :key="index" class="navigation-link">
					<NavigationLink
						:link-to="route.path"
						:title="route.meta.title"
						:icon-name="route.meta.navbarIcon"
						:collapsed="collapsed"
					/>
				</li>
			</ul>
			<UserDetails :collapsed="collapsed"/>
		</nav>
		<button
			@click="toggleCollapsed"
			type="button"
			class="handlebar"	
		>
			<vIcon icon-name="grip-vertical"/>
		</button>
	</section>
</template>

<style lang="scss" scoped>
	@use "../../../assets/variables";
	@use "sass:map";

	.navigation-bar-holder {
		width: variables.$COLUMN * 2;

		display: flex;

		transition: width 150ms;

		&.collapsed {
			width: calc(2em + 59px);
		}

		padding-right: 18px;

		@media screen and (min-width: map.get(variables.$BREAKPOINTS, "lg")) {
			padding-right: 0;
		}
	}

	.navigation-bar {
		flex-grow: 1;

		display: flex;
		flex-direction: column;

		overflow: auto;
		
		padding: 1em;

		border-right: 1px solid #e4e4e7;
	}

	h1 {
		margin-bottom: 0.5em;

		text-wrap: nowrap;
		text-align: center;

		font-size: x-large;
		font-weight: bold;
	}

	h1 span {
		margin-left: 0.5ch;
	}

	.navigation-links {
		display: flex;
		flex-direction: column;
		gap: 0.25em;

		margin-bottom: auto;
	}

	.user-details {
		margin-top: 1em;
	}

	.handlebar {
		z-index: 1;

		position: relative;
		left: -9px;

		align-self: center;

		height: 30%;

		border: 1px solid #e4e4e7;
		border-radius: 4px;

		background-color: #ffffff;

		transition: background-color 150ms;

		&:hover {
			background-color: #f4f4f5;
		}

		display: none;

		@media screen and (min-width: map.get(variables.$BREAKPOINTS, "lg")) {
			display: block;
		}
	}
</style>