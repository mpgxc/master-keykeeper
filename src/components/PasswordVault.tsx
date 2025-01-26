import { useState } from "react";
import { Search, Plus } from "lucide-react";
import PasswordEntry from "./PasswordEntry";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import SecretForm from "./SecretForm";

interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  customFields?: CustomField[];
}

const PasswordVault = () => {
  const [search, setSearch] = useState("");
  const [passwords, setPasswords] = useState<Password[]>([
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

  const handleAddSecret = (newSecret: Omit<Password, "id">) => {
    const newId = (passwords.length + 1).toString();
    setPasswords([...passwords, { ...newSecret, id: newId }]);
  };

  const handleEditSecret = (updatedSecret: Password) => {
    setPasswords(passwords.map(p => 
      p.id === updatedSecret.id ? updatedSecret : p
    ));
  };

  const handleDeleteSecret = (id: string) => {
    setPasswords(passwords.filter(p => p.id !== id));
  };

  const filteredPasswords = passwords.filter(
    (pass) =>
      pass.title.toLowerCase().includes(search.toLowerCase()) ||
      pass.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vault-muted w-5 h-5" />
          <input
            type="text"
            placeholder="Search passwords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-vault-primary/20 transition-all"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-vault-primary text-white hover:bg-vault-primary/90">
              <Plus className="w-4 h-4" />
              Add Secret
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Secret</DialogTitle>
            </DialogHeader>
            <SecretForm onSubmit={handleAddSecret} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {filteredPasswords.map((pass) => (
          <PasswordEntry
            key={pass.id}
            {...pass}
            onEdit={() => handleEditSecret(pass)}
            onDelete={() => handleDeleteSecret(pass.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordVault;