import React, { useState, useEffect, Component } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import styled from 'styled-components';
import EditProfile from '3box-profile-edit-react';
import Box from '3box';

import ThreeBoxEditProfilePlugin from '../ThreeBoxEditProfilePlugin';

const EditProfileContainer = styled.div`
  position: absolute;
  left: -16px;
  top: -40px;
`;

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
      const address = addresses[0];
      const updatedBox = await Box.create(address, window.ethereum, {});
      const spaces = ['ethDenver'];
      await updatedBox.auth(spaces, { address })
      // const updatedBox = await Box.openBox(defaultAccount, _plugin.getProvider(), {});

      const updatedProfile = await Box.getProfile(address);
      // const updatedProfile = await Box.getProfile(defaultAccount);

      const updatedSpace = await updatedBox.openSpace('ethDenver');
      await updatedBox.syncDone;

      setSpace(updatedSpace);
      setProfile(updatedProfile);
      setAddress(address);
      setBox(updatedBox);
    }

    handleLoad3Box();
  }, [defaultAccount]);

  return (
    <Page title="Edit profile">
      {box ? (
        <EditProfileContainer>
          <EditProfile
            box={box}
            space={space}
            currentUserAddr={myAddress}
            currentUser3BoxProfile={profile}
          />
        </EditProfileContainer>
      ) : <p>Loading</p>}
    </Page>
  );
};

export default EditProfilePage;
