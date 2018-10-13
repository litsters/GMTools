import React from "react";
import Menu from "./GameMenu";

const GameLayout = ({children}) => {
    return (
        <div className="layout">
            <Menu/>
            <div>
                {children}
            </div>
        </div>
    )
};

export default GameLayout;