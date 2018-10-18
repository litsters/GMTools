import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { withRouter, RouteComponentProps } from 'react-router';

import MainRouter from './react/routers/main-router';
import Header from './react/layout/header';
import Body from './react/layout/body';
import { updateUser, apiRequest } from './react/actions/user-actions';
import { updateCodex, apiGetCodex } from './react/actions/codex-actions';

interface Props {

}

class App extends Component<Props & RouteComponentProps<any>> {
  componentDidMount() {
    apiGetCodex();
  }
  render() {
    return (
      <main className="app">
        <Header></Header>
        <Body>
          <MainRouter/>
        </Body>
      </main>
    );
  }
}

const userSelector = createSelector(
  (state: any) => state.user,
  user => user
)

const codexSelector = createSelector(
  (state: any) => state.codex,
  codex => codex
)

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
  onUpdateCodex: updateCodex,
  onGetCodex: apiGetCodex
}

export default withRouter(connect(mapStateToProps, mapActionsToProps)(App));
