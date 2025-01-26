import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { trimTrailingSlash } from "hono/trailing-slash";
import pino from "pino";
import { configureCors } from "./middleware";
import { SecretSchema } from "./schemas";
import { SecretService } from "./secret.service";

const logx = pino({
	level: "info",
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
		},
	},
});

const validateSecretPayload: MiddlewareHandler = async (ctx, next) => {
	try {
		const body = await ctx.req.json();
		const result = SecretSchema.safeParse(body);

		if (result.success) {
			ctx.set("validatedPayload", result.data);

			return next();
		}
	} catch (error) {
		throw new HTTPException(400, {
			message: "Invalid payload",
		});
	}
};

const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
} as const;

const app = new Hono().basePath("/api");

app.use(logger());
app.use(prettyJSON());
app.use(secureHeaders());
app.use(trimTrailingSlash());
app.use("*", configureCors());
// app.use("*", authMiddleware);

app.get("/health", async (ctx) => {
	logx.debug("Health check");

	return ctx.json({ message: "Service is up and running 🚀" });
});

app.get("/secrets", async (c) => {
	const secrets = await SecretService.getAll();

	return c.json(secrets);
});

app.post("/secrets", validateSecretPayload, async (c) => {
	const data = c.get("validatedPayload");

	const secret = await SecretService.create(data);

	return c.json(secret, HTTP_STATUS.CREATED);
});

app.put("/secrets/:id", validateSecretPayload, async (c) => {
	const id = c.req.param("id");

	const data = c.get("validatedPayload");

	try {
		const secret = await SecretService.update(id, data);

		return c.json(secret);
	} catch (error) {
		throw new HTTPException(HTTP_STATUS.NOT_FOUND, {
			message: "Secret not found",
		});
	}
});

app.delete("/secrets/:id", async (c) => {
	const id = c.req.param("id");

	try {
		await SecretService.delete(id);

		return c.json({ message: "Secret deleted successfully" });
	} catch (error) {
		throw new HTTPException(HTTP_STATUS.NOT_FOUND, {
			message: "Secret not found",
		});
	}
});

app.onError(async (err, ctx) => {
	logx.error(err, `Error processing request ${ctx.req.routePath}`);

	if (err instanceof HTTPException) {
		return ctx.json(
			{
				message: err.message,
			},
			err.status,
		);
	}

	if (err instanceof Error) {
		return ctx.json(
			{
				name: err.name,
				message: `${err.message} 🤯 Unexpected exception - please check the logs`,
			},
			500,
		);
	}

	return ctx.json(
		{ message: "Unexpected exception - please check the logs" },
		500,
	);
});

app.notFound(async (ctx) => {
	return ctx.json({ message: "Route not found 🤷‍♂️" }, 404);
});

const port = Number(process.env.NODE_PORT);

serve(
	{
		port,
		fetch: app.fetch,
	},
	(address) => {
		console.log(
			`🔥 Server listening on http://${address.address}:${address.port}/api`,
		);
	},
);
