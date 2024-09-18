import LoginView from "@/views/LoginView.vue";
import RootView from "@/views/RootView.vue";
import type { Component } from "vue";
import type { RouteRecordRaw } from "vue-router";

export const routes: readonly RouteRecordRaw[] = [
	{
		name: "root",
		path: "/",

		component: RootView as Component,

		meta: {
			title: "Home",
			requiresAuth: true
		}
	},
	{
		name: "login",
		path: "/login",

		component: LoginView as Component,

		meta: {
			title: "Login",
			requiresAuth: false
		}
	}
];