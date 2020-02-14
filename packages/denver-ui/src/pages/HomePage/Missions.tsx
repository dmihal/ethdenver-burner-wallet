import React, { Fragment } from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import { PluginButtonProps, Actions } from '@burner-wallet/types';
import QuestButton from './QuestButton';
import QuestInfo from './QuestInfo';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 1000px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 100px;
  width: 1000px;
`;


interface MissionProps extends PluginButtonProps {
  action?: () => void;
  task: string;
  color: string;
  xp: number;
  onClick?: (actions?: Actions) => void;
  link?: string;
}

const Mission: React.FC<MissionProps> = ({ title, task, color, xp, onClick, link }) => {
  const { actions } = useBurner();

  if (!task || task.length === 0) {
    return null;
  }

  if (onClick) {
    return (
      <QuestButton location={title} task={task} color={color} xp={xp} onClick={() => onClick(actions)} />
    );
  }

  if (link) {
    return (
      <QuestButton
        location={title}
        task={task}
        color={color}
        xp={xp}
        onClick={() => window.open(link, 'mission')}
      />
    );
  }

  return (
    <QuestInfo location={title} task={task} color={color} xp={xp} />
  );
};

const Missions: React.FC<{ missions: any[] }> = ({ missions }) => {
  console.log({missions})
  return (
    <Container>
      {missions.map((mission) => (<Mission key={mission.title} {...mission} />))}
    </Container>
  )
}

export default Missions;
