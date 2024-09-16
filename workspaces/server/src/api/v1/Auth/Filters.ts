import { AuthPOSTRequest } from "@/types/API/Auth/index.js";
import { isRequestParameterString } from "@/util/API/Requests.js";
import { clientErrorResponse, invalidRequestParameterResponse } from "@/util/API/Responses.js";
import { NextFunction, Response } from "express";

export function AuthPOSTRequestFilter(request: AuthPOSTRequest, response: Response, next: NextFunction) {
	const { username, password } = request.body;

	if(!isRequestParameterString(username)) { return invalidRequestParameterResponse(response, "username", "string"); }
	if(!isRequestParameterString(password)) { return invalidRequestParameterResponse(response, "password", "string"); }

	if(username.trim().length == 0) { return clientErrorResponse(response, "Username is required."); }
	if(password.trim().length == 0) { return clientErrorResponse(response, "Password is required."); }

	next();
}