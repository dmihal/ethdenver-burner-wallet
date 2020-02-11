import React from 'react';
import { PluginPageContext } from '@burner-wallet/types';

export const pkRegex = /^0x[0-9a-f]{64}$/i;


const SpotClaimPage: React.FC<PluginPageContext> = ({ actions }) => {
  const getPK = () => {
    if (window.location.hash.length > 1) {
      const hash = window.location.hash.substr(1);
      if (pkRegex.test(hash)) {
        return hash;
      }
    }
    return null;
  };
  const pk = getPK();

  if (pk) {
    localStorage.setItem('userType', 'claim');
    actions.safeSetPK(pk);
  } else {
    actions.navigateTo('/')
  }

  return null;
};

export default SpotClaimPage;
