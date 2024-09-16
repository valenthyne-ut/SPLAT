import { User } from "@/database/models/User.js";
import { compareSync } from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";

export const PasswordStrategy = new LocalStrategy((username, password, done) => {
	void (async () => {
		const user = await User.findOne({ where: { name: username } });
		if(!user || !compareSync(password, user.passwordHash)) {
			return done(new Error("Invalid username or password."), false);
		}

		return done(null, user);
	})();
});
