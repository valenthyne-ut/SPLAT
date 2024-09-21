import { Request } from "express";
import { NonIndempotentRequest } from "../index.js";

export interface AuthPOSTRequest extends Request {
	body: NonIndempotentRequest["body"] & {
		username: string | undefined;
		password: string | undefined;
	}
}