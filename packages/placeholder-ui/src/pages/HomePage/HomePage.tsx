import React, { useLayoutEffect, useState, useEffect, useRef, Fragment } from 'react';
import styled from 'styled-components';
import { useBurner } from '@burner-wallet/ui-core';

import ScrollingGame from './ScrollingGame';

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
        <button onClick={login}>
          Sign in with Fortmatic
        </button>
      )}
    </ScrollingGame>
  );
}

export default HomePage;
