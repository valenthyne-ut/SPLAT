import { rateLimit, Options as RateLimiterOptions } from "express-rate-limit";

export function RateLimiterFilter(options?: RateLimiterOptions) {
	const defaultOptions: Partial<RateLimiterOptions> = {
		windowMs: 10 * 60 * 1000, // 10m
		limit: 5,
		standardHeaders: "draft-7",
		legacyHeaders: false
	};
	return rateLimit(options || defaultOptions);
}