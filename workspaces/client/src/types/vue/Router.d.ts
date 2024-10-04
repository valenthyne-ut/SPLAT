import "vue-router";

export {};

declare module "vue-router" {
	export interface RouteMeta {
		/**
		 * The route's title, displayed to the user on the tab's title.
		 */
		title: string;
		/**
		 * Whether this route requires the user to be authenticated to be accessed.
		 * Automatically sends the user to the login page if this is set to true and
		 * they're not authenticated.
		 */
		requiresAuth: boolean;
		/**
		 * Whether this route should be listed in the navigation sidebar.
		 */
		displayInNavbar: boolean;
		/**
		 * The icon to display in the navigation sidebra.
		 */
		navbarIcon?: string;
	}
}