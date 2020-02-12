import React from 'react';
import { useBurner, DataProviders } from '@burner-wallet/ui-core';
import QRCode from 'qrcode.react';
import styled from 'styled-components';
import Clipboard from '../../components/Clipboard';

import Button from '../../components/Button';
import Page from '../../components/Page';

const { PluginElements, AddressName } = DataProviders;

const QRContainer = styled.div`
  width: 80%;
  margin: auto;
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;

  & svg {
    flex: 1;
    width: initial;
    height: initial;
  }
`;

const AddressInputContainer = styled.div`
  display: flex;
  background-color: white;
  border: 1px;
  border-color: grey;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
  margin: 8px 0;
  align-items: center;
`;

const CopyButton = styled(Button)`
  height: 38px;
  margin: 4px;
`;

const StyledInput = styled.input`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 16px 0 16px 16px;
  font-family: sans-serif;
  font-size: 1rem;
  min-width: 0;
  background: transparent;
  border: none;
  flex: 1;
`;

const UDButton = styled(Button)`
  background-image: url('https://avatars2.githubusercontent.com/u/36172275?s=200&v=4');
  background-repeat: no-repeat;
  background-size: contain;
  background-color: #9a92e3;
  flex-direction: column;
  font-size: 18px;
`;

const ProfilePage: React.FC = () => {
  const { defaultAccount, actions } = useBurner();
  return (
    <Page title="Account">
      <PluginElements position='home-top' />

      <UDButton onClick={() => actions.navigateTo('/dot-crypto')}>
        <AddressName address={defaultAccount} render={(name: any) => (
          name
        )} />
        <div style={{ color: '#eeeeee', fontSize: 14 }}>View and transfer your .crypto domains</div>
      </UDButton>

      <QRContainer>
        <QRCode value={defaultAccount} renderAs="svg"/>
      </QRContainer>

      <AddressInputContainer>
        <StyledInput
          readOnly
          value={defaultAccount}
          onClick={(e: React.MouseEvent) => (e.target as HTMLInputElement).setSelectionRange(0, 42)}
        />
        <Clipboard text={defaultAccount}>
          {isCopied => (
            <CopyButton disabled={isCopied}>Copy</CopyButton>
          )}
        </Clipboard>
      </AddressInputContainer>

      <PluginElements position='home-middle' />

      <Button onClick={() => actions.navigateTo('/settings')}>Settings</Button>
    </Page>
  )
}

export default ProfilePage;