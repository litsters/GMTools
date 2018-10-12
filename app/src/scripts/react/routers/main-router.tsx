import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import LandingPage from "../pages/landing/LandingPage";
import Dashboard from "../pages/dashboard/Dashboard";
import Auth from "../auth/Auth";

class MainRouter extends Component {
    private auth:Auth;

    constructor(props:any){
        super(props);
        this.auth = new Auth();
    }

    render() {
        return (
            <Switch>

                <Route path="/login" render={({match}) => {
                    return <LoginPage />
                }} />

                <Route path="/dashboard" render={({match}) => {
                    return <Dashboard auth={this.auth}/>
                }} />

                <Route path="/landing" render={({match}) => {
                    return <LandingPage auth={this.auth} />
                }} />

                <Route exact path="/" render={({match}) => {
                    return <LandingPage auth={this.auth} />
                }} />

            </Switch>
        );
    }
}

export default MainRouter;