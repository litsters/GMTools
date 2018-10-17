import React, { Component } from 'react';

class Body extends Component {
    render() {
        const { children } = this.props;
        
        return (
            <div className="app-body">
                {children}
            </div>
        );
    }
}

export default Body