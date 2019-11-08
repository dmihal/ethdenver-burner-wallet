import React, { useEffect, useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import getHashVariables from '@linkdrop/commons/get-hash-variables';
import LinkdropSDK from '@linkdrop/sdk/src/index';
import LinkdropPlugin from '../LinkdropPlugin';
import ClaimForm from './ClaimForm';


const ClaimPage: React.FC<PluginPageContext> = ({ burnerComponents, assets, defaultAccount, plugin, actions }) => {
  const linkdropPlugin = plugin as LinkdropPlugin;
  const { Page } = burnerComponents;

  const [claimed, setClaimed] = useState(false)
  const [loading, setLoading] = useState(true)

  // const {
  //   weiAmount,
  //   tokenAmount,
  //   // tokenAddress,
  //   linkdropSignerSignature,
  //   linkdropMasterAddress,
  //   linkKey,
  //   // expirationTime
  //   chainId,
  //   campaignId
  // }
  const urlProps = getHashVariables();

  if (!urlProps) {
    actions.navigateTo('/linkdrop/info');
    return null;
  }

  useEffect(() => {
    async function initialLinkCheck() {
      setLoading(true);
      const claimed = await linkdropPlugin.checkIfClaimed(urlProps);

      setClaimed(claimed);
      setLoading(false);
    }
    initialLinkCheck();
  }, []);

  const linkdropSDK = linkdropPlugin.getLinkdropSDK(urlProps.chainId, (urlProps.linkdropMasterAddress || defaultAccount));

  return (
    <Page title="Claim Linkdrop">
      {loading && (
        <div>Loading...</div>
      )}
      {claimed && (
        <div>Sorry, this link was already claimed...</div>
      )}
      {!loading && !claimed && (
        <ClaimForm
          urlProps={urlProps}
          linkdropSDK={linkdropSDK}
          defaultAccount={defaultAccount}
          assets={assets}
          burnerComponents={burnerComponents}
          actions={actions}
        />
      )}
    </Page>
  );
};

export default ClaimPage;
