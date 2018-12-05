import React, { Component } from "react";
import IPage from "../../../interfaces/IPage";

interface Initiative {
    key: number,
    initiative: number
    name: string
    character?: string
}

interface InitiativePageState {
    initiative: Initiative[]
    addName: string
    addInitiative: string
}

class InitiativePage extends Component<IPage, InitiativePageState> {
    private keyCounter: number;

    constructor(props: any) {
        super(props);

        this.state = {
            initiative: [
                {
                    key: 0,
                    initiative: 1,
                    name: 'Bob',
                    character: '',
                },
                {
                    key: 1,
                    initiative: 16,
                    name: 'Dragon',
                },
                {
                    key: 2,
                    initiative: 22,
                    name: 'Jester',
                    character: '',
                },
            ],
            addName: '',
            addInitiative: '',
        };

        this.next = this.next.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateInitiative = this.updateInitiative.bind(this);

        this.keyCounter = this.state.initiative.length;
    }

    next() {
        let initiative = this.state.initiative.slice();
        initiative.push(initiative.shift());
        this.setState({
            initiative: initiative,
        });
    }

    updateInputState(key: string, event: any, isInt=false) {
        const newState = {};
        let value = event.target.value;
        if (isInt && value) {
            let num = Number.parseInt(value, 10);
            if (Number.isFinite(num)) {
                value = num;
            } else {
                return;
            }
        }
        newState[key] = value;
        this.setState(newState);
    }

    updateInitiative(index: number, event: any) {
        let initiative = this.state.initiative.slice();
        let value = event.target.value;
        if (value) {
            let num = Number.parseInt(value, 10);
            if (Number.isFinite(num)) {
                value = num;
            } else {
                return;
            }
        }
        initiative[index].initiative = value;
        this.setState({
            initiative: initiative,
        });
    }

    handleSubmit(event: any) {
        event.preventDefault();
        let initiative = this.state.initiative.slice();
        initiative.push({
            key: ++this.keyCounter,
            name: this.state.addName,
            initiative: Number.parseInt(this.state.addInitiative, 10),
        });
        this.setState({
            // Save the new initiative
            initiative: initiative,
            // Clear the form
            addName: '',
            addInitiative: '',
        });
    }

    static swap(arr: any[], i1: number, i2: number) {
        let swap = arr[i2];
        arr[i2] = arr[i1];
        arr[i1] = swap;
    }

    moveDown(index: number) {
        if (index < this.state.initiative.length - 1) {
            let initiative = this.state.initiative.slice();
            InitiativePage.swap(initiative, index, index + 1);
            this.setState({
                initiative: initiative,
            });
        }
    }

    moveUp(index: number) {
        if (index > 0) {
            let initiative = this.state.initiative.slice();
            InitiativePage.swap(initiative, index, index - 1);
            this.setState({
                initiative: initiative,
            });
        }
    }

    remove(index: number) {
        let initiative = this.state.initiative.slice();
        initiative.splice(index, 1);
        this.setState({
            initiative: initiative,
        });
    }

    render() {
        return (
            <div>
                <h1>Initiative</h1>
                <ol className="initiativeList">
                    {this.state.initiative.map((a, i) => {
                        return (
                            <li key={a.key}>
                                <span>{a.name}</span>
                                <input type="text" value={a.initiative} onChange={(event) => this.updateInitiative(i, event)}/>
                                <button type="button" onClick={() => this.remove(i)}>-</button>
                                {i > 0 && <button type="button" onClick={() => this.moveUp(i)}>^</button> }
                                {i < this.state.initiative.length - 1 && <button type="button" onClick={() => this.moveDown(i)}>v</button> }
                            </li>
                        );
                    })}
                </ol>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Name" value={this.state.addName} onChange={(event) => this.updateInputState('addName', event)}/>
                    <input type="text" value={this.state.addInitiative} onChange={(event) => this.updateInputState('addInitiative', event, true)}/>
                    <button type="submit" title="Add to initiative">+</button>
                </form>
                <button type="button" onClick={this.next}>Next</button>
            </div>
        );
    }
}

export default InitiativePage;