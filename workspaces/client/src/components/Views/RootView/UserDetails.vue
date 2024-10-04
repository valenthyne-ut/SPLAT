<script setup lang="ts">
	import Instances from "@/classes/API/Instances";
	import vIcon from "@/components/vIcon.vue";
	import router from "@/router";
	import { useAuthStore } from "@/stores/Auth";
	import { useAXRFStore } from "@/stores/AXRF";
	import { useToastStore } from "@/stores/Toast";
	import { unrollError } from "@/util/Errors";

	defineProps<{
		collapsed: boolean;
	}>();

	const toastStore = useToastStore();

	const authStore = useAuthStore();
	const axrfStore = useAXRFStore();

	const authAPI = Instances.AUTH;

	async function attemptLogout() {
		try {
			await authAPI.deauthenticate(axrfStore.token);
			authStore.setAuthentication(false);
			authStore.touchAuthenticationLastChecked();
			authStore.setExpiresAt(0);
			axrfStore.token = "";
			localStorage.removeItem("axrf-token");
			toastStore.pushToast("Successfully logged out.", "success");
			await router.push("/login");
		} catch(error) {
			toastStore.pushToast(unrollError(error).message, "error", 5);
		}
	}
</script>

<template>
	<section class="user-details">
		<span class="account">
			<span v-if="!collapsed">Logged in as</span>
			<strong>{{ authStore.username }}</strong>
		</span>
		<button 
			@click.passive="attemptLogout"
			type="button" 
			class="logout-button"
		>
			<vIcon icon-name="door-closed" :fill-variant="true" accessibility-label="Log out"/>
			<span v-if="!collapsed">Log out</span>
		</button>
	</section>
</template>

<style lang="scss" scoped>
	.user-details {
		display: flex;
		flex-direction: column;

		align-items: center;

		text-wrap: nowrap;
	}

	.account {
		margin-bottom: 0.5em;
	}

	.account span {
		margin-right: 0.5ch;
	}

	.logout-button {
		width: 100%;
		
		padding: 0.5em 0;

		border-radius: 4px;

		font-weight: bold;

		color: #ffffff;
		background-color: #dc2626;

		transition: background-color 150ms;

		&:hover {
			background-color: #ef4444;
		}

		&:active {
			background-color: #dc2626;
		}
	}

	.logout-button span {
		margin-left: 0.5ch;
	}
</style>