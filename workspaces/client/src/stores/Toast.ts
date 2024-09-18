import { Toast, type ToastType } from "@/classes/Toast";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useToastStore = defineStore("toast", () => {
	const toasts = ref<Toast[]>([]);

	function getToastById(id: string) {
		return toasts.value.find(toast => toast.id === id);
	}

	function pushToast(message: string, type: ToastType, destroyAfter: number = 3) {
		toasts.value.push(new Toast(message, type, destroyAfter));
	}

	function removeToast(id: string) {
		toasts.value = toasts.value.filter(toast => toast.id !== id);
	}

	return { toasts, getToastById, pushToast, removeToast };
});