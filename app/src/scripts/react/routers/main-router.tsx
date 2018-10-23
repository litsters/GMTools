import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MainRouterConfig as Config } from "./config";

import LoginPage from "../pages/login/LoginPage";
import GamePage from "../pages/game/GamePage";
import DicePage from "../pages/game/dice/DicePage";
import GeneratorPage from "../pages/game/generator/GeneratorPage";
import InitiativePage from "../pages/game/initiative/InitiativePage";
import LookupPage from "../pages/game/lookup/LookupPage";
import NotFoundPage from "../pages/NotFoundPage";
import Dashboard from "../pages/dashboard/Dashboard";

import GameLayout from "../layout/GameLayout";


// used to map configuration to components
const components = { 
  LoginPage, GamePage, DicePage, GeneratorPage, InitiativePage, LookupPage, NotFoundPage, Dashboard 
};

const layouts = { GameLayout };

class MainRouter extends Component {

  renderRoutes() {
    let result: any = [];

    Object.keys(Config.routes).forEach((key) => {
      let route = Config.routes[key],
        Page = components[route.component],
        Layout = route.layout ? layouts[route.layout] : null,
        path = route.dynamic ? route.dynamic : route.path;

      if (route.children) {
        Object.keys(route.children).forEach((childKey) => {
          let childRoute = route.children[childKey],
            ChildPage = components[childRoute.component],
            childPath = childRoute.dynamic ? childRoute.dynamic : childRoute.path;

          result.push(this.renderRoute(childKey, childPath, (childRoute.exact || childRoute.exact === undefined ? true : false), ChildPage, Layout));
        });
      }

      result.push(this.renderRoute(key, path, (route.exact || route.exact === undefined ? true : false), Page, Layout));
    })

    return result;
  }

  renderRoute(key: string, path: string, exact: boolean, Page: any, Layout: any = null) {
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