import { Request } from "express";

export interface NonIndempotentRequest extends Request {
	body: {
		["axrf-token"]: string | undefined;
	}
}