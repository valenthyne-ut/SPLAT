<script setup lang="ts">
	import Instances from "@/classes/API/Instances";
	import router from "@/router";
	import { useAuthStore } from "@/stores/Auth";
	import { useAXRFStore } from "@/stores/AXRF";
	import { useToastStore } from "@/stores/Toast";
	import { unrollError } from "@/util/Errors";

	const toastStore = useToastStore();
	const axrfStore = useAXRFStore();
	const authStore = useAuthStore();
	const authAPI = Instances.AUTH;

	async function attemptLogout() {
		try {
			await authAPI.deauthenticate(axrfStore.token);
			authStore.setAuthentication(false);
			authStore.setUsername("");
			authStore.touchAuthenticationLastChecked();
			axrfStore.token = "";
			toastStore.pushToast("Successfully logged out.", "success");
			await router.push("/login");
		} catch(error) {
			toastStore.pushToast(unrollError(error).message, "error", 5);
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