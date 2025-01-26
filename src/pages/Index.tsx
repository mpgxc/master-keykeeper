import { useState } from "react";
import MasterPasswordForm from "@/components/MasterPasswordForm";
import PasswordVault from "@/components/PasswordVault";

const Index = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <div className="min-h-screen bg-vault-background">
      {!isUnlocked ? (
        <MasterPasswordForm onUnlock={() => setIsUnlocked(true)} />
      ) : (
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-vault-foreground mb-8">Password Vault</h1>
          <PasswordVault />
        </div>
      )}
    </div>
  );
};

export default Index;