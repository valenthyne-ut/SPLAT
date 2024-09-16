import { notImplemented } from "@/util/API/Responses.js";
import { Router } from "express";

export const authApiRouter = Router()
	.get("/", (request, response) => {
		return notImplemented(response);
	})
	.get("/axrf-token", (request, response) => {
		return notImplemented(response);
	})
	.post("/", (request, response) => {
		return notImplemented(response);
	})
	.delete("/", (request, response) => {
		return notImplemented(response);
	});