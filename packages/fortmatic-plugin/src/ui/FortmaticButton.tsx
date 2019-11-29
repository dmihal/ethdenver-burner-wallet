import React, { ComponentType } from 'react';
import styled from 'styled-components';
import { ButtonProps } from '@burner-wallet/types';

const ButtonTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-image: url('https://demo-wallet--fortmatic.repl.co/logo.svg');
  background-repeat: no-repeat;
  background-position-y: center;
  padding-left: 42px;
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

interface FortmaticButtonProps {
  Button: ComponentType<ButtonProps>;
  onClick: () => void;
}

const FortmaticButton: React.FC<FortmaticButtonProps> = ({ Button, onClick }) => {
  return (
    // @ts-ignore
    <Button onClick={onClick} style={{ height: 'initial' }}>
      <ButtonTextContainer>
        <h2>Log in with Fortmatic</h2>
        <h3>Connect your Fortmatic account to unlock all features</h3>
      </ButtonTextContainer>
    </Button>
  );
};

export default FortmaticButton;
