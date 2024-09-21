<script setup lang="ts">
	import Instances from "@/classes/API/Instances";
	import InputValueToggle from "@/components/Views/LoginView/InputValueToggle.vue";
	import LoginInput from "@/components/Views/LoginView/LoginInput.vue";
	import VSpinner from "@/components/vSpinner.vue";
	import router from "@/router";
	import { useAuthStore } from "@/stores/Auth";
	import { useToastStore } from "@/stores/Toast";
	import { unrollError } from "@/util/Errors";
	import { ref, type InputTypeHTMLAttribute } from "vue";

	const toastStore = useToastStore();
	const authStore = useAuthStore();
	const authAPI = Instances.AUTH;

	const username = ref<string>("");
	const password = ref<string>("");

	const passwordInputType = ref<InputTypeHTMLAttribute>("password");

	const loading = ref<boolean>(false);

	async function attemptLogin() {
		loading.value = true;
		try {
			await authAPI.getAXRFToken();
			const response = await authAPI.authenticate(username.value, password.value);
			authStore.setAuthentication(true);
			authStore.setUsername(response.name);
			authStore.touchAuthenticationLastChecked();
			toastStore.pushToast("Successfully logged in.", "success");
			await router.push("/");
		} catch(error) {
			toastStore.pushToast(unrollError(error).message, "error", 5);
		}
		loading.value = false;
	}
</script>

<template>
	<section id="login">
		<form id="login-form">
			<h1>Login</h1>
			<LoginInput 
				id="username" 
				type="text" 
				label-text="Username" 
				:disabled="loading"
				:icon="
					{ 
						name: 'person-badge', 
						accessibilityLabel: 'Username input' 
					}"
				v-model="username"
			/>
			<LoginInput
				id="password"
				:type="passwordInputType"
				label-text="Password"
				:disabled="loading"
				:icon="
					{
						name: 'key',
						accessibilityLabel: 'Password input'
					}"
				v-model="password"
			>
				<InputValueToggle 
					value-visible-input-type="text" 
					value-invisible-input-type="password" 
					v-model="passwordInputType"
				/>
			</LoginInput>
			<button v-if="!loading" @click.passive="attemptLogin" type="button" class="submit-button">Submit</button>
			<vSpinner v-else/>
		</form>
	</section>
</template>

<style lang="scss" scoped>
	@use "sass:map";
	@use "../assets/variables";

	#login {
		width: 100%;

		display: flex;

		justify-content: center;
		align-items: center;
	}

	#login-form {
		display: flex;
		flex-direction: column;
		gap: 1em;

		align-items: center;

		// #region Width responsivity
		width: variables.$COLUMN * 9;

		@media screen and (min-width: map.get(variables.$BREAKPOINTS, "xsm")) {
			width: variables.$COLUMN * 8;
		}

		@media screen and (min-width: map.get(variables.$BREAKPOINTS, "sm")) {
			width: variables.$COLUMN * 7;
		}

		@media screen and (min-width: map.get(variables.$BREAKPOINTS, "md")) {
			width: variables.$COLUMN * 6;
		}

		@media screen and (min-width: map.get(variables.$BREAKPOINTS, "lg")) {
			width: variables.$COLUMN * 5;
		}

		@media screen and (min-width: map.get(variables.$BREAKPOINTS, "xl")) {
			width: variables.$COLUMN * 4;
		}

		@media screen and (min-width: map.get(variables.$BREAKPOINTS, "2xl")) {
			width: variables.$COLUMN * 3;
		}
		// #endregion
	}

	h1 {
		font-size: x-large;
		font-weight: bold;
	}

	.submit-button {
		width: 100%;

		padding: 0.5em 0;

		border-radius: 4px;

		font-size: large;
		font-weight: bold;

		color: white;
		background-color: #2563eb;
	}
</style>