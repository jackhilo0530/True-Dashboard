import {Context} from "hono";
import { UserService } from "../services/user.service";

export const UserController = {
    signupUser: async (c:Context) => {
        try {
            const body = await c.req.json();
            const user = await UserService.signupUser(body);
            return c.json(user, 201)
        }catch (err: any) {
            if(err.type === "validation") {
                return c.json(
                    {
                        message: "validation error",
                        errors: err.errors,
                    },
                    400
                );
            }
            if (err.type === "duplicate") {
                return c.json(
                    {
                        message: err.message || "user already exists",
                    },
                    409
                );
            }

            console.error(err);
            return c.json({message: "internal server error"}, 500);
        }
    },

    loginUser: async (c: Context) => {
        try {
            const body = await c.req.json();
            const user = await UserService.loginUser(body);
            return c.json(user, 201);
        } catch(err: any) {
            if(err.type === "validation") {
                return c.json(
                    {
                        message: "validation error",
                        errors: err.errors,
                    },
                    400
                );
            }
            if(err.type === "authentication") {
                return c.json(
                    {
                        message: "authentication error",
                        errors: err.errors,
                    },
                    401
                );
            }

            console.error(err);
            return c.json({message: "internal server error"}, 500);
        }
    },
};
