import React from 'react';
import styled from 'styled-components';
import OverlayAccount from './OverlayAccount';
import OverlayBuffidai from './OverlayBuffidai';
import OverlayXP from './OverlayXP';

const OuterContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
`;

const InnerContainer = styled.div`
  max-width: 900px;
  position: relative;
  flex: 1;
`;

const Overlay = styled.div<{ top: number; side: string }>`
  position: absolute;
  ${({ side }) => side}: 0;
  top: ${({ top }) => top}px;
`;


const HUD: React.FC = () => {
  return (
      <OuterContainer>
        <InnerContainer>
          <Overlay top={24} side="left">
            <OverlayBuffidai />
          </Overlay>

          <Overlay top={24} side="right">
            <OverlayAccount />
          </Overlay>

          <Overlay top={70} side="right">
            <OverlayXP />
          </Overlay>
        </InnerContainer>
      </OuterContainer>
  )
}

export default HUD;