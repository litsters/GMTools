import React, { Component } from "react";
import IPage from "../../../interfaces/IPage";
import EventBus from "../../../common/Events";
import { each } from "jquery"
import { Campaign, Character } from "../../../interfaces";

interface Initiative {
    key: number,
    initiative: number
    name: string
    character?: string // Optional character id for the initiative item
}

interface InitiativePageState {
    initiative: Initiative[]
    addName: string
    addInitiative: string
    characters: Character[]
    campaigns: Campaign[]
    selectedCampaign?: string
}

class InitiativePage extends Component<IPage, InitiativePageState> {
    private keyCounter: number;
    private charactersList: Character[];
    private events: EventBus;
    private readonly eventListeners: object;

    constructor(props: any) {
        super(props);

        // Declare what events we listen to and what method will handle them
        this.eventListeners = {
            "data.retrieved": this.dataRetrieved.bind(this),
            "data.persisted": this.dataPersisted.bind(this),
        };

        // Bind events
        EventBus.get()
            .then((bus) => {
                this.events = bus;

                each(this.eventListeners, (event, callback) => {
                    this.events.on(event, callback);
                });
            });

        this.state = {
            initiative: [],
            addName: '',
            addInitiative: '',
            characters: [],
            campaigns: [],
        };

        this.sort = this.sort.bind(this);
        this.next = this.next.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateInitiative = this.updateInitiative.bind(this);

        this.keyCounter = this.state.initiative.length;
        this.charactersList = [];
    }

    componentDidMount() {
        EventBus.emit('data.get', {namespace: 'campaign', key: 'get_campaigns'}, true);
        EventBus.emit('data.get', {namespace: 'character', key: 'get_characters'}, true);
    }

    componentWillUnmount() {
        if (this.events !== null) {
            each(this.eventListeners, (event, callback) => {
                this.events.removeListener(event, callback);
            });
        }
    }

    dataRetrieved(event: any) {
        if (event.namespace === "character" && event.key === "get_characters" && event.data) {
            // Character data retrieved save
            this.charactersList = event.data;

        } else if (event.namespace === "campaign" && event.key === "get_campaigns" && event.data) {
            // Campaign data retrieved, save into the state
            this.setState({
                campaigns: event.data,
            });
        }
    }

    dataPersisted(event: any) {
        // TODO campaigns and character state should be centralized into redux so no individual component has to deal with it
        if (event.namespace === "campaign" && event.key === "new_campaign" && event.data) {
            const campaigns = this.state.campaigns.slice();
            campaigns.push(event.data);
            this.setState({
                campaigns: campaigns,
            });
        } else if (event.namespace === "character" && event.data) {
            if (event.key === "new_character") {
                // New character added, save
                this.charactersList.push(event.data);

            } else if (event.key === "character_updated") {
                // Character updated, update that character
                this.charactersList = this.charactersList.map((character: Character) => {
                    if (character._id === event.data._id) {
                        return event.data;
                    }
                    return character;
                });
            }
        }
    }

    addCharacterList() {
        // Adds all characters from the state to the initiative
        let initiative = this.state.initiative.slice();
        this.state.characters.forEach((character) => {
            initiative.push({
                key: ++this.keyCounter,
                initiative: 0,
                name: character.name,
                character: character._id,
            });
        });
        this.setState({
            initiative: initiative,
        });
    }

    sort() {
        let initiative = this.state.initiative.slice();
        initiative.sort((a, b) => {
            if (a.initiative > b.initiative) {
                return -1
            }
            return (a.initiative == b.initiative) ? 0 : 1;
        });
        this.setState({
            initiative: initiative,
        });
    }

    next() {
        if (this.state.initiative.length > 1) {
            let initiative = this.state.initiative.slice();
            initiative.push(initiative.shift());

            if (this.events) {
                let payload = {
                    key: "next_turn",
                    namespace: "initiative",
                    data: {
                        current: initiative[0].character,
                        next: initiative[1].character,
                    },
                };
                this.events.emit("initiative.turn", payload, true);
            }

            this.setState({
                initiative: initiative,
            });
        }
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

    updateSelectedCampaign(event: any): void {
        let selectedCampaign: Campaign;
        let characters: Character[] = [];
        this.state.campaigns.forEach((campaign: Campaign) => {
            if (campaign._id == event.target.value) {
                selectedCampaign = campaign;
            }
        });
        this.charactersList.forEach((character: Character) => {
            selectedCampaign.characters.forEach((characterId: string) => {
                if (characterId === character._id) {
                    characters.push(character);
                }
            });
        });

        this.setState({
            characters: characters,
            selectedCampaign: selectedCampaign._id,
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
            <div className="initiative-page padding-15">
                <h1>Initiative</h1>
                <div>
                    <ol className="initiativeList">
                        {this.state.initiative.map((a, i) => {
                            return (
                                <li key={a.key}>
                                    <span className="name">{a.name}</span>
                                    <input type="text" value={a.initiative} onChange={(event) => this.updateInitiative(i, event)}/>
                                    <span className="ordering">
                                        {i > 0 && <button type="button" title="Move Up" onClick={() => this.moveUp(i)}>🠹</button> }
                                        {i < this.state.initiative.length - 1 && <button type="button" title="Move Down" onClick={() => this.moveDown(i)}>🠻</button> }
                                    </span>
                                    <button className="btn delete-btn" type="button" title="Remove" onClick={() => this.remove(i)}>-</button>
                                </li>
                            );
                        })}
                    </ol>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" placeholder="Name" value={this.state.addName} onChange={(event) => this.updateInputState('addName', event)}/>
                        <input type="text" placeholder="Initiative" value={this.state.addInitiative} onChange={(event) => this.updateInputState('addInitiative', event, true)}/>
                        <button type="submit" title="Add to initiative">+</button>
                    </form>
                    <button type="button" onClick={this.next}>Next</button>
                    <button type="button" onClick={this.sort}>Sort</button>
                </div>
                <div>
                    <div>
                        <select onChange={(event) => this.updateSelectedCampaign(event)}>
                            <option value=""> -- Select Campaign -- </option>
                            {this.state.campaigns.map((campaign: Campaign) => {
                                return (<option key={campaign._id} value={campaign._id}>{campaign.name}</option>)
                            })}
                        </select>
                    </div>
                    <div>
                        <ul>
                            {this.state.characters.map((character: Character) => {
                                return (<li key={character._id}>{character.name}</li>)
                            })}
                        </ul>
                        <button type="button" onClick={() => this.addCharacterList()}>Add All</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default InitiativePage;