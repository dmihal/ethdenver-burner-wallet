import React, { useState } from 'react';
import AdminPlugin from '../AdminPlugin';
import EditableNumber from './EditableNumber';

interface FaucetProps {
  name: string;
  network: string;
  address: string;
  cap: string;
  denominations: string[];
  sender: string;
  plugin: AdminPlugin;
  refresh: () => void;
}

const Faucet: React.FC<FaucetProps> = ({ name, network, address, cap, denominations, plugin, sender, refresh }) => {
  const [newdenom, setNewdenom] = useState('0');
  const [loading, setLoading] = useState(false);

  const addDenomination = async () => {
    setLoading(true);
    await plugin.setDenomination(newdenom, true, address, network, sender);
    setLoading(false);
    setNewdenom('0');
    refresh();
  };
  const removeDenomination = async (denomination: string) => {
    setLoading(true);
    await plugin.setDenomination(denomination, false, address, network, sender);
    setLoading(false);
    refresh();
  };
  return (
    <div>
      <h3>{name}</h3>
      <div>
        Cap: {}
        <EditableNumber
          value={cap}
          onSave={(newCap: string) => plugin.setFaucetCap(newCap, address, network, sender)}
        />
      </div>
      <div>Allowed denominations</div>
      <ul>
        {denominations.map((denomination: string) => (
          <li key={denomination}>
            {denomination} XP
            <button onClick={() => removeDenomination(denomination)} disabled={loading}>X</button>
          </li>
        ))}
      </ul>
      <div>
        Add denomination:
        <input type="number" value={newdenom} onChange={(e: any) => setNewdenom(e.target.value)} min="0" />
        <button disabled={loading} onClick={addDenomination}>Add</button>
      </div>
    </div>
  )
}

export default Faucet;