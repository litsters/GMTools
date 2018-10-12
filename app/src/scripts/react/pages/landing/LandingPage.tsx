import React, { Component } from "react";
import Auth from "../../auth/Auth";

interface LandingProps {
    auth: Auth;
}

class LandingPage extends Component<LandingProps, {}> {
    constructor(props: any) {
        super(props);
    }

    login(){
        console.log("You clicked log in!");
        this.props.auth.login();
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