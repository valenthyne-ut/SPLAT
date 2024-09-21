<script setup lang="ts">
</script>

<template>
	<span class="spinner">
		<p class="hidden">Loading...</p>
	</span>
</template>

<style lang="scss" scoped>
	.spinner {
		width: 3ch;
		height: 3ch;

		border: 4px solid #e4e4e7;
		border-top-color: #4f46e5;
		border-radius: 100%;

		animation: spin 2s infinite linear;
	}

	.hidden {
		visibility: hidden;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
</style>