import { Router } from "express";
import { authApiRouter } from "./Auth/index.js";

export const v1apiRouter = Router()
	.use("/auth", authApiRouter);