import React, { useEffect } from 'react';
import { PluginElementContext, Asset } from '@burner-wallet/types';
import EditableSubdomainField from './EditableSubdomainField';
import BurnableENSSubdomainPlugin from './BurnableENSSubdomainPlugin';

const NameEditor: React.FC<PluginElementContext> = ({ assets, plugin, burnerComponents, defaultAccount }) => {
  const _plugin = plugin as BurnableENSSubdomainPlugin;

  return (
    <div>
      <EditableSubdomainField
        value={_plugin.subdomain}
        domain={_plugin.domain}
        onUpdate={(newValue: string) => _plugin.setName(newValue)}
      />
    </div>
  );
};

export default NameEditor;
