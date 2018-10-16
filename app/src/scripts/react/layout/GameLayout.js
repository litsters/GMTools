import React from "react";
import Menu from "./GameMenu";

const GameLayout = ({children, history, match}) => {
    return (
        <div className="layout-game">
            <Menu match={match}/>
            <div className="layout-body">
                {children}
            </div>
        </div>
    )
};

export default GameLayout;