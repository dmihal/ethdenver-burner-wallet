import React from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import Blockies from 'react-blockies';
import profile from '../../images/profile.png';

import styled from 'styled-components';

const QRContainer = styled.div`
  position: absolute;
  width: 28px;
  height: 28px;
  top: -9px;
  right: 48px;
  text-align: left;
  background-color: #eeeeee;
  padding: 1px;

  & svg {
    width: 100%;
    height: 100%;
  }
`;

const OverlayAccount = () => {
  const { BurnerComponents } = useBurner();
  return (
    <div style={{fontSize:13,color:"#DDDDDD",letterSpacing:-0.1,fontFamily:"'Squada One', Impact, Arial, Helvetica, sans-serif"}}>
      <img src={profile} style={{maxWidth:180,filter:"drop-shadow(0px 0px 4px #222222)",zIndex:1}}></img>
      <div style={{position:"absolute",top:18,right:68,textAlign:"right"}}>
        HudsonHornet
      </div>
      <div style={{position:"absolute",top:18,right:10,textAlign:'left',opacity:0.33}}>
        .buffidao.io
      </div>
      <QRContainer>
        <BurnerComponents.QRCode value={"0x34aa3f359a9d614239015126635ce7732c18fdf3"} renderAs="svg"/>
      </QRContainer>
      <div style={{position:"absolute",top:-9,right:18,textAlign:'left'}}>
        <Blockies
          seed="0x34aa3f359a9d614239015126635ce7732c18fdf3"
          size={8}
          scale={3}
        />
      </div>
    </div>
  )
}

export default OverlayAccount;
