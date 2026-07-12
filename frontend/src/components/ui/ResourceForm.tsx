import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";

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
  "w-full mt-1.5 h-11 px-3.5 rounded-xl bg-surface border-2 border-outline/25 text-body-md font-medium text-on-surface outline-none focus:border-primary focus:shadow-[3px_3px_0_0_rgba(181,18,27,1)] transition-all duration-150 placeholder:text-on-surface-variant/50";

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
      // Empty strings from unselected <select>/<date> fields aren't valid
      // Mongoose ObjectId/Date values — omit them so the field is left
      // unset (create) or unchanged (update) instead of failing a cast.
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

  return (
    <form onSubmit={submit} className="space-y-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        {fields.map((f) => (
          <label key={f.name} className={f.type === "textarea" ? "block sm:col-span-2" : "block"}>
            <span className="text-label-caps uppercase text-on-surface-variant font-bold">
              {f.label}
              {f.required && <span className="text-primary"> *</span>}
            </span>
            {f.type === "select" ? (
              <select
                className={inputClass + " appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%232B2B2F%22 stroke-width=%222.5%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px]"}
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
                className={inputClass + " h-24 py-2.5 resize-none"}
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

      {error && (
        <p className="flex items-start gap-2 text-body-md font-semibold text-primary bg-primary/5 border-2 border-primary/30 rounded-xl px-3.5 py-2.5">
          <Icon name="error" className="text-[18px] shrink-0 mt-0.5" />
          {error}
        </p>
      )}

      <div className="flex justify-end gap-sm pt-md border-t-2 border-outline/10">
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
