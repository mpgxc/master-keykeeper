import { useState } from "react";
import { Search } from "lucide-react";
import PasswordEntry from "./PasswordEntry";

interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
}

const PasswordVault = () => {
  const [search, setSearch] = useState("");
  const [passwords] = useState<Password[]>([
    {
      id: "1",
      title: "Gmail",
      username: "user@gmail.com",
      password: "example123",
    },
    {
      id: "2",
      title: "GitHub",
      username: "developer",
      password: "secure456",
    },
  ]);

  const filteredPasswords = passwords.filter(
    (pass) =>
      pass.title.toLowerCase().includes(search.toLowerCase()) ||
      pass.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vault-muted w-5 h-5" />
        <input
          type="text"
          placeholder="Search passwords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-vault-primary/20 transition-all"
        />
      </div>
      <div className="space-y-4">
        {filteredPasswords.map((pass) => (
          <PasswordEntry
            key={pass.id}
            title={pass.title}
            username={pass.username}
            password={pass.password}
            onEdit={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordVault;