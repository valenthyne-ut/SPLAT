import { Express } from "express";
import session from "express-session";
import { Sequelize } from "sequelize";
import CSSequelize from "connect-session-sequelize";

const SequelizeStore = CSSequelize(session.Store);

export function useSession(app: Express, cookieSecret: string | string[], database: Sequelize, maxSessionTime: number) {
	app.use(session({
		name: "session",
		secret: cookieSecret,
		store: new SequelizeStore({ db: database }),
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: true,
			httpOnly: true,
			sameSite: "strict",
			maxAge: maxSessionTime
		}
	}));
}