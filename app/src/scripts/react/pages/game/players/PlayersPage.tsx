import React, { Component } from "react";
import IPage from "../../../interfaces/IPage";

export enum DiceToolMode {
    Basic,
    Advanced
};

interface MainState {
    players:any
}

class PlayersPage extends Component<IPage, MainState> {
    render() {

        return (
            <div className="padding-15">
                <h1>Players Page</h1>
                
            </div>
        );
    }
}

export default PlayersPage;