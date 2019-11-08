import React from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import styled from 'styled-components';

const Logo = styled.div`
  background-image: url('https://d3n32ilufxuvd1.cloudfront.net/516900f311bc0f0000000254/1410057/upload-dc027cb2-94ee-4c33-aa1b-0986d3a41e7f.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 70px;
  margin: 20px;
`;

const LinkdropInfoPage: React.FC<PluginPageContext> = ({ burnerComponents }) => {
  const { Page } = burnerComponents;

  return (
    <Page title="Linkdrop">
      <Logo />
      <div>Linkdrop provides access to encode digital assets into shareable links & QR-codes.</div>
    </Page>
  );
};

export default LinkdropInfoPage;
