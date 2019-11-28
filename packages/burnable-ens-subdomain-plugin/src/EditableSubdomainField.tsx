import React, { useEffect, useState } from 'react';

interface EditableSubdomainFieldProps {
  value: string;
  domain: string;
  onUpdate: (newValue: string) => void;
}

const EditableSubdomainField: React.FC<EditableSubdomainFieldProps> = ({ value, domain, onUpdate }) => {
  const [newValue, setNewValue] = useState<string | null>(null);

  useEffect(() => {
    if (onUpdate && !newValue) {}
  }, [onUpdate]);

  const update = (newValue: string) => {
    onUpdate(newValue);
    setNewValue(null);
  };

  return (
    <div>
      {onUpdate ? (
        <input value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewValue(e.target.value)} />
      ) : value}
      .{domain}
      {!newValue && (
        <a href="#" onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          setNewValue(value);
        }}>Edit</a>
      )}
      {newValue && (
        <div>
          <button onClick={() => update(newValue!)}>Save</button>
          <button onClick={() => setNewValue(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default EditableSubdomainField;
