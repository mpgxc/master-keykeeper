import type { Context, Next } from "hono";
import { cors } from "hono/cors";

const MASTER_KEY = process.env.MASTER_KEY;

export const authMiddleware = async (ctx: Context, next: Next) => {
	const apiKey = ctx.req.header("X-API-Key");

	if (!apiKey || apiKey !== MASTER_KEY) {
		return ctx.json({ error: "Unauthorized" }, 401);
	}

	await next();
};

export const configureCors = () =>
	cors({
		origin: "*",
		allowMethods: ["GET", "POST", "PUT", "DELETE"],
		allowHeaders: ["Content-Type", "X-API-Key"],
	});
