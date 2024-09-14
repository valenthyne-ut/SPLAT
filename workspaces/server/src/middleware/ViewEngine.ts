import { logger } from "@/config/Logger.js";
import express, { Express } from "express";
import { existsSync } from "fs";
import { join } from "path";
import { renderFile } from "pug";

export function useViewEngine(app: Express, userHtdocsPath?: string) {
	let htdocsPath = join(process.cwd(), "/htdocs");
	
	if(userHtdocsPath) {
		if(existsSync(userHtdocsPath)) { htdocsPath = userHtdocsPath; }
		else { logger.log("warning", "User specified htdocs path doesn't exist. Defaulting to server working directory path."); }
	} 

	if(existsSync(htdocsPath)) {
		const assetsPath = join(htdocsPath, "/assets");
		const faviconPath = join(htdocsPath, "/favicon.ico");

		app.use("/assets", express.static(assetsPath));
		app.use("/favicon.ico", express.static(faviconPath));

		app.engine("html", renderFile);
		app.set("view engine", "html");
		app.set("views", htdocsPath);

		app
			.get(["/", "/login"], (request, response) => {
				return response.render("index.html");
			})
			.get("*", (request, response) => {
				return response.redirect("/");
			});
	} else {
		logger.log("warning", "Server is starting in API-only mode.");
		app.get("*", (request, response) => {
			return response.status(404).send("<p>This server is running in API-only mode.</p>");
		});
	}
}