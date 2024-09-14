import "vue-router";

export {};

declare module "vue-router" {
	export interface RouteMeta {
		/**
		 * The route's title, displayed to the user on the tab's title.
		 */
		title: string;
	}
}