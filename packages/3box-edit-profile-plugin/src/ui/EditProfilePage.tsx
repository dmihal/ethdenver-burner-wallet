import React, { useState, useEffect, Component } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import styled from 'styled-components';
import EditProfile from '3box-profile-edit-react';

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
      const threeBox = await _plugin.exposeBox();

      setSpace(threeBox.space);
      setProfile(threeBox.profile);
      setAddress(threeBox.address);
      setBox(threeBox.box);
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
