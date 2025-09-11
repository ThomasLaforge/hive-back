import { User } from "@prisma/client";

declare module "express-serve-static-core" {
    interface Request {
        token: string;
        user: Omit<User, "password">;
    }
}