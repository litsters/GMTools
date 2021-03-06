import React, { Component } from "react";
import { connect } from "react-redux";
import { UserReducer } from "../../reducers";
import Auth from "../../auth/Auth";
import { updateAuth } from "../../actions/user-actions";

interface LandingProps {
    history: History,
    updateAuth: any
}

class LandingPage extends Component<LandingProps, {}> {
    login(){
        console.log("You clicked log in!");

        let auth = new Auth(this.props.history);
        auth.login();

        this.props.updateAuth(auth);
    }

    render() {
        return (
            <div className="page-content landing-page">
                <div className="welcome-wrapper">
                    <div className="content">
                        <h1>Welcome to GM Tools!</h1>
                        <button onClick={() => this.login()}>Get Started</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapActionsToProps = {
    updateAuth
}

export default connect(UserReducer, mapActionsToProps)(LandingPage);