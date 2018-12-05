import React, { Component } from "react";

class HomeSection extends Component {
    render() {
        return (
            <div className="content-page home" id="home">
                <h1>Home</h1>
                <br/>
                <div className="well">
                    <h3>Welcome to GM Tools!</h3>
                    <p>
                        GM Tools is an application used to augment and improve your RPGs. You can view and manage you characters and campaigns, and 
                        Game Master have access to many tools to enhance gameplay.
                    </p>
                </div>
            </div>
        )
    }
}

export default HomeSection;