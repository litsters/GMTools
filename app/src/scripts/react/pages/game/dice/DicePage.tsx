import React, { Component } from "react";
import IPage from "../../../interfaces/IPage";
import AdvancedDiceTool from "./AdvancedDiceTool";

export enum DiceToolMode {
    Basic,
    Advanced
};

interface MainState {
    mode: DiceToolMode,
    history: Array<any>
}

class DicePage extends Component<IPage, MainState> {

    constructor(props: any) {
        super(props);

        this.state = {
            mode: DiceToolMode.Advanced,
            history: []
        }

        this.addHistory = this.addHistory.bind(this);
    }

    addHistory(val: any) {
        let history = this.state.history;
        history.unshift(val);
        this.setState({history});
    }

    render() {
        const { history }: any = this.state;
        return (
            <div>
                <h1>Dice Page</h1>
                <AdvancedDiceTool addHistory={this.addHistory}/>
                <ul>
                    {history.map((data:any, i:number) => {
                        return <li>{data.value}</li>
                    })}
                </ul>
            </div>
        );
    }
}

export default DicePage;