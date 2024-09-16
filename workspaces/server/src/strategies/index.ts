import { User } from "@/database/models/User.js";
import { PassportStatic } from "passport";
import { PasswordStrategy } from "./Password.js";

export function useStrategies(passport: PassportStatic) {
	passport.serializeUser((user, done) => {
		done(null, (user as User).id);
	});

	passport.deserializeUser((id: number, done) => {
		void (async () => {
			try {
				const user = await User.findOne({ where: { id: id } });
				done(null, user);
			} catch(error) {
				done(error, false);
			}
		})();
	});

	passport.use("password", PasswordStrategy);
}