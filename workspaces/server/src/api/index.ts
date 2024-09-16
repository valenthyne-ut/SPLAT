import { Router } from "express";
import { v1apiRouter } from "./v1/index.js";

export const apiRouter = Router()
	.use("/v1", v1apiRouter);