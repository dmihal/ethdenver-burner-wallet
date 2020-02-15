import React, { Fragment } from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import { PluginButtonProps } from '@burner-wallet/types';
import QuestInfo from './QuestInfo';
import styled from 'styled-components';

const Container = styled.div``;

const TileContainer = styled.div<{ xCoord: number; yCoord: number }>`
  opacity:0.99;
  position: absolute;
  right: ${({ xCoord, yCoord }) => 346 + xCoord * 106 - yCoord * 69}px;
  bottom: ${({ xCoord, yCoord }) => 238 + xCoord * 21 + yCoord * 43}px;
`;


interface MissionProps extends PluginButtonProps {
  image?: string;
  game_x_coord: number;
  game_y_coord: number;
}

const Tile: React.FC<MissionProps> = ({ image, game_x_coord, game_y_coord }) => {
  if (!image) {
    return null;
  }

  return (
    <TileContainer xCoord={game_x_coord} yCoord={game_y_coord}>
      <img src={image} style={{ maxWidth: '175px', maxHeight: '175px' }} />
    </TileContainer>
  );
};

const Tiles: React.FC<{ missions: any[] }> = ({ missions }) => {
  return (
    <Container>
      {missions.map((mission) => (<Tile key={mission.title} {...mission} />))}
    </Container>
  );
};

export default Tiles;
