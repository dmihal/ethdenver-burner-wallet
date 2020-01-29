import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useBurner } from '@burner-wallet/ui-core';
import { PluginButtonProps } from '@burner-wallet/types';

interface AppButtonProps extends PluginButtonProps {
  description?: string;
  logo?: string;
}

const AppButton: React.FC<AppButtonProps> = ({ title, description, logo, to, children }) => (
  <Link to={to}>
    <div>
      <div>{title}</div>
      {description && (
        <div>{description}</div>
      )}
    </div>

    {children}
  </Link>
);

const Menu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  left: 0;
  top: 200px;
  bottom: 50px;
  width: 200px;
  background: linear-gradient(180deg, #838282, #352539);
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border: solid 3px black;
  border-left: none;
  box-shadow: 2px 3px 10px 0px rgba(0, 0, 0, .5);
  transition: transform 1s;
  z-index: 150;

  transform: translate3d(${({ isOpen }) => isOpen ? 0 : -250}px, 0, 0);
`;

interface SideMenuProps {
  isOpen: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen }) => {
  const { BurnerComponents, defaultAccount, t } = useBurner();
  const { PluginElements, PluginButtons } = BurnerComponents;
  return (
    <Menu isOpen={isOpen}>
      <PluginElements position='home-top' />

      <PluginElements position='home-middle' />

      <Link to='/activity'>{t('View all')}</Link>

      {/*<HistoryList account={defaultAccount} limit={3} navigateTo={actions.navigateTo} />*/}

      <PluginButtons position="apps" component={AppButton} />>

      <AppButton title={t('Settings')} to="/advanced" />
    </Menu>
  )
}

export default SideMenu;