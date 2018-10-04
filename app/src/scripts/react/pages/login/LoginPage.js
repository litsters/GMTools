import React, { Component } from "react";
import Login from "./Login";
import Register from "./Register";

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "login"
        };

        this.renderBody = this.renderBody.bind(this);
        this.changeMode = this.changeMode.bind(this);
    }

    changeMode(mode) {
        this.setState({mode});
    }

    renderBody(mode) {
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
        const { mode } = this.state;

        return (
            <div className="page-content">
                {this.renderBody(mode)}
            </div>
        )
    }
}

export default LoginPage;