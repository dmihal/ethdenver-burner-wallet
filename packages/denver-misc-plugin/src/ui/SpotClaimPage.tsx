import React, { Fragment, useRef, useState, useEffect } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import DenverMiscPlugin from '../DenverMiscPlugin';
import styled from 'styled-components';

const Inner = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

interface ClaimPageParams {
  key: string;
}

const SpotClaimPage: React.FC<PluginPageContext<ClaimPageParams>> = ({
  match, BurnerComponents, plugin, defaultAccount, actions
}) => {
  const _plugin = plugin as DenverMiscPlugin;
  const ammount = useRef(null);
  const message = useRef(null);
  const [status, setStatus] = useState('validating');
  const [loggedIn, setLoggedIn] = useState(false);

  const claim = async (key, account) => {
    try {
      if (!(await _plugin.canClaimSpot(key, account))) {
        setStatus('unavailable');
        return;
      }
      setStatus('claiming');
      const { message: msg, xp } = await _plugin.claimSpot(key, account);
      message.current = msg;
      ammount.current = xp;
      setStatus('complete');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  const simpleClaim = async (key, account) => {
    try {
      if (!(await _plugin.canClaimSimpleSpot(key, account))) {
        setStatus('unavailable');
        return;
      }
      setStatus('claiming');
      const { message: msg, xp } = await _plugin.claimSimpleSpot(key, account);
      message.current = msg;
      ammount.current = xp;
      setStatus('complete');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  useEffect(() => {
    Promise.resolve(actions.callSigner('isLoggedIn', 'fortmatic')).then((isLoggedIn: any) => {
      const userType = window.localStorage.getItem('userType');
      setLoggedIn(isLoggedIn || userType === 'claim');
    });
  }, [defaultAccount]);

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    const key = match.params.key;
    if (key.indexOf('simple') === 0) {
      simpleClaim(key.substr(6), defaultAccount);
    } else {
      claim(key, defaultAccount);
    }
  }, [match, loggedIn]);

  const { Page, Button } = BurnerComponents;
  return (
    <Page title="Claiming XP...">
      <Inner>
        {!loggedIn && 'Waiting for Fortmatic'}

        {status === 'claiming' && 'Claiming your XP'}

        {status === 'complete' && (
          <Fragment>
            <h2>Claimed {ammount.current} XP</h2>
            <div>{message.current}</div>
            <Button to="/">Continue</Button>
          </Fragment>
        )}

        {status === 'unavailable' && ('You\'ve already claimed this')}

        {status === 'error' && 'Unable to claim XP'}
      </Inner>
    </Page>
  );
}

export default SpotClaimPage;