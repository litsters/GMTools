import React, { Component } from "react";
import Dice from "./dice";

class DicePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentRoll: null,
            dice: {
                6: new Dice(6),
                20: new Dice(20)
            }
        }

        this.rollDice = this.rollDice.bind(this);
    }

    rollDice(dice) {
        if (!dice) return;
        let result = dice.roll();
        this.setState({currentRoll: result});
    }

    render() {
        const { currentRoll, dice } = this.state;
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
            </div>
        );
    }
}

export default DicePage;