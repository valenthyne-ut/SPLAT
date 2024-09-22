import { AXRFTokenFilter, RateLimiterFilter } from "@/api/Filters.js";
import { logger } from "@/config/Logger.js";
import { clientErrorResponse, serverErrorResponse, unauthorized } from "@/util/API/Responses.js";
import { unrollError } from "@/util/Errors.js";
import { randomBytes } from "crypto";
import { RequestHandler, Router } from "express";
import { AuthPOSTRequestFilter } from "./Filters.js";
import passport from "passport";
import { User } from "@/database/models/User.js";
import { Options as RateLimiterOptions } from "express-rate-limit";
import config from "@/config/index.js";

const LoginRateLimitOptions: Partial<RateLimiterOptions> = {
	windowMs: 60 * 1000, // 1m
	limit: 5,
	standardHeaders: "draft-7",
	legacyHeaders: false,
	message: { "error": "Too many login attempts. Please try again in 60s." },
	skipSuccessfulRequests: true
};

const AXRFTokenRateLimitOptions: Partial<RateLimiterOptions> = {
	windowMs: 60 * 5 * 1000, // 5m,
	limit: 100,
	standardHeaders: "draft-7",
	legacyHeaders: false,
	message: { "error": "Too many requests. Please try again in 5m." }
};

export const authApiRouter = Router()
	.get("/", passport.authenticate("session") as RequestHandler, (request, response) => {
		if(request.user) {
			return response.status(200).json({
				authenticated: true,
				name: request.user.name,
				expiresAt: Math.floor((Date.now() + (request.session.cookie.maxAge || config.MAX_SESSION_TIME * 1000)) / 1000)
			});
		} else {
			return response.status(200).json({
				authenticated: false
			});
		}
	})
	.get("/axrf-token", RateLimiterFilter(AXRFTokenRateLimitOptions), (request, response) => { // Also known as CSRF tokens
		try {
			const axrfToken = randomBytes(32).toString("hex");
			request.session["axrf-token"] = axrfToken;
			return response.status(200).json({
				"token": axrfToken
			});
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

				const axrfToken = randomBytes(32).toString("hex");
				request.session["axrf-token"] = axrfToken;

				return response.status(200).json({
					name: user.name,
					token: axrfToken,
					expiresAt: Math.floor((Date.now() + (request.session.cookie.maxAge || config.MAX_SESSION_TIME * 1000)) / 1000)
				});
			});
		}) as RequestHandler)(request, response, next);
	})
	.delete("/", AXRFTokenFilter, passport.authenticate("session") as RequestHandler, (request, response) => {
		if(request.user) {
			request.session.destroy((logoutError) => {
				if(logoutError) {
					logger.log("error", "An error occurred while logging someone out.");
					logger.log("error", unrollError(logoutError, true));
					return serverErrorResponse(response, "Something went wrong while logging you out.");
				}
				return response.status(200).json({});
			});
		} else {
			return unauthorized(response);
		}
	});