import React from 'react';
import { PluginPageContext } from '@burner-wallet/types';

const EditProfilePage: React.FC<PluginPageContext> = ({ defaultAccount, BurnerComponents }) => {
  const { Page } = BurnerComponents;
  return (
    <Page title="Edit profile">
      {defaultAccount}
    </Page>
  );
};

export default EditProfilePage;
