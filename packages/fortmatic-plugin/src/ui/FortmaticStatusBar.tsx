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

const FortmaticStatusBar: React.FC<PluginElementContext> = ({ BurnerComponents, actions }) => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(!actions.canCallSigner('enable', 'fortmatic'));
  }, []);

  return (
    <Container>
      {authenticated ? (
        <Account />
      ) : (
        <FortmaticButton Button={BurnerComponents.Button} onClick={async () => {
          await actions.callSigner('enable', 'fortmatic');
          setAuthenticated(!actions.canCallSigner('enable', 'fortmatic'));
        }} />
      )}
    </Container>
  );
};

export default FortmaticStatusBar;
