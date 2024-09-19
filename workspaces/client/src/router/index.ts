import { createRouter, createWebHistory, type RouteLocationNormalized } from "vue-router";
import { routes } from "./Routes";
import { useAuthStore } from "@/stores/Auth";
import Instances from "@/classes/API/Instances";
import { useToastStore } from "@/stores/Toast";
import { unrollError } from "@/util/Errors";

const DEFAULT_TITLE = "SPLAT";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
});

function setTitle(to: RouteLocationNormalized) {
	if(to.meta.title) { document.title = to.meta.title; }
	else { document.title = DEFAULT_TITLE; }
}

router.beforeEach(async (to) => {
	const toastStore = useToastStore();
	const authStore = useAuthStore();
	const authAPI = Instances.AUTH;

	if(authStore.authenticationNeedsCheck()) {
		try {
			const response = await authAPI.getAuthStatus();
			if(response.authenticated) {
				authStore.setAuthentication(true);
				authStore.setUsername(response.name);
				authStore.touchAuthenticationLastChecked();
			}
		} catch(error) {
			toastStore.pushToast(unrollError(error).message, "error");
		}
	}

	if(to.meta.requiresAuth && !authStore.authenticated) { return "/login"; }
});

router.afterEach((to) => {
	setTitle(to);
});

export default router;
