import config from "@/config/index.js";
import { Sequelize } from "sequelize";

export const database = new Sequelize({
	dialect: "sqlite",
	storage: config.SERVER_DBFILE_PATH,
	logging: false
});