import { useState } from "react";
import { Lock } from "lucide-react";
import PasswordStrength from "./PasswordStrength";

interface MasterPasswordFormProps {
  onUnlock: () => void;
}

const MasterPasswordForm = ({ onUnlock }: MasterPasswordFormProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "master123") { // This is just for demo, in real app would use proper auth
      onUnlock();
    } else {
      setError("Incorrect master password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vault-background p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-vault-primary/10 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-vault-primary" />
          </div>
          <h2 className="text-3xl font-bold text-vault-foreground mb-2">Welcome Back</h2>
          <p className="text-vault-muted">Enter your master password to unlock your vault</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-vault-primary/20 transition-all"
                placeholder="Enter master password"
              />
            </div>
            {error && <p className="mt-2 text-sm text-vault-warning">{error}</p>}
          </div>

          <PasswordStrength password={password} />

          <button
            type="submit"
            className="w-full bg-vault-primary text-white py-3 rounded-lg hover:bg-vault-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-vault-primary/20 focus:ring-offset-2"
          >
            Unlock Vault
          </button>
        </form>
      </div>
    </div>
  );
};

export default MasterPasswordForm;