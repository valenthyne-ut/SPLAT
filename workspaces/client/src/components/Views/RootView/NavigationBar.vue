<script setup lang="ts">
	import vIcon from "@/components/vIcon.vue";
	import UserDetails from "./UserDetails.vue";

</script>

<template>
	<section class="navigation-bar-holder">
		<nav class="navigation-bar">
			<h1>
				<vIcon icon-name="water" />
				<span>SPLAT</span>
			</h1>
			<ul class="navigation-links">

			</ul>
			<UserDetails />
		</nav>
		<button
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
	}

	.navigation-bar {
		flex-grow: 1;

		display: flex;
		flex-direction: column;
		
		padding: 1em;

		border-right: 1px solid #e4e4e7;
	}

	h1 {
		margin-bottom: 0.5em;

		text-align: center;

		font-size: x-large;
		font-weight: bold;
	}

	h1 span {
		margin-left: 0.5ch;
	}

	.navigation-bar h1 {
		font-size: x-large;
		font-weight: bold;
	}

	.user-details {
		margin-top: auto;
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
	}
</style>