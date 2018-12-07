import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { withRouter, RouteComponentProps } from 'react-router';

import MainRouter from './react/routers/main-router';
import Header from './react/layout/header';
import Body from './react/layout/body';
import Alerts from './react/common/Alerts';
import { updateUser, apiRequest, updateAuth } from './react/actions/user-actions';
import { updateCodex } from './react/actions/codex-actions';

interface Props {

}

class App extends Component<Props & RouteComponentProps<any>> {
  render() {
    return (
      <main className="app">
        <Header></Header>
        <Body>
          <MainRouter/>
          <Alerts />
        </Body>
      </main>
    );
  }
}

const userSelector = createSelector(
  (state: any) => state.user,
  user => user
);

const codexSelector = createSelector(
  (state: any) => state.codex,
  codex => codex
);

const mapStateToProps = createSelector(
  userSelector,
  codexSelector,
  (user, codex) => ({
    user, codex
  })
);

const mapActionsToProps = {
  onUpdateUser: updateUser,
  onApiRequest: apiRequest,
  onUpdateAuth: updateAuth,
  onUpdateCodex: updateCodex,
};

export default withRouter(connect(mapStateToProps, mapActionsToProps)(App));
