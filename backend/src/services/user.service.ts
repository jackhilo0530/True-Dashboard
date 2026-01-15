import { prisma } from "../db/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import z from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});


export const UserService = {
    signupUser: async (payload: unknown) => {
        const parsed = signupSchema.safeParse(payload);
        if (!parsed.success) {
            throw { type: "validation", errors: parsed.error.flatten() };
        }

        const existing = await prisma.user.findUnique({
            where: { email: parsed.data.email },
        });

        if (existing) {
            throw { type: "duplicate", message: "email already exists" };
        }

        const hashed = await bcrypt.hash(parsed.data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: parsed.data.name,
                email: parsed.data.email,
                password: hashed,
            }
        });

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    },

    loginUser: async (payload: unknown) => {
        const parsed = loginSchema.safeParse(payload);
        if (!parsed.success) {
            throw { type: "validation", errors: parsed.error.flatten() };
        }

        const user = await prisma.user.findUnique({
            where: { email: parsed.data.email },
        });

        if (!user) {
            const err: any = new Error('invalid email or password');
            err.code = 'INVALID_CREDENTIALS';
            throw err;
        }

        const isMatch = await bcrypt.compare(parsed.data.password, user.password);
        if (!isMatch) {
            const err: any = new Error('invalid email or password');
            err.code = 'INVALID_CREDENTIALS';
            throw err;
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    },

};
