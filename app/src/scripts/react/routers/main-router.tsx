import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";


class MainRouter extends Component {
    render() {
        const { history }: any = this.props;

        return (
            <Switch>

                <Route path="/login" render={({match}) => {
                    return <LoginPage />
                }} />

                <Route path="" render={({match}) => {
                    return <div data-history={history}>main path</div>
                }} />

            </Switch>
        );
    }
}

export default MainRouter;