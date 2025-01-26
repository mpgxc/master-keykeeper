import { useState } from "react";
import { Eye, EyeOff, Copy, Key, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import SecretForm from "./SecretForm";
import type { Password } from "./PasswordVault";

interface PasswordEntryProps extends Password {
  onEdit: (password: Password) => void;
  onDelete: () => void;
}

const PasswordEntry = ({ id, title, username, password, customFields = [], onEdit, onDelete }: PasswordEntryProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);

  const copyToClipboard = async (text: string, type: "password" | "username" | "field") => {
    await navigator.clipboard.writeText(text);
    toast.success(`${type === "password" ? "Password" : type === "username" ? "Username" : "Field value"} copied to clipboard`);
  };

  const handleEdit = (updatedData: Omit<Password, "id">) => {
    onEdit({ ...updatedData, id });
    setOpen(false);
  };

  return (
    <div className="bg-vault-card p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-vault-background rounded-full">
            <Key className="w-5 h-5 text-vault-primary" />
          </div>
          <div>
            <h3 className="font-medium text-vault-foreground">{title}</h3>
            <p className="text-sm text-vault-muted">{username}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => copyToClipboard(username, "username")}
            className="p-2 hover:bg-vault-background rounded-full transition-colors"
          >
            <Copy className="w-4 h-4 text-vault-secondary" />
          </button>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="p-2 hover:bg-vault-background rounded-full transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-vault-secondary" />
            ) : (
              <Eye className="w-4 h-4 text-vault-secondary" />
            )}
          </button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit className="w-4 h-4 text-vault-secondary" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Secret</DialogTitle>
              </DialogHeader>
              <SecretForm
                onSubmit={handleEdit}
                initialData={{ title, username, password, customFields }}
              />
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your secret.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            readOnly
            className="w-full bg-vault-background border-none rounded px-3 py-2 text-vault-foreground"
          />
          <button
            onClick={() => copyToClipboard(password, "password")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Copy className="w-4 h-4 text-vault-muted hover:text-vault-secondary transition-colors" />
          </button>
        </div>
        {customFields.length > 0 && (
          <div className="mt-4 space-y-2">
            {customFields.map((field) => (
              <div key={field.id} className="flex items-center justify-between bg-vault-background rounded p-2">
                <div>
                  <span className="text-sm font-medium text-vault-foreground">{field.label}:</span>
                  <span className="ml-2 text-sm text-vault-muted">{field.value}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(field.value, "field")}
                  className="p-1 hover:bg-vault-card rounded-full transition-colors"
                >
                  <Copy className="w-4 h-4 text-vault-muted hover:text-vault-secondary" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordEntry;