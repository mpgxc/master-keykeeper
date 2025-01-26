import { calculatePasswordStrength, getStrengthColor } from "@/lib/passwordUtils";

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const strength = calculatePasswordStrength(password);
  const color = getStrengthColor(strength);
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-vault-muted">Password Strength</span>
        <span className={`text-sm text-${color}`}>
          {strength <= 2 ? "Weak" : strength <= 4 ? "Medium" : "Strong"}
        </span>
      </div>
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full bg-${color} transition-all duration-300`}
          style={{ width: `${(strength / 6) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default PasswordStrength;