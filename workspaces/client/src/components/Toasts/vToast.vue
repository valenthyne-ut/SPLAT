<script setup lang="ts">
	import { useToastStore } from "@/stores/Toast";
	import { computed, onMounted, ref } from "vue";
	import vIcon from "../vIcon.vue";

	const timeouts = ref<[number | undefined, number | undefined]>([undefined, undefined]);
	const toastStore = useToastStore();

	const props = defineProps<{
		toastId: string
	}>();

	const toast = computed(() => {
		return toastStore.getToastById(props.toastId)!;
	});

	const computed_dissappearClass = computed(() => {
		return toast.value.disappearing ? "disappear" : "";
	});

	onMounted(() => {
		timeouts.value[0] = setTimeout(() => {
			toast.value.disappearing = true;

			timeouts.value[1] = setTimeout(() => {
				toastStore.removeToast(toast.value.id);
			}, 1000);
		}, (toast.value.destroyAfter - 1) * 1000);
	});

	function clearTimeouts() {
		for(const timeout of timeouts.value) { clearTimeout(timeout); }
	}

	function dismiss() { 
		clearTimeouts();
		toastStore.removeToast(toast.value.id);
	}
</script>

<template>
	<div class="toast" :class="[toast.type, computed_dissappearClass]">
		<span class="message">{{ toast.message }}</span>
		<button type=button @click.passive="dismiss">
			<vIcon icon-name="x-lg"/>
		</button>
	</div>
</template>

<style lang="scss" scoped>
	.toast {
		display: flex;

		padding: 1em;
		border-radius: 8px;

		&.success {
			background-color: #dcfce7;
			border: 1px solid #16a34a;
		}

		&.info {
			background-color: #e0e7ff;
			border: 1px solid #4f46e5;
		}

		&.alert {
			background-color: #fef9c3;
			border: 1px solid #ca8a04;
		}

		&.error {
			background-color: #fee2e2;
			border: 1px solid #dc2626;
		}

		&.disappear {
			animation: disappear 1s forwards;
		}
	}

	.toast button {
		pointer-events: all;
		margin-left: auto;
	}

	@keyframes disappear {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
			display: none;
		}
	}
</style>