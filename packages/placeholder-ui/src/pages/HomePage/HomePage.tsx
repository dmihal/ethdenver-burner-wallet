import React, { useLayoutEffect, useState, useEffect, useRef, Fragment } from 'react';
import styled from 'styled-components';
import { useBurner } from '@burner-wallet/ui-core';

import ScrollingGame from './ScrollingGame';

const FortmaticButton = styled.button`
  display: flex;
  flex-direction: column;
  background: blue;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  padding: 10px;
  text-align: left;

  & h2 {
    font-weight: bold;
    margin: 0;
    font-size: 20px;
  }
  & h3 {
    color: #CCCCCC;
    font-size: 14px;
    font-weight: normal;
    margin: 0;
  }
`;

const HomePage: React.FC = () => {
  const [status, setStatus] = useState('fortmatic');
  const { accounts, actions } = useBurner();

  const isOverride = () => {
    const isContractWallet = actions.canCallSigner('isContractWallet', accounts[0]);
    if (!isContractWallet) {
      console.log('Are contract wallets disabled?');
      return true;
    }

    const localSigner = accounts[accounts.length - 1]
    return actions.callSigner('getSignerOverride', accounts[0]) === localSigner;
  }

  useEffect(() => {
    if (!actions.callSigner('user', 'fortmatic')) {
      setStatus('fortmatic');
      return;
    }

  }, [accounts]);

  const login = async () => {
    await actions.callSigner('enable', 'fortmatic');
    if (!isOverride()) {
      await actions.callSigner('setSignerOverride', accounts[0], accounts[accounts.length - 1]);
    }
  };

  return (
    <ScrollingGame>
      {status === 'fortmatic' && (
        <FortmaticButton onClick={login}>
          Sign in with Fortmatic
        </FortmaticButton>
      )}
    </ScrollingGame>
  );
}

export default HomePage;
