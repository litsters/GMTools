import React, { Component } from "react";
import { Link } from "react-router-dom";
import { MainRouterConfig as Config } from "../routers/config";

class Menu extends Component {
    render() {
        const routes = Config.routes.game.children
        return (
            <div className="menu-game">
                <h2>menu</h2>
                <ul>
                {Object.keys(routes).map((key) => {
                    let route = routes[key];
                    if (!route.showInMenu) return null;
                    return (
                        <li key={key}>
                            <Link to={route.path}>
                                <span>{route.text}</span>
                            </Link>
                        </li>
                    )
                })}
                </ul>
            </div>
        );
    }
}

export default Menu;