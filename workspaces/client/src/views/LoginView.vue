<script setup lang="ts">
	import Instances from "@/classes/API/Instances";
	import vIcon from "@/components/vIcon.vue";
	import router from "@/router";
	import { useAuthStore } from "@/stores/Auth";
	import { useToastStore } from "@/stores/Toast";
	import { unrollError } from "@/util/Errors";
	import { ref } from "vue";

	const toastStore = useToastStore();
	const authStore = useAuthStore();
	const authAPI = Instances.AUTH;

	const username = ref<string>("");
	const password = ref<string>("");

	async function attemptLogin() {
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
	}
</script>

<template>
	<section id="login">
		<form id="login-form">
			<h1>Login</h1>
			<label for="username-input" class="input-label-holder">
				<span class="input-label">
					<vIcon icon-name="person-badge" :fill-variant="true"></vIcon>
					Username
				</span>
				<input v-model="username" type="text" id="username-input">
			</label>
			<label for="password-input" class="input-label-holder">
				<span class="input-label">
					<vIcon icon-name="key" :fill-variant="true"/>
					Password
				</span>
				<input v-model="password" type="password" id="password-input">
			</label>
			<button @click.passive="attemptLogin" type="button" class="submit-button">Submit</button>
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

		// # region Width responsivity
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

	.input-label-holder {
		width: 100%;

		position: relative;

		padding: 0.75em 0.5em;
		border: 2px solid #d4d4d8;
		border-radius: 4px;

		transition: 150ms border-color;

		cursor: text;

		&:focus-within {
			border-color: #2563eb;

			.input-label {
				color: #2563eb;
			}
		}
	}

	.input-label {
		position: absolute;
		left: 6px;
		top: -12px;
		
		padding: 0 0.3em;

		background-color: #ffffff;

		transition: 150ms color;

		user-select: none;
	}

	input {
		width: 100%;
		outline: none;
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