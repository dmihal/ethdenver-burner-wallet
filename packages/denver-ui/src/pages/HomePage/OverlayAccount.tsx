import React from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import Blockies from 'react-blockies';
import profile from '../../images/profile.png';

import styled from 'styled-components';

const Container = styled.div`
  font-size: 13px;
  color: #DDDDDD;
  letter-spacing: -0.1;
  font-family: 'Squada One', Impact, Arial, Helvetica, sans-serif;
  width: 180px;
  height: 43px;

  padding: 16px 26px;

  background-image: url(${profile});
  filter:"drop-shadow(0px 0px 4px #222222);
`;

const OverlayAccount = () => {
  const { BurnerComponents, defaultAccount, actions } = useBurner();
  return (
    <Container onClick={() => actions.navigateTo('/account')}>
      {defaultAccount.substr(0, 10)}
      <div style={{position:"absolute",top:-9,right:18,textAlign:'left'}}>
        <Blockies seed={defaultAccount} size={8} scale={3} />
      </div>
    </Container>
  )
}

export default OverlayAccount;
