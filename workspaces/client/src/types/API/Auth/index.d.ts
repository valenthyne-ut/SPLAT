export type AuthGETAXRFTokenResponse = {
	token: string;
}

export type AuthGETStatusResponse =
	| { 
		authenticated: true; 
		name: string;
		expiresAt: number;
	} | { 
		authenticated: false; 
		name: null;
		expiresAt: null;
	}

export type AuthPOSTLoginResponse = { 
	name: string;
	token: string;
	expiresAt: number;
}