import React, { Fragment } from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import Blockies from 'react-blockies';
import profile from '../../images/profile.png';
import { DataProviders } from '@burner-wallet/ui-core';
import styled from 'styled-components';

const { AddressName } = DataProviders;

const Container = styled.div`
  font-size: 13px;
  color: #DDDDDD;
  letter-spacing: -0.1;
  font-family: 'Squada One', Impact, Arial, Helvetica, sans-serif;
  width: 180px;
  height: 43px;
  cursor: pointer;
  padding-right: 27px;
  background-image: url(${profile});
  filter: drop-shadow(0px 0px 4px #222222);
  text-align: right;
  display: flex;
  justify-content: flex-end;
  flex-direction: reverse;
  align-items: center;
`;

const Names = styled.div`
  display: flex;
  flex-direction: color
  justify-content: center;
  margin-right: 8px;
  flex-direction: column;
`;

const Primary = styled.div``;

const Secondary = styled.div`
  color: #b7b6b6;
`;

const OverlayAccount = () => {
  const { BurnerComponents, defaultAccount, actions } = useBurner();
  return (
    <Container onClick={() => actions.navigateTo('/account')}>
      <AddressName
        address={defaultAccount}
        render={(name: string | null) => {
          if (name) {
            return (
              <Names>
                <Primary>{name}</Primary>
                <Secondary>{defaultAccount.substr(0, 10)}</Secondary>
              </Names>
            );
          }
          return (
            <Names><Primary>{defaultAccount.substr(0, 10)}</Primary></Names>
          );
        }}
      />

      <Blockies seed={defaultAccount.toLowerCase()} size={8} scale={3.3} />
    </Container>
  )
}

export default OverlayAccount;
