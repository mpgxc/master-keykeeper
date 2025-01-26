import { z } from "zod";

const CustomFieldSchema = z.object({
	id: z.string(),
	label: z.string().min(1),
	value: z.string().min(1),
});

export const SecretSchema = z.object({
	title: z.string().min(1),
	username: z.string().min(1),
	password: z.string().min(6),
	customFields: z.array(CustomFieldSchema).optional(),
});
