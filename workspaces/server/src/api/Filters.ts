import { NonIndempotentRequest } from "@/types/API/index.js";
import { unauthorized } from "@/util/API/Responses.js";
import { NextFunction, Response } from "express";
import { rateLimit, Options as RateLimiterOptions } from "express-rate-limit";

export function RateLimiterFilter(options?: Partial<RateLimiterOptions>) {
	const defaultOptions: Partial<RateLimiterOptions> = {
		windowMs: 10 * 60 * 1000, // 10m
		limit: 5,
		standardHeaders: "draft-7",
		legacyHeaders: false,
		message: { error: "Too many requests. Please try again later." }
	};
	return rateLimit(options || defaultOptions);
}

export function AXRFTokenFilter(request: NonIndempotentRequest, response: Response, next: NextFunction) {
	const sessionToken = request.session["axrf-token"];
	const userToken = request.body["axrf-token"];
	if(!sessionToken) { return unauthorized(response); }
	if(!userToken) { return unauthorized(response); }
	if(sessionToken !== userToken) { return unauthorized(response); }

	next();
}