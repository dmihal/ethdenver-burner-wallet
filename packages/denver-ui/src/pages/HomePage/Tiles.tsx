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
  logo?: string;
  xCoord: number;
  yCoord: number;
}

const Tile: React.FC<MissionProps> = ({ logo, xCoord, yCoord }) => {
  if (!logo) {
    return null;
  }

  return (
    <TileContainer xCoord={xCoord} yCoord={yCoord}>
      <img src={logo} style={{ maxWidth: '175px' }} />
    </TileContainer>
  );
};

const Tiles: React.FC<{ floor: number }> = ({ floor }) => {
  const { BurnerComponents } = useBurner();
  const { PluginButtons } = BurnerComponents;
  return (
    <Container>
      <PluginButtons position={`floor_${floor}`} component={Tile} />
    </Container>
  )
}

export default Tiles;
