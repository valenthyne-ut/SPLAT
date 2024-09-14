import "dotenv/config";
import { logger, initFileTransport } from "./Logger.js";
import { join } from "path";

function die(reason: string): never {
	logger.log({ level: "fatal", message: reason });
	process.exit(1);
}

const environment = (() => {
	const environment = process.env["ENVIRONMENT"];
	switch(environment && environment.toLowerCase()) {
	case "development": { return "development"; }
	case "production": { return "production"; }
	default: { die("Environment either not specified or invalid (must be either 'development' or 'production')."); }
	}
})();

/**
 * @param key The key's name in the .env file. See exports documentation for more info.
 */
function fetchKey(key: string): string | undefined {
	const preferredKey = `${environment.toUpperCase()}_${key}`;
	let keyValue = undefined;
	if(process.env[preferredKey]) { keyValue = process.env[preferredKey]; }
	else if(process.env[key]) { keyValue = process.env[key]; }
	return keyValue;
}

function getLogfilePath(): string {
	const logfilePath = fetchKey("LOGFILE_PATH") || join(process.cwd(), "splat.log");
	initFileTransport(logfilePath);
	return logfilePath;
}

/**
 * All environment variables, put through "translator" functions. 
 * 
 * Use the `fetchkey` function to get string values from `process.env`, then put 
 * them through a series of tests to convert them into a type in your program. This 
 * makes sure the environment variables integrate nicely into Typescript!
 * 
 * Another feature of `fetchKey` is that it retrieves variables depending on the
 * environment. For example, if you're trying to retrieve the `LOGFILE_PATH`
 * environment variable, and your working environment is set to `development`,
 * `fetchKey` will try to get the value of the `DEVELOPMENT_LOGFILE_PATH`
 * environment variable. However, if it doesn't find anything, it'll try to
 * get the value of `LOGFILE_PATH`. If it also doesn't find anything then,
 * it'll just return `undefined`. You can use this to easily transition inbetween 
 * different tokens, paths, and other settings depending on your current environment.
 */
export default {
	/**
	 * The current working environment.
	 * 
	 * **Possible value(s):** `development`; `production`
	 * 
	 * **Required.**
	 */
	ENVIRONMENT: environment,
	/**
	 * The full path (including filename) to write logs to.
	 *  
	 * **Possible value(s):** `string`, a path to a log file.
	 *
	 * **Default value:** `(cwd)/splat.log`
	 */
	LOGFILE_PATH: getLogfilePath()
};