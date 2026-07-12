import { useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle } from "lucide-react";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "number" | "select" | "date" | "textarea";
  options?: FieldOption[];
  required?: boolean;
  placeholder?: string;
}

export function ResourceForm({
  fields,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: {
  fields: FieldDef[];
  initialValues: Record<string, string | number | undefined>;
  onSubmit: (values: Record<string, string | number | undefined>) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
}) {
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (name: string, val: string | number | undefined) =>
    setValues((v) => ({ ...v, [name]: val }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const cleaned = Object.fromEntries(
        Object.entries(values).filter(([, v]) => v !== "")
      );
      await onSubmit(cleaned);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    backgroundColor: "#111828",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#F1F5F9",
  };

  return (
    <form onSubmit={submit} className="space-y-4 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <label key={f.name} className={f.type === "textarea" ? "block sm:col-span-2" : "block"}>
            <span 
              className="text-[11px] uppercase tracking-wider font-semibold block mb-1.5"
              style={{ color: "#94A3B8" }}
            >
              {f.label}
              {f.required && <span className="text-red-500"> *</span>}
            </span>
            {f.type === "select" ? (
              <select
                className="w-full h-10 px-3.5 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all"
                style={inputStyle}
                value={values[f.name] ?? ""}
                required={f.required}
                onChange={(e) => set(f.name, e.target.value)}
              >
                <option value="" disabled className="text-gray-500">
                  Select…
                </option>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value} className="bg-[#111828] text-[#F1F5F9]">
                    {o.label}
                  </option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                className="w-full h-24 px-3.5 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 resize-none transition-all"
                style={inputStyle}
                value={values[f.name] ?? ""}
                required={f.required}
                placeholder={f.placeholder}
                onChange={(e) => set(f.name, e.target.value)}
              />
            ) : (
              <input
                type={f.type ?? "text"}
                className="w-full h-10 px-3.5 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all"
                style={inputStyle}
                value={values[f.name] ?? ""}
                required={f.required}
                placeholder={f.placeholder}
                onChange={(e) =>
                  set(f.name, f.type === "number" ? Number(e.target.value) : e.target.value)
                }
              />
            )}
          </label>
        ))}
      </div>

      {error && (
        <div 
          className="flex items-start gap-2 text-[13px] font-semibold border rounded-lg px-4 py-3"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderColor: "rgba(239, 68, 68, 0.2)",
            color: "#EF4444",
          }}
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div 
        className="flex justify-end gap-2 pt-4 border-t mt-6"
        style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="h-9 px-4 rounded-lg font-medium text-[13px] border transition-colors"
          style={{
            backgroundColor: "transparent",
            borderColor: "rgba(255, 255, 255, 0.08)",
            color: "#94A3B8",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.color = "#F1F5F9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#94A3B8";
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="h-9 px-4 rounded-lg font-semibold text-[13px] transition-colors"
          style={{
            backgroundColor: "#FF6B00",
            color: "#FFFFFF",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#CC5500";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FF6B00";
          }}
        >
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
