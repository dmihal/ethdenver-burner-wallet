import React from 'react';
import { DataProviders } from '@burner-wallet/ui-core';
import { burnerComponents } from 'denver-ui';

const { Page } = burnerComponents;

const { PluginElements } = DataProviders;

const AdvancedPage: React.FC = () => {
  return (
    <Page title="Settings">
      <PluginElements position='advanced' />
    </Page>
  );
};

export default AdvancedPage;
