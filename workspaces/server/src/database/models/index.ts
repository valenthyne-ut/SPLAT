import { Sequelize } from "sequelize";
import { User } from "./User.js";

export function initModels(database: Sequelize) {
	User.initModel(database);
}