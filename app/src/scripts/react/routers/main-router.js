import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import { MainConfig as Config } from "./config";

import LoginPage from "../pages/login/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";


// used to map configuration to components
const components = { LoginPage, NotFoundPage };

class MainRouter extends Component {
    render() {
        const { history } = this.props;

        return (
            <Switch>
                {Object.keys(Config.routes).map((key) => {
                    let route = Config.routes[key],
                        Page = components[route.component];

                    return (
                        <Route key={key} path={route.path} render={({match}) => {
                            console.log(route);
                            return <Page history={history} match={match} />
                            
                        }} />
                    );
                })}
            </Switch>
        );
    }
}

export default MainRouter;