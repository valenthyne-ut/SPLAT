import RootView from "@/views/RootView.vue";
import type { Component } from "vue";
import type { RouteRecordRaw } from "vue-router";

export const routes: readonly RouteRecordRaw[] = [
	{
		name: "root",
		path: "/",

		component: RootView as Component,

		meta: {
			title: "Home"
		}
	}
];