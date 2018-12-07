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

    renderTool(mode:DiceToolMode) {
        switch(mode) {
            case DiceToolMode.Basic: 
                return null;
            case DiceToolMode.Advanced:
                return <AdvancedDiceTool addHistory={this.addHistory}/>;
            default:
                return null;
        }
    }

    render() {
        const { mode, history }: any = this.state;
        const tool = this.renderTool(mode);

        return (
            <div className="dice-page padding-15">
                <h1>Dice Page</h1>
                {tool}

                {history.length > 0 ?
                    <div>
                        <h2>history</h2>
                        <ul>
                            {history.map((data:any, i:number) => {
                                return <li key={i}><strong>{data.value}</strong> {data.details}</li>
                            })}
                        </ul>
                    </div>
                : null}
            </div>
        );
    }
}

export default DicePage;