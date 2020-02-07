import React, { Fragment, useRef, useState, useEffect } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import SponsorPlugin, { Mission } from '../SponsorPlugin';
import styled from 'styled-components';

const Inner = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

interface SendPageParams {
  to: string;
}

const SpotClaimPage: React.FC<PluginPageContext<SendPageParams>> = ({
  match, BurnerComponents, plugin, defaultAccount, actions
}) => {
  const _plugin = plugin as SponsorPlugin;
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState(-1);

  useEffect(() => {
    _plugin.getMissions(defaultAccount, match.params.to)
      .then((_missions: Mission[]) => setMissions(_missions));
  }, [match, defaultAccount]);

  const send = () => {
    actions.send({
      to: match.params.to,
      asset: 'xp',
      ether: missions[selectedMission].xp,
      message: missions[selectedMission].task,
    });
  };

  const { Page, Button } = BurnerComponents;
  return (
    <Page title="Send XP">
      <div>To: {match.params.to}</div>
      <div style={{ display: 'flex' }}>
        {missions.map((mission: Mission, i: number) => (
          <Button disabled={!mission.canSend || selectedMission === i} onClick={() => setSelectedMission(i)}>
            <div>{mission.xp}</div>
            <div>{mission.task}</div>
          </Button>
        ))}
      </div>
      <Button onClick={send} disabled={selectedMission === -1}>Send</Button>
    </Page>
  );
}

export default SpotClaimPage;