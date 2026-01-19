import type {MiddlewareHandler} from "hono";
import {jwt} from "hono/jwt";
import dotenv from "dotenv"

dotenv.config()

export const globalMiddleware: MiddlewareHandler = async (c, next) => {
    const path = c.req.path;
    const method = c.req.method.toLocaleLowerCase();

    const publicRoutes = [
        {method: "post", path: "/api/auth/signup"},
        {method: "post", path: "/api/auth/login"},
    ];

    const isPublic = publicRoutes.some(
        (r) => r.method === method && r.path === path
    );

    if(isPublic) {
        return next();
    }

    if(path.startsWith("/uploads")) {
        return next();
    }

    return jwt({
       secret: process.env.JWT_SECRET || "dev-secret",
       alg: "HS256"
    })(c, next);
};