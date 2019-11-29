import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Account: React.FC = () => {
  return (
    <Container>
      <h1>Connected to Fortmatic</h1>
      <div>Name: Vitalik Buterin</div>
    </Container>
  );
};

export default Account;
