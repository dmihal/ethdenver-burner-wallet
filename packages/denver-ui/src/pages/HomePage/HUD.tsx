import React, { useState } from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import styled from 'styled-components';
import OverlayAccount from './OverlayAccount';
import OverlayBalance from './OverlayBalance';
import OverlayXP from './OverlayXP';
import SideMenu from './SideMenu';
import qrscan from "../../images/qrscan.png";

const OuterContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  transform: translateX(-20000px);
  z-index: 150;
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
  transform: translateX(20000px);
`;

const UIBar = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 150;
  transform: translateX(20000px);
`;

const ScanButton = styled.button`
  height: 100px;
  width: 100px;
  border-radius: 100px;
  box-shadow: 0px 0px 4px #222222;
  background-image: url(${qrscan}), linear-gradient(#b75fac, #a24c97);
  margin: 0 auto;
  display: block;
  background-size: 90%;
  background-position: center;
  outline: none;
`;

const HUD: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { actions } = useBurner();
  return (
      <OuterContainer>
        <InnerContainer>
          <Overlay top={24} side="left">
            <OverlayBalance asset="buff" />
          </Overlay>

          <Overlay top={64} side="left">
            <OverlayBalance asset="xdai" />
          </Overlay>

          <Overlay top={100} side="left" style={{ zIndex: 170 }}>
            <button onClick={() => setMenuOpen(!menuOpen)}>Menu</button>
          </Overlay>

          <Overlay top={24} side="right">
            <OverlayAccount />
          </Overlay>

          <Overlay top={70} side="right">
            <OverlayXP />
          </Overlay>

          <SideMenu isOpen={menuOpen} />

          <UIBar>
            <ScanButton onClick={() => {
              window.scrollTo({
                top: 1,
                left: 1,
              });
              actions.openDefaultQRScanner()
            }} />
          </UIBar>
        </InnerContainer>
      </OuterContainer>
  )
}

export default HUD;
