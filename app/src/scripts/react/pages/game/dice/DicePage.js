import React, { Component } from "react";
import BasicDiceTool from "./BasicDiceTool";
import AdvancedDiceTool from "./AdvancedDiceTool";

class DicePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "advanced",
            history: []
        }

        this.addHistory = this.addHistory.bind(this);
        this.clearHistory = () => this.selfState({history: []});
        this.renderTool = this.renderTool.bind(this);
    }

    addHistory(val) {
        let history = this.state.history;
        history.unshift(val);
        this.setState(history);
    }

    renderTool(mode) {
        switch(mode) {
            case "basic":
                return <BasicDiceTool addHistory={this.addHistory}/>;
            case "advanced":
                return <AdvancedDiceTool addHistory={this.addHistory}/>;
            default:
                return null;
        }
    }

    render() {
        const { history, mode } = this.state;
        const tool = this.renderTool(mode);
        return (
            <div>
                <h1>Dice Page</h1>
                {tool}
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