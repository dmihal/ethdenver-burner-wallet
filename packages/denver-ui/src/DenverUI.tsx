import React from 'react';
import BurnerUICore, { Page } from '@burner-wallet/ui-core';
import { Route } from 'react-router-dom';

import burnerComponents from './components/burner-components';
import Header from './components/Header';
// import Loading from './components/Loading';
import Scanner from './components/Scanner';
import Template from './Template';

import internalPlugins from './internal-plugins';
import ActivityPage from './pages/ActivityPage';
import AdvancedPage from './pages/AdvancedPage';
import ConfirmPage from './pages/ConfirmPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import PKPage from './pages/PKPage';
import ReceiptPage from './pages/ReceiptPage';
import ReceivePage from './pages/ReceivePage';
import SendPage from './pages/SendPage';


export default class DenverUI extends BurnerUICore {
  getPages(): Page[] {
    return [
      { path: '/', component: HomePage },
      { path: '/activity', component: ActivityPage },
      { path: '/pk', component: PKPage },
      { path: '/receive', component: ReceivePage },
      { path: '/send', component: SendPage },
      { path: '/confirm', component: ConfirmPage },
      { path: '/receipt/:asset/:txHash', component: ReceiptPage },
      { path: '/account', component: ProfilePage },
      { path: '/settings', component: AdvancedPage },
    ];
  }

  getInternalPlugins() {
    return internalPlugins;
  }

  burnerComponents() {
    return burnerComponents;
  }

  content() {
    return (
      <Template theme={this.props.theme}>
        <Scanner />
        {/*<Loading />*/}
        <Route path="/" exact>
          {({ match }) => !match && (
            <Header title={this.props.title} />
          )}
        </Route>
        {this.router()}
      </Template>
    );
  }
}
