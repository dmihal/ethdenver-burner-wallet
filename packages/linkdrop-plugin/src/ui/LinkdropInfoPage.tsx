import React from 'react';
import { PluginPageContext } from '@burner-wallet/types';

const LinkdropInfoPage: React.FC<PluginPageContext> = ({ burnerComponents }) => {
  const { Page } = burnerComponents;

  return (
    <Page title="Linkdrop">
      Placeholder: info about linkdrop
    </Page>
  );
};

export default LinkdropInfoPage;
