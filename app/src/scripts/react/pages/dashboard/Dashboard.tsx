import React, { Component } from "react";
import Auth from "../../auth/Auth";

interface DashboardProps {
    auth: Auth;
}

class Dashboard extends Component<DashboardProps, {}> {
    private auth:Auth;

    constructor(props: any) {
        super(props);
        this.auth = new Auth();
    }

    render() {
        return (
            <div className="page-content">
                <h1>Congrats! You reached the dashboard!</h1>
                <button onClick={()=> this.logout()}>Click me to log out</button>
            </div>
        )
    }

    logout() {
        console.log("you are logging out");
        this.auth.logout();
    }
}

export default Dashboard;