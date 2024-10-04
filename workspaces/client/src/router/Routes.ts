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
			requiresAuth: true,
			displayInNavbar: false
		},

		children: [
			{
				name: "home",
				path: "/",

				component: () => import("@/views/HomeView.vue"),

				meta: {
					title: "Home",
					requiresAuth: true,
					displayInNavbar: true,
					navbarIcon: "house-fill"
				}
			},
			{
				name: "users",
				path: "/users",

				component: () => import("@/views/UsersView.vue"),

				meta: {
					title: "Users",
					requiresAuth: true,
					displayInNavbar: true,
					navbarIcon: "person-fill"
				}
			},
			{
				name: "settings",
				path: "/settings",

				component: () => import("@/views/SettingsView.vue"),

				meta: {
					title: "Settings",
					requiresAuth: true,
					displayInNavbar: true,
					navbarIcon: "gear-fill"
				}
			}
		]
	},
	{
		name: "login",
		path: "/login",

		component: LoginView as Component,

		meta: {
			title: "Login",
			requiresAuth: false,
			displayInNavbar: false
		}
	}
];