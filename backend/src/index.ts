import {Hono} from "hono";
import {serve} from "@hono/node-server";
import {serveStatic} from "@hono/node-server/serve-static";
import {cors} from "hono/cors";
import path from "path";
import auth from "./routes/auth";
import dotenv from "dotenv";
import { globalMiddleware } from "./middlewares/auth.middleware";
import product from "./routes/product";

dotenv.config();


const app = new Hono();

app.use(
    "/*",
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173"
    })
);

app.use("/*", globalMiddleware);

app.route("/api/auth", auth);
app.route("/api/product", product);

const uploadDir = path.join(process.cwd(), "public");
app.get("/uploads/", serveStatic({root: uploadDir}));

const port = 3000;
console.log(`Backend running at http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port,
});