import React, { useState } from 'react';
import { PluginElementContext, Asset } from '@burner-wallet/types';
import styled from 'styled-components';
import Account from './Account';
import FortmaticButton from './FortmaticButton';
import FortmaticLogin from './FortmaticLogin';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const FortmaticStatusBar: React.FC<PluginElementContext> = ({ BurnerComponents }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  return (
    <Container>
      {authenticated ? (
        <Account />
      ) : (
        <FortmaticButton Button={BurnerComponents.Button} onClick={() => setShowLogin(true)} />
      )}
      {showLogin && (
        <FortmaticLogin onClick={() => {
          setShowLogin(false);
          setAuthenticated(true);
        }} />
      )}
    </Container>
  );
};

export default FortmaticStatusBar;
