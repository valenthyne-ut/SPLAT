import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url))
		}
	},
	server: {
		proxy: {
			"/api": {
				// Development server runs on port 8443 but don't forget 
				// to change it here if you change it on the server side,
				// otherwise you won't be able to talk to the API.
				target: "https://localhost:8443", 
				secure: false
			}
		}
	},
	base: "./"
});
