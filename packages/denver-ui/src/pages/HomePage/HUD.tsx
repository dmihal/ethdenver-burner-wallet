import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import styled from 'styled-components';
import OverlayAccount from './OverlayAccount';
import OverlayTokens from './OverlayTokens';
import OverlayBalance from './OverlayBalance';
import OverlayXP from './OverlayXP';
import qrscan from "../../images/qrscan.png";
import fortmaticButton from '../../images/fortmaticButton.png';

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

const FortmaticButton = styled.button`
  position: absolute;
  bottom: 20%;
  background-image: url('${fortmaticButton}');
  height: 115px;
  width: 249px;
  background-color: transparent;
  border: none;
  transform: translateX(20000px) translateX(-50%);
  left: 50%;
  outline: none;
  cursor: pointer;
  z-index: 2002;
`;

const HUD: React.FC = () => {
  const { actions, assets, defaultAccount, accounts } = useBurner();
  const [showFortmatic, setFortmatic] = useState(window.localStorage.getItem('userType') !== 'claim');
  const signing = useRef(false);

  const isOverride = (_accounts) => {
    const isContractWallet = actions.canCallSigner('isContractWallet', _accounts[0]);
    if (!isContractWallet) {
      console.log('Are contract wallets disabled?');
      return true;
    }

    const localSigner = _accounts[_accounts.length - 1]
    return actions.callSigner('getSignerOverride', _accounts[0]) === localSigner;
  }

  const setOverride = async () => {
    if (!signing.current) {
      signing.current = true;
      await actions.callSigner('setSignerOverride', accounts[0], accounts[accounts.length - 1]);
      signing.current = false;
    }
  };

  const login = async () => {
    await actions.callSigner('enable', 'fortmatic');
    if (!isOverride(accounts)) {
      await setOverride();
    }
  };

  useEffect(() => {
    Promise.resolve(actions.callSigner('isLoggedIn', 'fortmatic')).then((isLoggedIn: any) => {
      const userType = window.localStorage.getItem('userType');
      setFortmatic(!isLoggedIn && userType !== 'claim');

      if (isLoggedIn && !isOverride(accounts)) {
        setOverride();
      }
    });
  }, [accounts]);

  const assetIDs = assets.map((asset) => asset.id);
  return (
      <OuterContainer>
        <InnerContainer>
          {!showFortmatic && (
            <Fragment>
              {assetIDs.indexOf('buff') !== -1 && (
                <Overlay top={24} side="left">
                  <OverlayBalance asset="buff" />
                </Overlay>
              )}

              {assetIDs.indexOf('xdai') !== -1 && (
                <Overlay top={64} side="left">
                  <OverlayBalance asset="xdai" />
                </Overlay>
              )}

              <Overlay top={104} side="left">
                <OverlayTokens />
              </Overlay>

              <Overlay top={24} side="right">
                <OverlayAccount />
              </Overlay>

              {assetIDs.indexOf('xp') !== -1 && (
                <Overlay top={70} side="right">
                  <OverlayXP />
                </Overlay>
              )}
            </Fragment>
          )}

          {showFortmatic && (
            <FortmaticButton onClick={login} />
          )}

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
