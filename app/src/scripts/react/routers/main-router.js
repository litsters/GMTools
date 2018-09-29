import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";


class MainRouter extends Component {
    render() {
        const { history } = this.props;

        return (
            <Switch>

                <Route path="" render={({match}) => {
                    return <div history={history}>main path</div>
                }} />

            </Switch>
        );
    }
}

export default MainRouter;