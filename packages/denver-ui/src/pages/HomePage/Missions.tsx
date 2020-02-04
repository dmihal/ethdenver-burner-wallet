import React, { Fragment } from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import { PluginButtonProps, Actions } from '@burner-wallet/types';
import QuestButton from './QuestButton';
import QuestInfo from './QuestInfo';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 0;
  right: -150px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 100px;
`;


interface MissionProps extends PluginButtonProps {
  action?: () => void;
  description: string;
  logo?: string;
  to: string | null;
  color: string;
  xp: number;
  onClick?: (actions?: Actions) => void;
}

const Mission: React.FC<MissionProps> = ({ title, description, logo, to, color, xp, onClick }) => {
  const { actions } = useBurner();

  if (onClick) {
    return (
      <QuestButton location={title} task={description} color={color} xp={xp} onClick={() => onClick(actions)} />
    );
  }

  return (
    <QuestInfo location={title} task={description} color={color} xp={xp} />
  );
};

const Missions: React.FC<{ floor: number }> = ({ floor }) => {
  const { BurnerComponents } = useBurner();
  const { PluginButtons } = BurnerComponents;
  return (
    <Container>
      <PluginButtons position={`floor_${floor}`} component={Mission} />
    </Container>
  )
}

export default Missions;
