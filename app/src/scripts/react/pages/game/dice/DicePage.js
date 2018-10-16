import React, { Component } from "react";
import Dice from "./dice";
import AdvancedDiceTool from "./AdvancedDiceTool";

class DicePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentRoll: null,
            mode: "basic",
            dice: {
                6: new Dice(6),
                20: new Dice(20)
            },
            history: []
        }

        this.rollDice = this.rollDice.bind(this);
        this.addHistory = this.addHistory.bind(this);
    }

    rollDice(dice) {
        if (!dice) return;
        let result = dice.roll();
        this.setState({currentRoll: result});
    }

    addHistory(val) {
        let history = this.state.history;
        history.unshift(val);
        this.setState(history);
    }

    render() {
        const { currentRoll, dice, history } = this.state;
        return (
            <div>
                <h1>Dice Page</h1>
                <h3>Result: {currentRoll}</h3>
                {Object.keys(dice).map((key) => {
                    return (
                        <button key={key} type="button" onClick={this.rollDice.bind(null, dice[key])}>
                            <span>Roll {key}-sided dice</span>
                        </button>
                    )
                })}
                <AdvancedDiceTool addHistory={this.addHistory}/>
                <ul>
                    {history.map((data, i) => {
                        return <li>{data.value}</li>
                    })}
                </ul>
            </div>
        );
    }
}

export default DicePage;