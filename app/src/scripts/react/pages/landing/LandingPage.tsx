import React, { Component } from "react";
import Auth from "../../auth/Auth";
import { updateAuth } from "../../actions/user-actions";

interface LandingProps {
    auth: Auth,
    history: History
}

class LandingPage extends Component<LandingProps, {}> {
    private auth:Auth;

    constructor(props: any) {
        super(props);
        this.auth = new Auth(props.history);
    }

    login(){
        console.log("You clicked log in!");
        this.auth.login();
        updateAuth(this.auth);
    }

    render() {
        return (
            <div className="page-content">
                <h1>Welcome to GM Tools!</h1>
                <button onClick={() => this.login()}>Click me to log in!</button>
            </div>
        )
    }
}

export default LandingPage;