import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MainRouterConfig as Config } from "./config";

import LoginPage from "../pages/login/LoginPage";
import GamePage from "../pages/game/GamePage";
import DicePage from "../pages/game/dice/DicePage";
import LookupPage from "../pages/game/lookup/LookupPage";
import NotFoundPage from "../pages/NotFoundPage";

import GameLayout from "../layout/GameLayout";


// used to map configuration to components
const components = { LoginPage, GamePage, DicePage, LookupPage, NotFoundPage };

const layouts = { GameLayout };

class MainRouter extends Component {

    renderRoutes() {
        let result = [];

        Object.keys(Config.routes).forEach((key) => {
            let route = Config.routes[key],
                Page = components[route.component],
                Layout = route.layout ? layouts[route.layout] : null;

            if (route.children) {
                Object.keys(route.children).forEach((childKey) => {
                    let childRoute = route.children[childKey],
                        ChildPage = components[childRoute.component];

                    result.push(this.renderRoute(childKey, childRoute.path, true, ChildPage, Layout));                   
                });
            }

            result.push(this.renderRoute(key, route.path, true, Page, Layout));
        })
        console.log(result)
        return result;
    }

    renderRoute(key, path, exact, Page, Layout = null) {
        return (
            <Route key={key} path={path} exact={exact} render={({match, history}) => {
                let page = <Page history={history} match={match} />;
                return Layout ? <Layout history={history} match={match}>{page}</Layout> : page;
            }} />
        );
    }

    render() {
        return (
            <Router>
                <Switch>
                    {this.renderRoutes()}
                </Switch>
            </Router>
        );
    }
}

export default MainRouter;