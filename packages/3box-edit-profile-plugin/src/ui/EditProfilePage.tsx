import React, { useState, useEffect, Component } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import EditProfile from '3box-profile-edit-react';
import Box from '3box';
import ThreeBoxEditProfilePlugin from '../ThreeBoxEditProfilePlugin';

// interface EditProfileProps {
//   box: object;
//   space: object;
//   currentUserAddr: string;
// }

// class EditProfileComponent extends Component<EditProfileProps, {}>;

const EditProfilePage: React.FC<PluginPageContext> = ({ defaultAccount, BurnerComponents, plugin }) => {
  const _plugin = plugin as ThreeBoxEditProfilePlugin;
  const { Page } = BurnerComponents;
  const [box, setBox] = useState();
  const [space, setSpace] = useState();
  const [profile, setProfile] = useState();
  const [myAddress, setAddress] = useState();

  useEffect(() => {
    async function handleLoad3Box() {
      const addresses = await window.ethereum.enable();
      const myAddress = addresses[0];

      const updatedBox = await Box.openBox(myAddress, window.ethereum, {});
      // const updatedBox = await Box.openBox(defaultAccount, _plugin.getProvider(), {});

      const updatedProfile = await Box.getProfile(myAddress);
      // const updatedProfile = await Box.getProfile(defaultAccount);

      const updatedSpace = await updatedBox.openSpace('ethDenver');

      await updatedBox.syncDone;

      setSpace(updatedSpace);
      setProfile(updatedProfile);
      setAddress(myAddress);
      setBox(updatedBox);
    }

    handleLoad3Box();
  }, [defaultAccount]);

  return (
    <Page title="Edit profile">
      {box ? (
        <EditProfile
          box={box}
          space={space}
          currentUserAddr={myAddress}
        // currentUserAddr={defaultAccount}
        />
      ) : <p>Loading</p>}
    </Page>
  );
};

export default EditProfilePage;
