import { createServer } from "https";
import { logger } from "./config/Logger.js";
import "./config/index.js";
import config from "./config/index.js";
import { unrollError } from "./util/Errors.js";
import express from "express";
import chalk from "chalk";

// eslint-disable-next-line @typescript-eslint/require-await
void (async () => {
	try {
		const app = express();

		const serverOptions = config.SERVER_CREDENTIALS;
		// Modify any other server options you need to below here.

		const httpsServer = createServer(serverOptions, app).listen(config.SERVER_PORT);
		httpsServer.on("listening", () => {
			logger.log("info", "Server started successfully.");
			logger.log("info", `Local: ${chalk.cyan(`https://localhost:${config.SERVER_PORT}`)}`);
		});
	} catch(error) {
		logger.log("fatal", "Server failed to start.");
		logger.log("fatal", unrollError(error, true));
		process.exit(1); // Guarantee everything stops.
	}
})();