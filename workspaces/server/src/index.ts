import { createServer } from "https";
import { logger } from "./config/Logger.js";
import "./config/index.js";
import config from "./config/index.js";
import { unrollError } from "./util/Errors.js";
import express from "express";
import chalk from "chalk";
import { listNetworkInterfaceAddresses } from "./util/Networking.js";
import helmet from "helmet";
import { useCORS } from "./middleware/CORS.js";
import { useViewEngine } from "./middleware/ViewEngine.js";
import cookieParser from "cookie-parser";
import { initModels } from "./database/models/index.js";
import { database } from "./database/index.js";
import { useSession } from "./middleware/Session.js";
 
void (async () => {
	try {
		const app = express();

		// Global middleware
		app.use(helmet());
		useCORS(app, config.SERVER_PORT, config.SERVER_ADDRESS, config.ENVIRONMENT);

		// Parsing middleware
		app.use(express.json());
		app.use(cookieParser(config.SERVER_COOKIE_SECRET));

		// Session middleware
		useSession(app, config.SERVER_COOKIE_SECRET, database);
		
		// Database
		initModels(database);
		await database.sync();

		// View engine
		useViewEngine(app, config.SERVER_HTDOCS_PATH);

		const serverOptions = config.SERVER_CREDENTIALS;
		// Modify any other server options you need to below here.

		const httpsServer = createServer(serverOptions, app).listen(config.SERVER_PORT);
		httpsServer.on("listening", () => {
			logger.log("info", "Server started successfully.");
			logger.log("info", `Local: ${chalk.cyan(`https://localhost:${config.SERVER_PORT}`)}`);

			for(const address of listNetworkInterfaceAddresses()) {
				logger.log("info", `Network: ${chalk.cyan(`https://${address}:${config.SERVER_PORT}`)}`);
			}

			if(config.ALWAYS_DISPLAY_SERVER_ADDRESS || 
				(config.ENVIRONMENT === "production" && config.SERVER_ADDRESS !== "localhost")) {
				logger.log("info", `Public: ${chalk.cyan(`https://${config.SERVER_ADDRESS}:${config.SERVER_PORT}`)}`);
			}
		});
	} catch(error) {
		logger.log("fatal", "Server failed to start.");
		logger.log("fatal", unrollError(error, true));
		process.exit(1); // Guarantee everything stops.
	}
})();