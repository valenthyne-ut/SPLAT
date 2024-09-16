import { AXRFTokenFilter, RateLimiterFilter } from "@/api/Filters.js";
import { logger } from "@/config/Logger.js";
import { clientErrorResponse, notImplemented, serverErrorResponse } from "@/util/API/Responses.js";
import { unrollError } from "@/util/Errors.js";
import { randomBytes } from "crypto";
import { RequestHandler, Router } from "express";
import { AuthPOSTRequestFilter } from "./Filters.js";
import passport from "passport";
import { User } from "@/database/models/User.js";
import { Options as RateLimiterOptions } from "express-rate-limit";

const LoginRateLimitOptions: Partial<RateLimiterOptions> = {
	windowMs: 60 * 1000, // 1m
	limit: 5,
	standardHeaders: "draft-7",
	legacyHeaders: false,
	message: { "error": "Too many login attempts. Please try again in 60s." },
	skipSuccessfulRequests: true
};

export const authApiRouter = Router()
	.get("/", (request, response) => {
		return notImplemented(response);
	})
	.get("/axrf-token", RateLimiterFilter(), (request, response) => { // Also known as CSRF tokens
		try {
			const axrfToken = randomBytes(32).toString("hex");
			request.session["axrf-token"] = axrfToken;
			return response.status(200).cookie("axrf", axrfToken, {
				httpOnly: true,
				sameSite: "strict",
				secure: true,
				maxAge: new Date().getTime() + (60 * 10 * 1000)
			}).json({});
		} catch(error) {
			logger.log("error", "An error occurred while generating an AXRF token.");
			logger.log("error", unrollError(error, true));
			return serverErrorResponse(response, "Something went wrong while generating an AXRF token for you.");
		}
	})
	.post("/", RateLimiterFilter(LoginRateLimitOptions), AXRFTokenFilter, AuthPOSTRequestFilter, (request, response, next) => {
		(passport.authenticate("password", (authError: Error | null, user: User) => {
			if(authError) {
				return clientErrorResponse(response, authError.message);
			}

			request.login(user, (loginError) => {
				if(loginError) {
					logger.log("error", "An error occurred while logging someone in.");
					logger.log("error", unrollError(loginError, true));
					return serverErrorResponse(response, "Something went wrong while logging you in. Please, try again.");
				}

				return response.status(200).json({
					name: user.name
				});
			});
		}) as RequestHandler)(request, response, next);
	})
	.delete("/", (request, response) => {
		return notImplemented(response);
	});