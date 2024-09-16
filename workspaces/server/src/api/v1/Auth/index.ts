import { logger } from "@/config/Logger.js";
import { notImplemented, serverErrorResponse } from "@/util/API/Responses.js";
import { unrollError } from "@/util/Errors.js";
import { randomBytes } from "crypto";
import { Router } from "express";

export const authApiRouter = Router()
	.get("/", (request, response) => {
		return notImplemented(response);
	})
	.get("/axrf-token", (request, response) => { // Also known as CSRF tokens
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
	.post("/", (request, response) => {
		return notImplemented(response);
	})
	.delete("/", (request, response) => {
		return notImplemented(response);
	});