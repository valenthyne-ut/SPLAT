import chalk from "chalk";
import { createLogger, transports, format } from "winston";
const { combine, timestamp, printf } = format;

const loggerData = {
	levels: {
		"fatal": 0,
		"error": 1,
		"warning": 2,
		"info": 3,
		"debug": 4
	},
	colors: {
		"fatal": chalk.red,
		"error": chalk.red,
		"warning": chalk.yellow,
		"info": chalk.blue,
		"debug": chalk.green
	}
};

const longestPrefix = Object.keys(loggerData.levels).reduce((a, b) => a.length > b.length ? a : b).length;

export const customFormat = (console: boolean) => {
	return printf(({ timestamp, level, message }) => {
		let formattedLevel = level.padStart(longestPrefix, " ").toUpperCase();

		if(console) { 
			timestamp = chalk.bgBlack(timestamp);
			formattedLevel = loggerData.colors[level as keyof typeof loggerData.levels](formattedLevel);
		}
		
		return `${timestamp} ${formattedLevel} ${message}`;
	});
};

export const logger = createLogger({
	levels: loggerData.levels,
	transports: [
		new transports.Console({
			format: combine(
				timestamp(),
				customFormat(true)
			)
		})
	]
});

export function initFileTransport(path: string) {
	logger.add(new transports.File({
		filename: path,
		format: combine(
			timestamp(),
			customFormat(false)
		)
	}));
}