import { unauthorized } from "@/util/API/Responses.js";
import { NextFunction, Request, Response } from "express";
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

export function AXRFTokenFilter(request: Request, response: Response, next: NextFunction) {
	const sessionToken = request.session["axrf-token"];
	const cookieToken = request.cookies.axrf as string | undefined;
	if(!sessionToken) { return unauthorized(response); }
	if(sessionToken !== cookieToken) { return unauthorized(response); }

	next();
}