<script setup lang="ts">
	import vIcon from "@/components/vIcon.vue";
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
				<input type="text" id="username-input">
			</label>
			<label for="password-input" class="input-label-holder">
				<span class="input-label">
					<vIcon icon-name="key" :fill-variant="true"/>
					Password
				</span>
				<input type="password" id="password-input">
			</label>
			<button type="button" class="submit-button">Submit</button>
		</form>
	</section>
</template>

<style lang="scss" scoped>
	#login {
		width: 100%;

		display: flex;

		justify-content: center;
		align-items: center;
	}

	#login-form {
		width: 20%;

		display: flex;
		flex-direction: column;
		gap: 1em;

		align-items: center;
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