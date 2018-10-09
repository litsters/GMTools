import React from 'react';

export interface IRegister
{
  changeMode: (mode: any) => void
}

export class Register extends React.Component<IRegister, {}> {

  txtbFname: any;
  txtbLname: any;
  txtbEmail: any;
  txtbPwd1: any;
  txtbPwd2: any;

    constructor(props: any) {
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
        const { changeMode }: any = this.props;

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