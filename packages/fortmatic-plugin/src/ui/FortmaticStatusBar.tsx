import React, { useState, useEffect } from 'react';
import { PluginElementContext, Asset } from '@burner-wallet/types';
import styled from 'styled-components';
import FortmaticButton from './FortmaticButton';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const FortmaticStatusBar: React.FC<PluginElementContext> = ({ BurnerComponents, actions, accounts }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(!actions.canCallSigner('enable', 'fortmatic'));
  }, [accounts]);

  useEffect(() => {
    const isContractWallet = actions.canCallSigner('isContractWallet', accounts[0]);
    const localSigner = accounts[accounts.length - 1]
    if (isContractWallet && actions.callSigner('getSignerOverride', accounts[0]) !== localSigner) {
      actions.callSigner('setSignerOverride', accounts[0], localSigner);
    }
  }, [accounts[0]]);

  if (authenticated) {
    return null;
  }

  return (
    <FortmaticButton Button={BurnerComponents.Button} onClick={async () => {
      const account = await actions.callSigner('enable', 'fortmatic');
      setAuthenticated(!!account);
    }} />
  );
};

export default FortmaticStatusBar;
