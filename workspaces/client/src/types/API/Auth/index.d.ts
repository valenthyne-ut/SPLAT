export type AuthGETStatusResponse =
	| { authenticated: true; name: string; }
	| { authenticated: false; name: null; }

export type AuthPOSTLoginResponse = { name: string; }