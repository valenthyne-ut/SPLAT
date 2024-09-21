import type { AuthGETAXRFTokenResponse, AuthGETStatusResponse, AuthPOSTLoginResponse } from "@/types/API/Auth/index";
import { GenericAPI, HTTPMethods } from ".";

export class AuthAPI extends GenericAPI {
	constructor() {
		super(GenericAPI.DEFAULT_ROOT_PATH + "/auth");
	}

	async getAuthStatus() {
		return await this.call(this.rootPath, HTTPMethods.GET) as AuthGETStatusResponse;
	}

	async getAXRFToken() {
		return await this.call(this.rootPath + "/axrf-token", HTTPMethods.GET) as AuthGETAXRFTokenResponse;
	}

	async authenticate(arxfToken: string, username: string, password: string) {
		return await this.call(this.rootPath, HTTPMethods.POST, {
			body: JSON.stringify({
				"axrf-token": arxfToken,
				username: username,
				password: password
			})
		}) as AuthPOSTLoginResponse;
	}

	async deauthenticate(axrfToken: string) {
		return await this.call(this.rootPath, HTTPMethods.DELETE, {
			body: JSON.stringify({
				"axrf-token": axrfToken
			})
		}) as void;
	}
}