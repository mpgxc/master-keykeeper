import { useState } from "react";
import { Eye, EyeOff, Copy, Key } from "lucide-react";
import { toast } from "sonner";

interface PasswordEntryProps {
  title: string;
  username: string;
  password: string;
  onEdit: () => void;
}

const PasswordEntry = ({ title, username, password, onEdit }: PasswordEntryProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = async (text: string, type: "password" | "username") => {
    await navigator.clipboard.writeText(text);
    toast.success(`${type === "password" ? "Password" : "Username"} copied to clipboard`);
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
        </div>
      </div>
      <div className="mt-4">
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
      </div>
    </div>
  );
};

export default PasswordEntry;