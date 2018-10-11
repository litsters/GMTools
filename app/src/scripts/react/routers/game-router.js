import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import { GameConfig as Config } from "./config";

import DicePage from "../pages/game/DicePage";

// used to map configuration to components
const components = { DicePage };

class GameRouter extends Component {
    render() {
        const { history } = this.props;

        return (
            <Switch>
                {Object.keys(Config.routes).map((key) => {
                    let route = Config.routes[key],
                        Page = components[route.component];

                    return (
                        <Route key={key} path={route.path} render={({match}) => {
                            return <Page history={history} match={match} />
                        }} />
                    );
                })}
            </Switch>
        );
    }
}

export default GameRouter;