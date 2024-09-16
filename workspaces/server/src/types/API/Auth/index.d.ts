import { Request } from "express";

export interface AuthPOSTRequest extends Request {
	body: {
		username: string | undefined;
		password: string | undefined;
	}
}