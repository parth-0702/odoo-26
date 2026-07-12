import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "./Button";

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

const inputClass =
  "w-full mt-1 h-10 px-3 rounded-lg bg-surface-variant/30 border border-black/[0.08] text-body-md text-on-surface outline-none focus:border-primary/40 transition-colors";

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
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        {fields.map((f) => (
          <label key={f.name} className={f.type === "textarea" ? "block sm:col-span-2" : "block"}>
            <span className="text-label-caps uppercase text-on-surface-variant">
              {f.label}
              {f.required && " *"}
            </span>
            {f.type === "select" ? (
              <select
                className={inputClass}
                value={values[f.name] ?? ""}
                required={f.required}
                onChange={(e) => set(f.name, e.target.value)}
              >
                <option value="" disabled>
                  Select…
                </option>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                className={inputClass + " h-20 py-2 resize-none"}
                value={values[f.name] ?? ""}
                required={f.required}
                placeholder={f.placeholder}
                onChange={(e) => set(f.name, e.target.value)}
              />
            ) : (
              <input
                type={f.type ?? "text"}
                className={inputClass}
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

      {error && <p className="text-body-md text-error">{error}</p>}

      <div className="flex justify-end gap-sm pt-sm border-t border-black/[0.06]">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
