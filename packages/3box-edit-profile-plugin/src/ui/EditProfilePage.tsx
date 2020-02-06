import React, { useState, useEffect } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import styled from 'styled-components';
import EditProfile from '3box-profile-edit-react';
import Box from '3box';
import Web3 from 'web3';

import ThreeBoxEditProfilePlugin from '../ThreeBoxEditProfilePlugin';

const customFields = [
  {
    inputType: 'text',
    key: 'project',
    field: 'Project / Team / Company'
  },
  {
    inputType: 'text',
    key: 'role',
    field: 'Role'
  },
];

const ClaimedXPConfirmation = styled.div`
  position: absolute;
  left: calc((100% - 448px)/2);
  bottom: 100px;

  background: #1168df;
  border-radius: 6px;
  padding: 0 30px;
  width: fit-content;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 6px 10px 0 #00000025, 0 16px 24px 0 #0000002f;
  text-align: center;
  overflow: hidden;
  z-index: 7;
  color: white;
`;

const EditProfilePage: React.FC<PluginPageContext> = ({ defaultAccount, BurnerComponents, plugin }) => {
  const _plugin = plugin as ThreeBoxEditProfilePlugin;
  const { Page } = BurnerComponents;
  const [box, setBox] = useState();
  const [space, setSpace] = useState();
  const [profile, setProfile] = useState();
  const [myAddress, setAddress] = useState();
  const [showClaimedXP, setShowClaimedXP] = useState(false);

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

  const onSaveComplete = async (currentUserAddr) => {
    const profile = await Box.getProfile(currentUserAddr);
    const hasClaimedXP = await space.public.get('hasClaimedXP');

    console.log('profile', profile);
    console.log('hasClaimedXP', hasClaimedXP);

    if (profile && (profile.name || profile.image) && !hasClaimedXP) {
      console.log('congrats youve won XP');
      // claim XP

      // await space.public.set('hasClaimedXP', true); // set flag 

      setShowClaimedXP(true);
      setTimeout(() => {
        setShowClaimedXP(false);
      }, 4000);
    }
  }

  return (
    <Page title="Edit profile">
      {showClaimedXP && (
        <ClaimedXPConfirmation>
          <p>
            🎉 You were awarded XP for filling out your profile 🎉
          </p>
        </ClaimedXPConfirmation>
      )}

      {box ? (
        <EditProfile
          box={box}
          space={space}
          currentUserAddr={myAddress}
          currentUser3BoxProfile={profile}
          onSaveComplete={onSaveComplete}
          customFields={customFields}
        />
      ) : <p>Loading</p>}
    </Page>
  );
};

export default EditProfilePage;
