declare global {
	module "express-session" {
		interface SessionData {
			["axrf-token"]?: string;
		}
	}
}