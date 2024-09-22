import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
	const authenticated = ref<boolean>(false);
	const username = ref<string>("");
	const authLastChecked = ref<number | undefined>();
	const expiresAt = ref<number>(0);

	function setAuthentication(newAuthentication: boolean) {
		authenticated.value = newAuthentication;
	}

	function setUsername(newUsername: string) {
		username.value = newUsername;
	}

	function setExpiresAt(newExpiresAt: number) {
		expiresAt.value = newExpiresAt;
	}

	function touchAuthenticationLastChecked() {
		authLastChecked.value = new Date().getTime() / 1000;
	}

	function authenticationNeedsCheck(): boolean {
		return !authLastChecked.value 
			|| authLastChecked.value + (60 * 1) < (new Date().getTime() / 1000)
			|| Date.now() / 1000 > (expiresAt.value);
	}

	return { authenticated, username, authLastChecked, expiresAt, setAuthentication, setUsername, setExpiresAt, touchAuthenticationLastChecked, authenticationNeedsCheck };
});