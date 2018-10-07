import React, { Component } from "react";
import {Login} from "./Login";
import {Register} from "./Register";

class LoginPage extends Component {
    constructor(props: any) {
        super(props);
        this.state = {
            mode: "login"
        };

        this.renderBody = this.renderBody.bind(this);
        this.changeMode = this.changeMode.bind(this);
    }

    changeMode(mode: any) {
        this.setState({mode});
    }

    renderBody(mode: any) {
        switch(mode) {
            case "login":
                return <Login changeMode={this.changeMode} />;
            case "register":
                return <Register changeMode={this.changeMode} />;
            default:
                return null;
        }
    }

    render() {
        const { mode }: any = this.state;

        return (
            <div className="page-content">
                {this.renderBody(mode)}
            </div>
        )
    }
}

export default LoginPage;