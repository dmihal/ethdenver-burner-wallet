import React, { useState } from 'react';
import { PluginElementContext, Asset } from '@burner-wallet/types';
import TestHelpersPlugin from './TestHelpersPlugin';

const ButtonBar: React.FC<PluginElementContext> = ({ BurnerComponents, plugin, defaultAccount }) => {
  const _plugin = plugin as TestHelpersPlugin;
  const { Button } = BurnerComponents;
  return (
    <div style={{ display: 'flex' }}>
      <Button onClick={() => _plugin.mint(defaultAccount, 10)}>+10 BuffiDai</Button>
      <Button onClick={() => _plugin.toggleFaucet(defaultAccount)}>Toggle faucet</Button>
    </div>
  );
}

export default ButtonBar;