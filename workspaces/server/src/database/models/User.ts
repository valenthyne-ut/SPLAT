import config from "@/config/index.js";
import { logger } from "@/config/Logger.js";
import { unrollError } from "@/util/Errors.js";
import { hashSync } from "bcrypt";
import chalk from "chalk";
import { randomBytes } from "crypto";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare name: string;
	declare passwordHash: string;
	declare administrator: CreationOptional<boolean>;
	declare deletable: CreationOptional<boolean>;

	static initModel(database: Sequelize) {
		return User.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: DataTypes.DATE
			},
			updatedAt: {
				type: DataTypes.DATE
			},

			name: {
				type: DataTypes.TEXT,
				allowNull: false,
				unique: true
			},
			passwordHash: {
				type: DataTypes.TEXT,
				allowNull: false,
				unique: true
			},
			administrator: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			deletable: {
				type: DataTypes.BOOLEAN,
				defaultValue: true
			}
		}, { sequelize: database });
	}

	/**
	 * Creates a default administrator account if it doesn't exist already.
	 */
	static async createDefaultAdministrator() {
		const admin = await User.findOne({ where: { administrator: true } });
		if(!admin) {
			try {
				const password = randomBytes(12).toString("base64");

				await User.create({
					name: "admin",
					passwordHash: hashSync(password, config.SERVER_CRYPTOGRAPHY_HASH_ROUNDS),
					administrator: true,
					deletable: false
				});

				logger.log("warning", "This server's default administrator credentials are the following:");
				logger.log("info", `${chalk.bgBlack("admin")}`);
				logger.log("info", `${chalk.bgBlack(password)}`);
				logger.log("warning", "This password is displayed in your log file, please remove it from there ASAP!");
				logger.log("warning", chalk.yellow("Save these credentials, as they'll only be displayed once."));
				console.log();
			} catch(error) {
				logger.log("fatal", "Couldn't create a default administrator account. Please restart the server and try again.");
				logger.log("fatal", "If the issue persists, try performing a clean install of SPLAT.");
				logger.log("fatal", unrollError(error, true));
			}
		}
	}
}