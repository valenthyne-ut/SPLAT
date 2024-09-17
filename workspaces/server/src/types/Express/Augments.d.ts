import { User } from "@/database/models/User.ts";

declare module "express-serve-static-core" {
	interface Request {
		user: User | undefined;
	}
}