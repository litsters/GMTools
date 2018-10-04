import React, { Component } from "react";

class Register extends Component {
    constructor(props) {
        super(props);

        this.isFormComplete = this.isFormComplete.bind(this);
        this.submit = this.submit.bind(this);
    }
    
    isFormComplete() {
        return true;
    }

    submit() {

    }

    render() {
        const { changeMode } = this.props;

        return (
            <div>
                <h2>Register</h2>
                <input type="text" ref={el => this.txtbFname} />
                <input type="text" ref={el => this.txtbLname} />
                <input type="text" ref={el => this.txtbEmail} />
                <input type="password" ref={el => this.txtbPwd1} />
                <input type="password" ref={el => this.txtbPwd2} />
                <button type="button" onClick={this.submit}>Submit</button>
                <a onClick={changeMode.bind(null, "login")}>Back to login</a>
            </div>
        );
    }
}

export default Register;