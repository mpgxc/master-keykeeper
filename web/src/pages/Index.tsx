import { useState, useEffect, useCallback } from "react";
import MasterPasswordForm from "@/components/MasterPasswordForm";
import PasswordVault from "@/components/PasswordVault";
import { toast } from "sonner";

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

const Index = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const handleActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    if (!isUnlocked) return;

    const checkSession = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity >= SESSION_TIMEOUT) {
        setIsUnlocked(false);
        toast.info("Session expired. Please enter your master password again.");
      }
    }, 1000);

    // Add activity listeners
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      clearInterval(checkSession);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [isUnlocked, lastActivity, handleActivity]);

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