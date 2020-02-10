import React, { useState, Fragment } from 'react';

const EditableNumber: React.FC<{ value: string; onSave: (val: string) => Promise<any>}> = ({ value, onSave }) => {
  const [userVal, setUserVal] = useState(value);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await onSave(userVal);
    setLoading(false);
  };

  return (
    <Fragment>
      <input type="number" value={userVal} onChange={(e: any) => setUserVal(e.target.value)} min="0" disabled={loading} />
      {userVal !== value && (
        <button disabled={loading} onClick={save}>Save</button>
      )}
    </Fragment>
  )
};

export default EditableNumber;
