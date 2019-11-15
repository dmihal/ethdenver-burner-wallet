import React, { useState, Fragment } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import { getAssetValues, SupportedAsset, UnsupportedAsset } from '../assets';
import AmountCard from './AmountCard';

interface ClaimFormProps {
  urlProps: any;
  linkdropSDK: any;
}

type ClaimFormFullProps = ClaimFormProps & Pick<PluginPageContext, 'assets' | 'defaultAccount' | 'burnerComponents' | 'actions'>;

const ClaimForm: React.FC<ClaimFormFullProps> = ({
  urlProps, linkdropSDK, assets, defaultAccount, burnerComponents, actions
}) => {
  const [claiming, setClaiming] = useState(false);
  const [txHash, setTxHash] = useState<null | string>(null);
  const [error, setError] = useState<any>(null);
  const { Button } = burnerComponents;

  const claim = async () => {
    try {
      setClaiming(true);
      const result = await linkdropSDK.claim({
        ...urlProps,
        receiverAddress: defaultAccount,
      });

      setClaiming(false);
      if (result.success) {
        setTxHash(result.txHash);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError(err);
      setClaiming(false);
    }
  }

  if (error) {
    return (
      <div>
        <h2>Error claiming link</h2>
        <div>{error.toString()}</div>
      </div>
    );
  }

  if (txHash) {
    return (
      <div>
        <h2>Claimed successfully</h2>
        <div>{txHash}</div>
      </div>
    );
  }

  const { supportedAssets, unsupportedAssets } = getAssetValues(assets, urlProps);

  if (unsupportedAssets.length > 0) {
    return (
      <div>
        <div>
          Warning: this link contains assets not supported by this wallet. You can claim the link {}
          but you may be unable to access these assets.
        </div>
        {supportedAssets.length > 0 && (
          <Fragment>
            <div>Supported assets:</div>
            {supportedAssets.map(({ asset, value }: SupportedAsset) => (
              <AmountCard key={asset.id} asset={asset} value={value} />
            ))}
          </Fragment>
        )}
        <div>Unsupported Assets</div>
        {unsupportedAssets.map(({ network, address }: UnsupportedAsset) => (
          <div key={`${network}-${address || ''}`}>
            {address ? `Token (${address})` : 'Ether'}
            {network !== '1' && ` on chain "${network}"`}
          </div>
        ))}

        <div>
          <Button disabled={claiming} onClick={() => actions.navigateTo('/')}>Cancel</Button>
          <Button disabled={claiming} onClick={claim}>Claim Anyways</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>Claim this Linkdrop to receive the following assets:</div>
      {supportedAssets.map(({ asset, value }: SupportedAsset) => (
        <AmountCard key={asset.id} asset={asset} value={value} />
      ))}

      <Button disabled={claiming} onClick={claim}>Claim!</Button>
    </div>
  );
};

export default ClaimForm;
