import type { Password } from "@/components/PasswordVault";
import axios from "axios";
import { toast } from "sonner";

const BASE_URL = "http://localhost:3003";

const client = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const api = {
	async fetchSecrets(): Promise<Password[]> {
		const { data, status } = await client.get("/secrets");

		if (status !== 200) {
			toast.success("Failed to fetch secrets", {
				position: "top-right",
			});

			return [];
		}

		return data;
	},

	async createSecret(secret: Omit<Password, "id">): Promise<Password> {
		const { data, status } = await client.post("/secrets", secret);

		if (status !== 201) {
			toast.success("Failed to create secret", {
				position: "top-right",
			});

			return {} as Password;
		}

		return data;
	},

	async updateSecret(secret: Password): Promise<Password> {
		const { data, status } = await client.put(`/secrets/${secret.id}`, secret);

		if (status !== 200) {
			toast.success("Failed to update secret", {
				position: "top-right",
			});

			return {} as Password;
		}
	},

	async deleteSecret(id: string): Promise<void> {
		const { status } = await client.delete(`/secrets/${id}`);

		if (status !== 204) {
			toast.success("Failed to delete secret", {
				position: "top-right",
			});
		}
	},
};
