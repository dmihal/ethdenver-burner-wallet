import React, { useLayoutEffect, useState, useEffect, useRef, Fragment } from 'react';
import styled from 'styled-components';
import { useBurner } from '@burner-wallet/ui-core';

import ScrollingGame from './ScrollingGame';

const HomePage: React.FC = () => {
  const [status, setStatus] = useState('fortmatic');
  const { accounts, actions } = useBurner();

  useEffect(() => {
    if (!actions.callSigner('user', 'fortmatic')) {
      setStatus('fortmatic');
      return;
    }
  }, [accounts]);

  return (
    <ScrollingGame>
      {status === 'fortmatic' && (
        <button onClick={() => actions.callSigner('enable', 'fortmatic').then(() => setStatus(''))}>
          Sign in with Fortmatic
        </button>
      )}
    </ScrollingGame>
  );
}

export default HomePage;
