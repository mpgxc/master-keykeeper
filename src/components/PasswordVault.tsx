import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";
import PasswordEntry from "./PasswordEntry";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import SecretForm from "./SecretForm";
import { api } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: passwords = [], isLoading } = useQuery({
    queryKey: ['passwords'],
    queryFn: api.fetchSecrets,
  });

  const createMutation = useMutation({
    mutationFn: api.createSecret,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passwords'] });
      toast.success("Secret added successfully!");
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: api.updateSecret,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passwords'] });
      toast.success("Secret updated successfully!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteSecret,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passwords'] });
      toast.success("Secret deleted successfully!");
    },
  });

  const handleAddSecret = (newSecret: Omit<Password, "id">) => {
    createMutation.mutate(newSecret);
  };

  const handleEditSecret = (updatedSecret: Password) => {
    updateMutation.mutate(updatedSecret);
  };

  const handleDeleteSecret = (id: string) => {
    deleteMutation.mutate(id);
  };

  const filteredPasswords = passwords.filter(
    (pass) =>
      pass.title.toLowerCase().includes(search.toLowerCase()) ||
      pass.username.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

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
        <Dialog open={open} onOpenChange={setOpen}>
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
            onEdit={handleEditSecret}
            onDelete={() => handleDeleteSecret(pass.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordVault;