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
  id: string;
}

const SpotClaimPage: React.FC<PluginPageContext<ClaimPageParams>> = ({
  match, BurnerComponents, plugin, defaultAccount
}) => {
  const _plugin = plugin as DenverMiscPlugin;
  const ammount = useRef(null);
  const message = useRef(null);
  const [status, setStatus] = useState('claiming');

  useEffect(() => {
    _plugin.claimSpot(match.params.id, defaultAccount)
      .then(({ ammount, message }: any) => {
        ammount.current = ammount;
        message.current = message;
        setStatus('complete');
      })
      .catch(() => setStatus('error'));
  }, [match]);

  const { Page, Button } = BurnerComponents;
  return (
    <Page title="Claiming XP...">
      <Inner>
        {status === 'claiming' && 'Claiming your XP'}

        {status === 'complete' && (
          <Fragment>
            <h2>Claimed {ammount.current} XP</h2>
            <div>{message.current}</div>
            <Button to="/">Continue</Button>
          </Fragment>
        )}

        {status === 'error' && 'Unable to claim XP'}
      </Inner>
    </Page>
  );
}

export default SpotClaimPage;