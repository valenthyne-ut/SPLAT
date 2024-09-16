import { logger } from "@/config/Logger.js";
import { hashSync } from "bcrypt";
import chalk from "chalk";

export function benchmarkHashRounds(targetTime: number): number {
	let rounds = 0, startTime, endTime, timeCost;
	do {
		rounds++;

		startTime = new Date().getTime();
		hashSync("benchmark", rounds);
		endTime = new Date().getTime();

		timeCost = endTime - startTime;
	} while(timeCost < targetTime);
	rounds -= 1;

	logger.log("info", `Your server's benchmarked acceptable hash rounds for a delay of ${targetTime}ms is ${chalk.yellow(rounds)}.`);
	logger.log("info", `To prevent this message from showing up again, add this to your .env file: SERVER_CRYPTOGRAPHY_HASH_ROUNDS=${rounds}`);

	return rounds;
}