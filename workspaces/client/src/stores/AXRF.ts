import { defineStore } from "pinia";
import { ref } from "vue";

export const useAXRFStore = defineStore("axrf", () => {
	const token = ref<string>("");
	return { token };
});