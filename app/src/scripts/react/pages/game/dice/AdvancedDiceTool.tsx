import React, { Component } from "react";
import { GenerateDice, RollDiceGroups, RollDiceResult, ValidateDefinition } from './dice';

const validKeys = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "d", "Backspace", ",", "+", "-", "/", "*"];

interface DiceToolState {
  history: any[],
  value: string,
  isValid?: boolean,
  result?: RollDiceResult
}

class AdvancedDiceTool extends Component<any, DiceToolState> {

    eventListener: EventListener = null;

    constructor(props: any) {
        super(props);

        this.state = {
            history: [],
            value: "",
            isValid: null,
            result: null
        };

        this.append = this.append.bind(this);
        this.backspace = this.backspace.bind(this);
        this.submit = this.submit.bind(this);
        this.clear = this.clear.bind(this);
    }

    clear()
    {
      this.setState({value: "", isValid: null, result: null})
    }

    componentDidMount() {
        this.eventListener = (event: KeyboardEvent) => {
          let key = event.key;

          if (validKeys.indexOf(key) === -1) return;
          else if (key === "Backspace") this.backspace();
          else this.append(key);
        };

        document.addEventListener("keyup", this.eventListener);
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.eventListener);
    }

    append(val: string) {
        const newVal = this.state.value + val;
        const isValid = ValidateDefinition(this.state.value + val);
        this.setState({value: newVal, isValid});
    }

    backspace() {
        const value = this.state.value;
        const newVal = value.substr(0, value.length - 1);
        const isValid = ValidateDefinition(newVal);

        if (value.length === 0) return;
        this.setState({value: newVal, isValid});
    }

    submit() {
        const { value, isValid } = this.state;
        if (!isValid) return;
        let dice = GenerateDice(value),
            result = RollDiceGroups(dice);
        
        this.setState({...this.state, result});
        this.props.addHistory(result);
    }

    render() {
        const { value, isValid, result } = this.state;
        const isValidClass = isValid ? "valid" : (isValid === null ? "" : "invalid");

        return (
            <div className="dice-roller advanced">
                <div className={`display ${isValidClass}`}>
                    <input type="text" readOnly value={value} />
                    <div className="result">
                        <span className="result-value">{result ? result.value : null}</span>
                        <span className="result-details">{result ? result.details : null}</span>
                    </div>
                </div>
                <div className="buttons">
                    <div className="btn d" onClick={this.append.bind(null, "d2")}>d2</div>
                    <div className="btn d" onClick={this.append.bind(null, "d4")}>d4</div>
                    <div className="btn d" onClick={this.append.bind(null, "d6")}>d6</div>
                    <div className="btn o" onClick={this.clear}>C</div>
                    <div className="btn d" onClick={this.append.bind(null, "d8")}>d8</div>
                    <div className="btn d" onClick={this.append.bind(null, "d10")}>d10</div>
                    <div className="btn d" onClick={this.append.bind(null, "d12")}>d12</div>
                    <div className="btn o" onClick={this.backspace}>{"<-"}</div>
                    <div className="btn d" onClick={this.append.bind(null, "d20")}>d20</div>
                    <div className="btn d" onClick={this.append.bind(null, "d100")}>d100</div>
                    <div className="btn d" onClick={this.append.bind(null, "d")}>dx</div>
                    <div className="btn o" onClick={this.append.bind(null, "/")}>/</div>
                    <div className="btn" onClick={this.append.bind(null, "7")}>7</div>
                    <div className="btn" onClick={this.append.bind(null, "8")}>8</div>
                    <div className="btn" onClick={this.append.bind(null, "9")}>9</div>
                    <div className="btn o" onClick={this.append.bind(null, "*")}>*</div>
                    <div className="btn" onClick={this.append.bind(null, "4")}>4</div>
                    <div className="btn" onClick={this.append.bind(null, "5")}>5</div>
                    <div className="btn" onClick={this.append.bind(null, "6")}>6</div>
                    <div className="btn o" onClick={this.append.bind(null, "-")}>-</div>
                    <div className="btn" onClick={this.append.bind(null, "1")}>1</div>
                    <div className="btn" onClick={this.append.bind(null, "2")}>2</div>
                    <div className="btn" onClick={this.append.bind(null, "3")}>3</div>
                    <div className="btn o" onClick={this.append.bind(null, "+")}>+</div>
                    <div className="btn" onClick={this.append.bind(null, "0")}>0</div>
                    <div className="btn" onClick={this.append.bind(null, "(")}>(</div>
                    <div className="btn" onClick={this.append.bind(null, ")")}>)</div>
                    <div className={"btn" + (!isValid ? " disabled" : "")} onClick={this.submit}>Roll</div>

                </div>
            </div>
        )
    }
}

export default AdvancedDiceTool;