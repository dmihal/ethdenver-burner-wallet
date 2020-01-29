import React from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import { AccountBalanceData } from '@burner-wallet/types';
import valuehud from '../../images/valuehud.png';

const OverlayBuffidai = () => {
  const { BurnerComponents } = useBurner();
  return (
    <div style={{fontSize:13,color:"#DDDDDD",letterSpacing:-0.1,fontFamily:"'Squada One', Impact, Arial, Helvetica, sans-serif"}}>
      <img src={valuehud} style={{maxWidth:130,filter:"drop-shadow(0px 0px 4px #222222)",zIndex:1}}></img>
      <div style={{position:"absolute",top:17,right:72,textAlign:"right",fontSize:16}}>
        <BurnerComponents.AccountBalance
          asset="buffidai"
          render={(data: AccountBalanceData | null) => {
            if (!data) {
              return '...';
            }
            if (data.usdBalance) {
              return `$${data.usdBalance}`;
            }
            return data.displayBalance;
          }}
        />
      </div>
    </div>
  )
}

export default OverlayBuffidai;
