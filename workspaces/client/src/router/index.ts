import { createRouter, createWebHistory, type RouteLocationNormalized } from "vue-router";
import { routes } from "./Routes";

const DEFAULT_TITLE = "SPLAT";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
});

function setTitle(to: RouteLocationNormalized) {
	if(to.meta.title) { document.title = to.meta.title; }
	else { document.title = DEFAULT_TITLE; }
}

router.afterEach((to) => {
	setTitle(to);
});

export default router;
