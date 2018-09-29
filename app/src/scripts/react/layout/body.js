import React, { Component } from 'react';

class Body extends Component {
    render() {
        const { children } = this.props;
        
        return (
            <div>
                {children}
            </div>
        );
    }
}

export default Body