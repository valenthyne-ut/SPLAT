import "dotenv/config";
import { logger, initFileTransport } from "./Logger.js";
import { join } from "path";
import { ServerOptions } from "https";
import { unrollError } from "@/util/Errors.js";
import { existsSync, readFileSync } from "fs";
import { Environment } from "@/types/Environment.js";
import { randomBytes } from "crypto";
import { benchmarkHashRounds } from "@/util/Cryptography.js";

function die(reason: string): never {
	logger.log("fatal", reason);
	process.exit(1);
}

const environment: Environment = (() => {
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

// #region Server variables

function getServerAddress(): string {
	return fetchKey("SERVER_ADDRESS") || "localhost";
}

function getAlwaysDisplayServerAddress(): boolean {
	const value = fetchKey("ALWAYS_DISPLAY_SERVER_ADDRESS");
	return (value !== undefined && value.toLowerCase() === "true");
}

function getServerPort(): number {
	let port = 8443;
	const userPort = fetchKey("SERVER_PORT");
	if(userPort) {
		const parsedPort = parseInt(userPort);
		if(parsedPort) { port = parsedPort; }
		else { logger.log("warning", "Couldn't parse user-defined port. Defaulting to 8443."); }
	}
	return port;
}

function getServerCredentials(): ServerOptions {
	const credentials: ServerOptions = {};

	try {
		let credentialsPath = join(process.cwd(), "/credentials");
		
		const userCredentialsPath = fetchKey("SERVER_CREDENTIALS_PATH");
		if(userCredentialsPath) {
			if(existsSync(userCredentialsPath)) {
				credentialsPath = userCredentialsPath; 
			} else {
				logger.log(
					"warning", 
					"User specified credentials path doesn't exist. Defaulting to server working directory path."
				);
			}
		}

		const keyPath = join(credentialsPath, "/key.pem");
		const certPath = join(credentialsPath, "/cert.pem");

		credentials.key = readFileSync(keyPath, { encoding: "utf-8" });
		credentials.cert = readFileSync(certPath, { encoding: "utf-8" });

		return credentials;
	} catch(error) {
		logger.log("fatal", "Couldn't read SSL credentials." );
		die(unrollError(error, true));
	}
}

function getServerHtdocsPath(): string | undefined {
	return fetchKey("SERVER_HTDOCS_PATH");
}

function getServerCookieSecret(): string[] | string {
	const cookieSecret = fetchKey("SERVER_COOKIE_SECRET");
	if(cookieSecret) {
		if(cookieSecret.indexOf(", ") !== -1) {
			return cookieSecret.split(", ");
		} else {
			return cookieSecret;
		}
	}

	return randomBytes(64).toString("hex");
}

function getServerHashRounds(): number {
	let hashRounds, hashTime = 350;

	const userHashRounds = fetchKey("SERVER_CRYPTOGRAPHY_HASH_ROUNDS");
	if(userHashRounds) { 
		const parsedRounds = parseInt(userHashRounds);
		if(parsedRounds) { hashRounds = parsedRounds; }
	} else {
		const userAcceptableHashTime = fetchKey("SERVER_CRYPTOGRAPHY_ACCEPTABLE_HASH_TIME");
		if(userAcceptableHashTime) {
			const parsedTime = parseInt(userAcceptableHashTime);
			if(parsedTime) { hashTime = parsedTime; }
		}
	}

	return hashRounds || benchmarkHashRounds(hashTime);
}

function getServerDatabaseFilePath(): string {
	const databaseFilePath = fetchKey("SERVER_DBFILE_PATH") || join(process.cwd(), "database.sqlite");
	return databaseFilePath;
}

function getMaxSessionTime(): number {
	let maxSessionTime = 10 * 60;
	const userMaxSessionTime = fetchKey("MAX_SESSION_TIME");
	if(userMaxSessionTime) {
		const parsedMaxSessionTime = parseInt(userMaxSessionTime);
		if(parsedMaxSessionTime) { maxSessionTime = parsedMaxSessionTime; }
	}
	return maxSessionTime;
}

// #endregion

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
	LOGFILE_PATH: getLogfilePath(),
	/**
	 * The public server address for CORS to bind to. Usually a domain name you own.
	 * 
	 * **Default value:** `localhost`
	 */
	SERVER_ADDRESS: getServerAddress(),
	/** 
	 * Whether to always display the public server address or not, regardless of environment.
	 * 
	 * **Default value:** `false`
	 */
	ALWAYS_DISPLAY_SERVER_ADDRESS: getAlwaysDisplayServerAddress(),
	/**
	 * The port to which the server will bind to.
	 * 
	 * **Default value:** `8443`
	 */
	SERVER_PORT: getServerPort(),
	/**
	 * The `key.pem` and `cert.pem` files put into the `credentials` directory within
	 * the server's working directory.
	 * 
	 * If you'd like to define a path to a credentials directory yourself, use the 
	 * `SERVER_CREDENTIALS_PATH` .env variable.
	 * 
	 * If you'd like to generate a self-signed SSL certificate through OpenSSL, use 
	 * this command whilst in the directory you'd like the certificate to be in:
	 * 
	 * `openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 3650 -nodes -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"`
	 * 
	 * Taken from the following SO answer (thank you Diego Woitasen and StackzOfZtuff):
	 * 
	 * https://stackoverflow.com/questions/10175812/how-to-generate-a-self-signed-ssl-certificate-using-openssl#answer-10176685
	 * 
	 * **Required (since this is a HTTPS only server).**
	 */
	SERVER_CREDENTIALS: getServerCredentials(),
	/**
	 * Path to the server's htdocs. Usually where the SPA is built to. View the middleware/ViewEngine.ts
	 * file for more information.
	 * 
	 * **Default value:** `undefined` (the server automatically looks in the current working directory)
	 * 
	 * **Optional.**
	 */
	SERVER_HTDOCS_PATH: getServerHtdocsPath(),
	/**
	 * The server cookie secret. Used for signing cookies. Use a long, unpredictable, randomly generated
	 * string here. The server will automatically generate one on startup if it isn't specified, but this
	 * means that across server restarts, sessions won't persist.
	 * 
	 * You may also specify multiple cookie secrets (view cookie parser module documentation for more 
	 * details) by separating them with a comma and space (", "). So for example:
	 * 
	 * `bc13DO4NOT534USETHESE470SECRETS1, 1cbfaaa4296578affb4134b061579baa`
	 * 
	 * The first secret would be used to both encode and decode cookies, but the second one would only
	 * be used to decode cookies (incase you change secrets but still need the previous sessions to
	 * remain active).
	 * 
	 * If you'd like to generate a random value yourself, start a Node instance in a terminal window and
	 * run the following piece of code, then copy the output into your .env file.
	 * 
	 * ```js
	 * console.log((require("crypto")).randomBytes(64).toString("hex"));
	 * ```
	 * 
	 * **Default value:** a randomly generated string.
	 * 
	 * **Optional but highly recommended.**
	 */
	SERVER_COOKIE_SECRET: getServerCookieSecret(),
	/**
	 * The hash rounds the server will use in bcrypt for password hashing. The higher, the better; However,
	 * the higher you set this number, the slower the hashing will be. If you're not sure what to set this
	 * to, set the `SERVER_CRYPTOGRAPHY_ACCEPTABLE_HASH_TIME` to an amount of time (in milliseconds) you
	 * think would be reasonable to wait through during the login process. A reasonable amount is somewhere
	 * between 350 and 500ms, ensuring a reasonable compromise between security and user experience. If you're 
	 * also not sure about that, the default is 350ms.
	 * 
	 * The server will benchmark itself and output a value for this environment variable, pay attention to the
	 * logs if this is your first time running SPLAT.
	 * 
	 * **Optional**, but when the server benchmarks itself and outputs a value, you should put it in your .env
	 * file, so you don't have to wait for the benchmark everytime the server starts up.
	 */
	SERVER_CRYPTOGRAPHY_HASH_ROUNDS: getServerHashRounds(),
	/**
	 * The path to the server's local database file.
	 * 
	 * **Default value:** `(cwd)/database.sqlite`
	 * 
	 * **Optional.**
	 */
	SERVER_DBFILE_PATH: getServerDatabaseFilePath(),
	/**
	 * The maximum duration for a user session in seconds. It's recommended you keep this a small number.
	 * 
	 * **Default value:** `600` seconds (10 minutes)
	 * 
	 * **Optional.**
	 */
	MAX_SESSION_TIME: getMaxSessionTime()
};