import React from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import { AccountBalanceData } from '@burner-wallet/types';
import styled from 'styled-components';
import valuehud from '../../images/valuehud.png';

const Container = styled.div<{ icon: string | null }>`
  height: 132px;
  width: 130px;
  font-size: 13px;
  color: #DDDDDD;
  letter-spacing: -0.1;
  font-family: 'Squada One', Impact, Arial, Helvetica, sans-serif;
  filter: drop-shadow(0px 0px 4px #222222);
  background-image: url('${valuehud}');
  background-size: contain;

  ${({ icon }) => icon ? `
    :after {
      content: '';
      position: absolute;
      right: 0;
      display: block;
      background-image: url('${icon}');
      background-size: contain;
      height: 30px;
      width: 30px;
      right: 37px;
      background-repeat: no-repeat;
      top: 7px;
  ` : ''}
  }
`;

const OverlayBalance: React.FC<{ asset: string }> = ({ asset }) => {
  const { BurnerComponents } = useBurner();
  return (
    <BurnerComponents.AccountBalance
      asset={asset}
      render={(data: AccountBalanceData | null) => {
        let val = '...';
        if (data && data.usdBalance) {
          val = `$${data.usdBalance}`;
        } else if (data) {
          val = data.displayBalance;
        }

        return (
          <Container icon={data && data.asset.icon}>
            <div style={{position:"absolute",top:17,right:72,textAlign:"right",fontSize:16}}>
              {val}
            </div>
          </Container>
        );
      }}
    />
  )
}

export default OverlayBalance;
