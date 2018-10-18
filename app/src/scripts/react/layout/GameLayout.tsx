import React, { SFC } from "react";
import GameMenu from "./GameMenu";

interface GameLayoutProps {
    children: any,
    history: any,
    match: any
}

const GameLayout: SFC<GameLayoutProps> = (props) => {
    return (
        <div className="layout-game">
            <GameMenu match={props.match}/>
            <div className="layout-body">
                {props.children}
            </div>
        </div>
    );
};

export default GameLayout;