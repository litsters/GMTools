import React, { Component } from "react";
import { Link } from "react-router-dom";
import { MainRouterConfig as Config } from "../routers/config";

export interface IPage
{
  match: any
}

class GameMenu extends Component<IPage, {}> {
    render() {
        const match = this.props.match;
        const routes = Config.routes.game.children
        return (
            <div className="menu-game">
                <h2>menu</h2>
                <ul>
                {Object.keys(routes).map((key) => {
                    let route = routes[key],
                        isActive = match.path === route.path;
                    if (!route.showInMenu) return null;
                    return (
                        <li className={"menu-item" +(isActive ? " active" : "")} key={key}>
                            <Link to={route.path}>
                                <span>{route.text}</span>
                            </Link>
                        </li>
                    );
                })}
                </ul>
            </div>
        );
    }
}

export default GameMenu;