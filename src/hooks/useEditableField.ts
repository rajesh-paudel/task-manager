import { useState } from "react";

export function useEditableField(
  initialValue: string,
  onSave: (value: string) => Promise<void>,
) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [prevInitial, setPrevInitial] = useState(initialValue);

  if (!editing && prevInitial !== initialValue) {
    setPrevInitial(initialValue);
    setValue(initialValue);
  }

  const start = () => {
    setValue(initialValue);
    setError("");
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setError("");
  };

  const commit = async () => {
    setSaving(true);
    setError("");
    try {
      await onSave(value.trim());
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return { editing, value, setValue, saving, error, start, cancel, commit };
}