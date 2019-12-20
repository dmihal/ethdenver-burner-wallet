import React, { useState, useEffect } from 'react';
import { PluginElementContext, Asset } from '@burner-wallet/types';
import styled from 'styled-components';
import Account from './Account';
import FortmaticButton from './FortmaticButton';
import FortmaticLogin from './FortmaticLogin';

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
    if (isContractWallet) {
      actions.callSigner('setSignerOverride', accounts[0], accounts[accounts.length - 1]);
    }
  }, [accounts[0]]);

  return (
    <Container>
      {authenticated ? (
        <Account />
      ) : (
        <FortmaticButton Button={BurnerComponents.Button} onClick={async () => {
          const account = await actions.callSigner('enable', 'fortmatic');
          setAuthenticated(!!account);
        }} />
      )}
    </Container>
  );
};

export default FortmaticStatusBar;
