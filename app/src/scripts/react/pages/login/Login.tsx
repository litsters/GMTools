import React, { Component } from "react";

export interface ILogin
{
  changeMode: (mode: any) => void
}

export class Login extends React.Component<ILogin, {}>{

  txtbPassword: any;
  txtbUsername: any;

    constructor(props: any) {
        super(props);

        this.isFormComplete = this.isFormComplete.bind(this);
        this.submit = this.submit.bind(this);
    }

    isFormComplete() {
        if (!this.txtbPassword || !this.txtbUsername) return false;
        if (this.txtbUsername.value.trim() === "") return false;
        if (this.txtbPassword.value.trim() === "") return false;
        return true;
    }

    submit() {

    }

    render() {
        const { changeMode }: any = this.props;
        return (
            <div>
                <h2>Login</h2>
                <input type="text" ref={el => this.txtbUsername = el}/>
                <input type="password" ref={el => this.txtbPassword = el}/>
                <button type="button" disabled={!this.isFormComplete()} onClick={this.submit}>Sign In</button>
                <a onClick={changeMode.bind(null, "register")}>I don't have an account</a>
            </div>
        );
    }
}