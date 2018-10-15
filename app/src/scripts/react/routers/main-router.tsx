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

    handleAuthentication = (props: any) => {
        if(/access_token|id_token|error/.test(props.history.location.hash)){
            // This prevents people from accessing unauthorized info; it's not working yet
            // this.auth.handleAuthentication();
        }
    }

    render() {
        return (
            <Switch>

                <Route path="/login" render={({match}) => {
                    return <LoginPage />
                }} />

                <Route path="/dashboard" render={(props) => {
                    this.handleAuthentication(props);
                    return <Dashboard auth={this.auth}/>
                }} />

                <Route path="/landing" render={({match}) => {
                    return <LandingPage auth={this.auth} />
                }} />

                <Route exact path="" render={({match}) => {
                    return <LandingPage auth={this.auth} />
                }} />

            </Switch>
        );
    }
}

export default MainRouter;