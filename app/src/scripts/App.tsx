import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import MainRouter from './react/routers/main-router';
import Header from './react/layout/header';
import Body from './react/layout/body';
import { updateUser, apiRequest } from './react/actions/user-actions';


class App extends Component {
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

const mapStateToProps = createSelector(
  userSelector,
  (user) => ({
    user
  })
);

const mapActionsToProps = {
  onUpdateUser: updateUser,
  onApiRequest: apiRequest
}

export default connect(mapStateToProps, mapActionsToProps)(App);
