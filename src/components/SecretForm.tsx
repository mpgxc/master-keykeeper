import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { Password } from "./PasswordVault";

interface SecretFormProps {
  initialData?: Omit<Password, "id">;
  onSubmit: (data: Omit<Password, "id">) => void;
}

const SecretForm = ({ initialData, onSubmit }: SecretFormProps) => {
  const [formData, setFormData] = useState<Omit<Password, "id">>({
    title: initialData?.title || "",
    username: initialData?.username || "",
    password: initialData?.password || "",
    customFields: initialData?.customFields || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addCustomField = () => {
    setFormData(prev => ({
      ...prev,
      customFields: [
        ...(prev.customFields || []),
        { id: Date.now().toString(), label: "", value: "" }
      ]
    }));
  };

  const removeCustomField = (id: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields?.filter(field => field.id !== id) || []
    }));
  };

  const updateCustomField = (id: string, key: "label" | "value", value: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields?.map(field =>
        field.id === id ? { ...field, [key]: value } : field
      ) || []
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          required
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Gmail, Netflix, Bank Account"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <Input
          required
          value={formData.username}
          onChange={e => setFormData({ ...formData, username: e.target.value })}
          placeholder="Username or email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <Input
          required
          type="password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          placeholder="Enter password"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">Custom Fields</label>
          <Button type="button" variant="outline" size="sm" onClick={addCustomField}>
            <Plus className="w-4 h-4 mr-1" />
            Add Field
          </Button>
        </div>
        
        {formData.customFields?.map(field => (
          <div key={field.id} className="flex gap-2">
            <Input
              value={field.label}
              onChange={e => updateCustomField(field.id, "label", e.target.value)}
              placeholder="Field name"
              className="flex-1"
            />
            <Input
              value={field.value}
              onChange={e => updateCustomField(field.id, "value", e.target.value)}
              placeholder="Field value"
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeCustomField(field.id)}
            >
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update Secret" : "Add Secret"}
      </Button>
    </form>
  );
};

export default SecretForm;