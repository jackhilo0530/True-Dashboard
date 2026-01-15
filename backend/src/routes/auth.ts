import {Hono} from "hono";
import { UserController } from "../controllers/user.controller";

const auth = new Hono();

auth.post("/signup", UserController.signupUser);
auth.post("/login", UserController.loginUser);

export default auth;