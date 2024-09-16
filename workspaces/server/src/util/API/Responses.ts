import { Response } from "express";
import { JSONPrimitive } from "@/types/API/JSONPrimitive.js";

function statusCodeErrorResponse(response: Response, error: string, code: number) {
	response.status(code).json({
		error: error
	});
}

export function notImplemented(response: Response) {
	statusCodeErrorResponse(response, "Not implemented.", 501);
}

export function clientErrorResponse(response: Response, error: string) {
	statusCodeErrorResponse(response, error, 400);
}

export function serverErrorResponse(response: Response, error: string) {
	statusCodeErrorResponse(response, error, 500);
}

export function invalidRequestParameterResponse(response: Response, name: string, type: JSONPrimitive) {
	clientErrorResponse(response, `Parameter '${name}' isn't defined or isn't of type '${type}'.`);
}

export function unauthorized(response: Response) {
	statusCodeErrorResponse(response, "Unauthorized.", 401);
}
