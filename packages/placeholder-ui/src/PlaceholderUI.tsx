import React from 'react';
import BurnerUICore, { Page } from '@burner-wallet/ui-core';
import { Route } from 'react-router-dom';

import { burnerComponents } from 'denver-ui';
import Header from './components/Header';
import Template from './Template';

import HomePage from './pages/HomePage';
import AdvancedPage from './pages/AdvancedPage';
import PKPage from './pages/PKPage';


export default class DenverUI extends BurnerUICore {
  getPages(): Page[] {
    return [
      { path: '/', component: HomePage },
      // { path: '/activity', component: ActivityPage },
      { path: '/pk', component: PKPage },
      // { path: '/receive', component: ReceivePage },
      // { path: '/send', component: SendPage },
      // { path: '/confirm', component: ConfirmPage },
      // { path: '/receipt/:asset/:txHash', component: ReceiptPage },
      // { path: '/account', component: ProfilePage },
      { path: '/settings', component: AdvancedPage },
    ];
  }

  burnerComponents() {
    return burnerComponents;
  }

  content() {
    return (
      <Template theme={this.props.theme}>
        {/*<Scanner />*/}
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
