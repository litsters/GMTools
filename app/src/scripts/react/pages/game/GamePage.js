import React, { Component } from "react";
import GameRouter from "../../routers/game-router";

class GamePage extends Component {
    render() {
        return (
            <div className="page-content">
                <h1>Game Page</h1>
                <GameRouter/>
            </div>
        )
    }
}

export default GamePage;