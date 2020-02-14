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
  match, BurnerComponents, plugin, defaultAccount
}) => {
  const _plugin = plugin as DenverMiscPlugin;
  const ammount = useRef(null);
  const message = useRef(null);
  const [status, setStatus] = useState('validating');

  const claim = async (key, account) => {
    try {
      if (!(await _plugin.canClaimSpot(key, account))) {
        setStatus('unavailable');
        return;
      }
      setStatus('claiming');
      await _plugin.claimSpot(key, account);
      setStatus('complete')
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  useEffect(() => {
    claim(match.params.key, defaultAccount);
  }, [match]);

  const { Page, Button } = BurnerComponents;
  return (
    <Page title="Claiming XP...">
      <Inner>
        {status === 'claiming' && 'Claiming your XP'}

        {status === 'complete' && (
          <Fragment>
            <h2>Claimed XP</h2>
            <div></div>
            <Button to="/">Continue</Button>
          </Fragment>
        )}

        {status === 'error' && 'Unable to claim XP'}
      </Inner>
    </Page>
  );
}

export default SpotClaimPage;