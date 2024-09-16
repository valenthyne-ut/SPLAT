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
}