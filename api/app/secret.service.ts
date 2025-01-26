import { PrismaClient, type Secret as PrismaSecret } from "@prisma/client";
import type { Secret } from "./types";

const prisma = new PrismaClient({
	log: ["query"],
	datasourceUrl: process.env.DATABASE_URL,
});

export class SecretService {
	private constructor() {}

	static async getAll(): Promise<Secret[]> {
		const secrets = await prisma.secret.findMany();

		return secrets.map(SecretService.mapToDTO);
	}

	static async getById(id: string): Promise<Secret | null> {
		const secret = await prisma.secret.findUnique({ where: { id } });
		return secret ? SecretService.mapToDTO(secret) : null;
	}

	static async create(data: Omit<Secret, "id">): Promise<Secret> {
		const secret = await prisma.secret.create({
			data: {
				...data,
				customFields: data.customFields
					? JSON.stringify(data.customFields)
					: {},
			},
		});

		return SecretService.mapToDTO(secret);
	}

	static async update(id: string, data: Partial<Secret>): Promise<Secret> {
		const secret = await prisma.secret.update({
			where: { id },
			data: {
				...data,
				customFields: data.customFields
					? JSON.stringify(data.customFields)
					: {},
			},
		});

		return SecretService.mapToDTO(secret);
	}

	static async delete(id: string): Promise<void> {
		await prisma.secret.delete({ where: { id } });
	}

	private static mapToDTO(secret: PrismaSecret): Secret {
		return {
			...secret,
			customFields: secret.customFields
				? JSON.parse(String(secret.customFields))
				: [],
		};
	}
}
