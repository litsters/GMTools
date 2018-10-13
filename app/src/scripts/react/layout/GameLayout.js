import React from "react";
import Menu from "./GameMenu";

const GameLayout = ({children}) => {
    return (
        <div className="layout-game">
            <Menu/>
            <div className="layout-body">
                {children}
            </div>
        </div>
    )
};

export default GameLayout;