import React, { useEffect, useState } from 'react';
import { useBurner } from '@burner-wallet/ui-core';
import { AccountBalanceData } from '@burner-wallet/types';
import styled from 'styled-components';
import tokenBar from '../../images/tokenBar.png';
import tokenBarWithToken from '../../images/tokenBarWithToken.png';
import tokenBarWithTwoTokens from '../../images/tokenBarWithTwoTokens.png';

const fetch = require('node-fetch');

/*
took this out for now
background-image: url('${tokenBarWithTwoTokens}');
background-size: contain;
background-repeat: no-repeat;
 */

const Container = styled.div`
  height: 100px;
  width: 100px;
  font-size: 13px;
  color: #DDDDDD;
  letter-spacing: -0.1;
  font-family: 'Squada One', Impact, Arial, Helvetica, sans-serif;
  filter: drop-shadow(0px 0px 4px #222222);
`;


const OverlayBalance: React.FC = () => {
  const { BurnerComponents } = useBurner();
  const [image,setImage] = useState(0)

  const pollingFn = async ()=>{
    console.log("polling tokens")
    try{
      const response = await fetch("https://s.buffidao.com/tokens");
      const json = await response.json();
      setImage(json.image)
    }catch(e){
      console.log(e)
    }
  }

  let possibleImage = [
    tokenBar,
    tokenBarWithToken,
    tokenBarWithTwoTokens
  ]

  useEffect(() => {
    let timeout = null;
    const poll = async () => {
      await pollingFn();
      timeout = setTimeout(poll, 10000);
    };
    poll();
    return ()=>{clearTimeout(timeout)}
  },[]);

  return (
    <Container>
      <div style={{position:"absolute",top:17,right:26,textAlign:"right",fontSize:16}}>
        <img src={possibleImage[image]} />
      </div>
    </Container>
  )
}

export default OverlayBalance;
