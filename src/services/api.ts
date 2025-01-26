import type { Password } from "@/components/PasswordVault";

const BASE_URL = "https://api.example.com"; // Replace with your actual API URL

export const api = {
  async fetchSecrets(): Promise<Password[]> {
    // For demo purposes, simulating API call
    return Promise.resolve([
      {
        id: "1",
        title: "Gmail",
        username: "user@gmail.com",
        password: "example123",
        customFields: [
          { id: "1", label: "Recovery Email", value: "backup@email.com" }
        ]
      },
      {
        id: "2",
        title: "GitHub",
        username: "developer",
        password: "secure456",
        customFields: []
      },
    ]);
  },

  async createSecret(secret: Omit<Password, "id">): Promise<Password> {
    // Simulate API call
    return Promise.resolve({
      ...secret,
      id: Date.now().toString()
    });
  },

  async updateSecret(secret: Password): Promise<Password> {
    // Simulate API call
    return Promise.resolve(secret);
  },

  async deleteSecret(id: string): Promise<void> {
    // Simulate API call
    return Promise.resolve();
  }
};