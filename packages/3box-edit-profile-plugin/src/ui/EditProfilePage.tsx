import React, { useState, useEffect, Component } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import EditProfile from '3box-profile-edit-react';
import Box from '3box';

// interface EditProfileProps {
//   box: object;
//   space: object;
//   currentUserAddr: string;
// }

// class EditProfileComponent extends Component<EditProfileProps, {}>;

const EditProfilePage: React.FC<PluginPageContext> = ({ defaultAccount, BurnerComponents }) => {
  const { Page } = BurnerComponents;
  const [box, setBox] = useState();
  const [address, setAddress] = useState('');
  const [space, setSpace] = useState();
  const [profile, setProfile] = useState();

  useEffect(() => {
    async function handleLoad3Box() {
      const addresses = await window.ethereum.enable();
      const address = addresses[0];

      const updatedBox = await Box.openBox(address, window.ethereum, {});
      const updatedProfile = await Box.getProfile(address);
      const updatedSpace = await updatedBox.openSpace('ethDenver');

      setBox(updatedBox);
      setAddress(address);
      setSpace(updatedSpace);
      setProfile(updatedProfile);

      await updatedBox.syncDone;
    }

    handleLoad3Box();
  }, []);

  return (
    <Page title="Edit profile">
      {address && <p>fetched</p>}
      {defaultAccount}

      {address && (
        <EditProfile
          box={box}
          space={space}
          currentUserAddr={address}
        />
      )}
    </Page>
  );
};

export default EditProfilePage;
