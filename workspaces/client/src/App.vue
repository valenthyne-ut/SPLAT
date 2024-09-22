<script setup lang="ts">
	import { onMounted } from "vue";
	import ToastHolder from "./components/Toasts/ToastHolder.vue";
	import { useAuthStore } from "./stores/Auth";
	import { useAXRFStore } from "./stores/AXRF";

	onMounted(() => {
		const authStore = useAuthStore();
		const axrfStore = useAXRFStore();

		document.addEventListener("visibilitychange", () => {
			const visibilityState = document.visibilityState;
			if(visibilityState === "hidden") {
				const shouldStoreAXRFToken = axrfStore.token !== "" && !authStore.authenticationNeedsCheck() && authStore.authenticated;
				if(shouldStoreAXRFToken) {
					localStorage.setItem("axrf-token", `${axrfStore.token}.${authStore.expiresAt.toFixed()}`);
				}
			}
		});

		const storedAXRFToken = localStorage.getItem("axrf-token");
		if(storedAXRFToken) {
			const parsedAXRFToken = storedAXRFToken.split(".");
			try {
				const token = parsedAXRFToken[0];
				const expiresAt = parseInt(parsedAXRFToken[1]);

				if(expiresAt && Date.now() / 1000 < expiresAt) {
					axrfStore.token = token;
				}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch(error) {
				console.log("Couldn't parse AXRF token from localStorage.");
			}
		}
	});
</script>

<template>
	<RouterView />
	<ToastHolder />
</template>

<style lang="scss" scoped>
</style>
