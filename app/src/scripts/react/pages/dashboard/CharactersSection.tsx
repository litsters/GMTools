import React, { Component } from "react";
import CharacterPreview from "./CharacterPreview";
import getBus, { EventBus } from "../../common/Events";
import { each } from "jquery"

interface Character {
    _id: string
    campaigns: string[]
    name: string
    user: string
}
interface Campaign {
    _id: string
    users: string[]
    characters: string[]
    name: string
    gm: string // User._id of the GM
}

interface CharacterSectionState {
    showNew: boolean,
    characterName: string,
    characterSystem: string,
    characters: Character[],
    joinCharacter: Character,
    campaigns: Campaign[],
    selectedCampaign: string,
}

class CharactersSection extends Component<{}, CharacterSectionState> {
    private readonly events: EventBus;
    private readonly campaignsMap: {[id: string]: Campaign};
    private readonly eventListeners: object;

    constructor(props:any) {
        super(props);

        // Declare what events we listen to and what method will handle them
        this.eventListeners = {
            'data.retrieved': this.dataRetrieved.bind(this),
            'data.persisted': this.dataPersisted.bind(this),
        };

        // Bind events
        this.events = getBus();
        each(this.eventListeners, (event, callback) => {
            this.events.on(event, callback);
        });

        this.state = {
            showNew: false,
            characterName: '',
            characterSystem: '',
            characters: [],
            joinCharacter: null,
            campaigns: [],
            selectedCampaign: "",
        };
        this.campaignsMap = {};
    }

    componentDidMount() {
        // Ask the server to get all our characters
        this.events.emit('data.get', { namespace: 'character', key: 'get_characters' }, true);
    }

    componentWillUnmount() {
        if (this.events !== null) {
            each(this.eventListeners, (event, callback) => {
                this.events.removeListener(event, callback);
            });
        }
    }

    addCharacter() {
        // Send the new character to be persisted to the server
        const payload = {
            namespace: 'character',
            key: 'new_character',
            data: {
                name: this.state.characterName,
                system: this.state.characterSystem,
            },
        };
        this.events.emit('data.persist', payload, true);
    }

    updateInputState(key:string, event:any) {
        const newState = {};
        newState[key] = event.target.value;
        this.setState(newState);
    }

    handleSubmit(event: any, formName: string) {
        event.preventDefault();
        switch (formName) {
            case "newCharacter":
                this.addCharacter();
                this.setState({
                    showNew: false,
                    characterName: '',
                });
                break;
            case "joinCampaign":
                if (this.state.selectedCampaign in this.campaignsMap) {
                    const payload = {
                        namespace: "campaign",
                        key: "add_character",
                        data: {
                            campaign: this.state.selectedCampaign,
                            character: this.state.joinCharacter._id,
                        },
                    };
                    this.events.emit("data.persist", payload, true);
                }
                break;
        }
    }

    dataRetrieved(event: any) {
        if (event.namespace === "character" && event.key === "get_characters" && event.data) {
            // Character data retrieved, add to the UI
            this.setState({
                characters: event.data,
            });
        } else if (event.namespace === "campaign" && event.key === "get_campaigns" && event.data) {
            event.data.forEach((campaign: any) => {
                this.campaignsMap[campaign._id] = campaign;
            });

            this.setState({
                campaigns: event.data,
            });
        }
    }

    dataPersisted(event: any) {
        if (event.namespace === "character" && event.data) {
            if (event.key === "new_character") {
                // New character added, update the state to show this character
                const characters = this.state.characters.slice();
                characters.push(event.data);

                this.setState({
                    characters: characters,
                });
            } else if (event.key === "character_updated") {
                // Character updated, update that character
                let characters = this.state.characters.map((character: Character) => {
                    if (character._id === event.data._id) {
                        return event.data;
                    }
                    return character;
                });
                this.setState({
                    characters: characters,
                });
            }
        }
    }

    getCampaign(character: Character) {
        let campaigns = "";
        character.campaigns.forEach((campaignId: string) => {
            if (campaignId in this.campaignsMap) {
                if (campaigns.length > 0) {
                    campaigns += ", "
                }
                campaigns += this.campaignsMap[campaignId].name;
            }
        });
        return campaigns;
    }

    initializeJoin(character: Character) {
        this.setState({
            joinCharacter: character,
        });
    }

    render() {
        return (
            <div className="content-page characters" id="characters">
                <h1>Here are your Characters</h1>
                <div className="previews">
                    {this.state.characters.map((character: Character) =>
                        <CharacterPreview key={character._id} name={character.name} campaign={this.getCampaign(character)} join={() => this.initializeJoin(character)}/>)}
                </div>
                <div className="newCharacter">
                    {this.state.showNew ? (
                        <form onSubmit={(event) => this.handleSubmit(event, "newCharacter")}>
                            <select value={this.state.characterSystem} onChange={(event) => this.updateInputState('characterSystem', event)}>
                                <option value="dnd5e">D&amp;D 5e</option>
                            </select>
                            <input type="text" placeholder="Name" value={this.state.characterName} onChange={(event) => this.updateInputState('characterName', event)}/>
                            <button title="Create Character" type="submit">Create</button>
                        </form>
                    ) : (
                        <button title="New Character" onClick={() => this.setState({showNew: true})}>+</button>
                    )}
                </div>
                {this.state.joinCharacter && <form onSubmit={() => this.handleSubmit(event, "joinCampaign")} className="joinCampaign">
                    <span>{this.state.joinCharacter.name}</span>
                    <select onChange={(event) => this.updateInputState("selectedCampaign", event)}>
                        <option value=""> </option>
                        {this.state.campaigns.map((campaign: Campaign) => <option key={campaign._id} value={campaign._id}>{campaign.name}</option>)}
                    </select>
                    <button title="Join Campaign" type="submit">Join</button>
                </form>}
            </div>
        );
    }
}

export default CharactersSection;
