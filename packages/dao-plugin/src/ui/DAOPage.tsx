import React from 'react';
import styled from 'styled-components';
import { PluginPageContext } from '@burner-wallet/types';

const IFrame = styled.iframe`
  border: 0;
  flex: 1;
  margin: -16px;
`;

const DAOPage: React.FC<PluginPageContext> = ({ BurnerComponents }) => {
  return (
    <BurnerComponents.Page title="DAO">
      <IFrame
        src="https://alchemy.daostack.io/dao/0x294f999356ed03347c7a23bcbcf8d33fa41dc830/scheme/0x28c5b9efd5bdec2c69c613d2df4b5e1b92e44a2d3c2f5092fb45187570029009"
      />
    </BurnerComponents.Page>
  );
};

export default DAOPage;
