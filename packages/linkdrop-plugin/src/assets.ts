import { Asset } from '@burner-wallet/assets';

export interface SupportedAsset {
  asset: Asset;
  value: string;
}

export interface UnsupportedAsset {
  network: string;
  address?: string;
}

export const getAssetValues = (allAssets: Asset[], urlProps: any) => {
  const supportedAssets: SupportedAsset[] = [];
  const unsupportedAssets: UnsupportedAsset[] = [];

  if (urlProps.weiAmount && urlProps.weiAmount != 0) {
    const [nativeAsset] = allAssets.filter((asset: Asset) =>
      asset.network === urlProps.chainId && asset.type === 'native');
    if (nativeAsset) {
      supportedAssets.push({
        asset: nativeAsset,
        value: urlProps.weiAmount,
      });
    } else {
      unsupportedAssets.push({ network: urlProps.chainId });
    }
  }

  if (urlProps.tokenAmount && urlProps.tokenAmount != 0) {
    const [token] = allAssets.filter((asset: any) =>
      asset.network === urlProps.chainId
      && asset.type !== 'native'
      && asset.address.toLowerCase() === urlProps.tokenAddress.toLowerCase());
    if (token) {
      supportedAssets.push({
        asset: token,
        value: urlProps.tokenAmount,
      });
    } else {
      unsupportedAssets.push({ network: urlProps.chainId, address: urlProps.tokenAddress });
    }
  }

  return { supportedAssets, unsupportedAssets };
}
