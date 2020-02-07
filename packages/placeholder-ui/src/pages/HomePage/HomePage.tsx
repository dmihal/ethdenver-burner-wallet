import React, { useLayoutEffect, useState, useEffect, useRef, Fragment } from 'react';
import styled from 'styled-components';
import { useBurner } from '@burner-wallet/ui-core';
import logo from '../../daostack.svg';
import discord from '../../discord.svg';

import ScrollingGame from './ScrollingGame';

const FortmaticButton = styled.button`
  display: flex;
  flex-direction: column;
  background: blue;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  padding: 10px;
  text-align: left;

  & h2 {
    font-weight: bold;
    margin: 0;
    font-size: 20px;
  }
  & h3 {
    color: #CCCCCC;
    font-size: 14px;
    font-weight: normal;
    margin: 0;
  }
`;

const DAOStackLink = styled.a`
  display: block;
  background-color: blue;
  background-image: url('${logo}');
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  padding: 10px;
  background-repeat: no-repeat;
  background-position-x: 8px;
  line-height: 30px;
  background-size: 30px;
  background-position-y: center;
  padding-left: 42px;
  margin-top: 40px;
  text-decoration: none;
  white-space: nowrap;
`;

const DiscordLink = styled.a`
  display: block;
  background-color: #4040bf;
  background-image: url('${discord}');
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  padding: 10px;
  background-repeat: no-repeat;
  background-position-x: 8px;
  line-height: 30px;
  background-size: 30px;
  background-position-y: center;
  padding-left: 40px;
  margin-top: 80px;
  text-decoration: none;
`;

const Heading = styled.h1`
  color: white;
  font-size: 24px;
`;

const Description = styled.p`
  color: white;
  font-size: 16px;
`;

const HomePage: React.FC = () => {
  const [status, setStatus] = useState('fortmatic');
  const { accounts, actions } = useBurner();
  const signaturePending = useRef(false);

  const isOverride = () => {
    const isContractWallet = actions.canCallSigner('isContractWallet', accounts[0]);
    if (!isContractWallet) {
      console.log('Are contract wallets disabled?');
      return true;
    }

    const localSigner = accounts[accounts.length - 1]
    return actions.callSigner('getSignerOverride', accounts[0]) === localSigner;
  }

  useEffect(() => {
    if (!actions.callSigner('user', 'fortmatic')) {
      setStatus('fortmatic');
      return;
    }

    if (!isOverride() && !signaturePending.current) {
      signaturePending.current = true;
      Promise.resolve(actions.callSigner('setSignerOverride', accounts[0], accounts[accounts.length - 1]))
        .then(() => { signaturePending.current = false });
      return;
    }

    setStatus('loggedIn');
  }, [accounts]);

  const login = async () => {
    await actions.callSigner('enable', 'fortmatic');
    if (!isOverride()) {
      await actions.callSigner('setSignerOverride', accounts[0], accounts[accounts.length - 1]);
    }
  };

  return (
    <ScrollingGame>
      {status === 'fortmatic' && (
        <div>
          <Heading>The adventure is only a few days away...</Heading>
          <Description>
            Make sure you're all set to hack! Log in with the Fortmatic account you used to register for ETHDenver
          </Description>
          <FortmaticButton onClick={login}>Sign in with Fortmatic</FortmaticButton>
        </div>
      )}
      {status === 'loggedIn' && (
        <div>
          <Heading>You're ready to go!</Heading>

          <DAOStackLink>PegaBufficorn Competition</DAOStackLink>
          <Description>Winners receive 300 Dai and will have their design printed on stickers</Description>

          <DiscordLink href="https://discord.gg/yxYT6Vd">Join the ETHDenver Discord</DiscordLink>
        </div>
      )}
    </ScrollingGame>
  );
}

export default HomePage;
