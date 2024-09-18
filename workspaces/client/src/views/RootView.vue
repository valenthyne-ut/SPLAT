<script setup lang="ts">
	import Instances from "@/classes/API/Instances";
	import router from "@/router";
	import { useAuthStore } from "@/stores/Auth";

	const authStore = useAuthStore();
	const authAPI = Instances.AUTH;

	async function attemptLogout() {
		try {
			await authAPI.getAXRFToken();
			await authAPI.deauthenticate();
			authStore.setAuthentication(false);
			authStore.setUsername("");
			authStore.touchAuthenticationLastChecked();
			await router.push("/login");
		} catch(error) {
			console.log(error);
		}
	}
</script>

<template>
	<section>
		<span>Logged in as <strong>{{ authStore.username }}</strong></span>
		<button @click.passive="attemptLogout" type="button" class="logout-button">Log out</button>
	</section>
</template>

<style lang="scss" scoped>
	section {
		padding: 1em;
	}

	.logout-button {
		margin-left: 1em;
		padding: 0.5em 1em;

		border-radius: 4px;

		color: #ffffff;
		background-color: #dc2626;
	}
</style>