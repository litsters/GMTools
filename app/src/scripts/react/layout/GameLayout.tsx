import React, {Component} from "react";
import GameMenu from "./GameMenu";
import EventBus from "../common/Events";
import Alerts from "../common/Alerts";

interface GameLayoutProps {
    children: any,
    history: any,
    match: any
}

let eventsBound = false;

class GameLayout extends Component<GameLayoutProps, {}> {

    constructor(props: any) {
        super(props);

        // Bind events
        EventBus.get()
            .then((bus) => {
                // Make sure we only bind events once
                if (!eventsBound) {
                    bus.on("initiative.alert", GameLayout.initiativeAlert);
                    bus.on("initiative.start", GameLayout.initiativeStart);
                    eventsBound = true;
                }
            });
    }

    static initiativeAlert(event: any) {
        Alerts.addWarning(event.data.name + "'s turn is coming up next.", "On Deck:");
    }

    static initiativeStart(event: any) {
        Alerts.addWarning("It is time for " + event.data.name + " to take action.", "Your Turn:");
    }

    render() {
        return (
            <div className="layout-game">
                <GameMenu match={this.props.match}/>
                <div className="layout-body">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default GameLayout;