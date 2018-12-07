import React, { Component } from "react";
import CharacterPreview from "./CharacterPreview";
import CharacterCreate from "./CharacterCreate";
import CharacterDetails from "./CharacterDetails";
import EventBus from "../../../common/Events";
import { each } from "jquery"
import { Character, Campaign } from "../../../interfaces";

enum ComponentMode {
    Default,
    Create,
    Details
}

interface CharacterSectionState {
    characters: Character[],
    joinCharacter: Character,
    campaigns: Campaign[],
    selectedCampaign: string,
    selectedCharacter: Character,
    mode: ComponentMode
}

class CharactersSection extends Component<{}, CharacterSectionState> {
    private events: EventBus;
    private readonly campaignsMap: {[id: string]: Campaign};
    private readonly eventListeners: object;
    private setComponentMode: any;

    constructor(props:any) {
        super(props);
        const self = this;

        this.state = {
            characters: [],
            joinCharacter: null,
            campaigns: [],
            selectedCampaign: "",
            selectedCharacter: null,
            mode: ComponentMode.Default
        };

        // Declare what events we listen to and what method will handle them
        this.eventListeners = {
            'data.retrieved': this.dataRetrieved.bind(this),
            'data.persisted': this.dataPersisted.bind(this),
        };

        // Bind events
        EventBus.get()
            .then((bus) => {
                self.events = bus;

                each(self.eventListeners, (event, callback) => {
                    self.events.on(event, callback);
                });
            });

        this.campaignsMap = {};

        this.setComponentMode = (val:ComponentMode = ComponentMode.Default) => this.setState({mode: val});
        this.handleCreateCharacter = this.handleCreateCharacter.bind(this);
        this.handleJoinCampaign = this.handleJoinCampaign.bind(this);
        this.renderPanel = this.renderPanel.bind(this);
    }

    componentDidMount() {
        // Ask the server to get all our characters
        EventBus.emit('data.get', {namespace: 'character', key: 'get_characters'}, true);
    }

    componentWillUnmount() {
        const self = this;
        if (this.events !== null) {
            each(self.eventListeners, (event, callback) => {
                self.events.removeListener(event, callback);
            });
        }
    }

    addCharacter(character:any) {
        // Send the new character to be persisted to the server
        const payload = {
            namespace: 'character',
            key: 'new_character',
            data: {
                name: character.name,
                system: character.system,
            },
        };
        this.events.emit('data.persist', payload, true);
    }

    updateInputState(key:string, event:any) {
        const newState = {};
        newState[key] = event.target.value;
        this.setState(newState);
    }

    handleCreateCharacter(character:any) {
        this.addCharacter(character);
        this.setState({
            mode: ComponentMode.Default
        });
    }

    handleJoinCampaign(character:Character, campaign:any) {
        if (!character || !campaign) return;

        const payload = {
            namespace: "campaign",
            key: "add_character",
            data: {
                campaign: campaign._id,
                character: character._id,
            },
        };

        this.events.emit("data.persist", payload, true);
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

    renderPanel(mode:ComponentMode) {
        switch(mode) {
            case ComponentMode.Create: return (
                    <CharacterCreate 
                    createCharacter={this.handleCreateCharacter} 
                    close={this.setComponentMode} existing={null} />
            );
            case ComponentMode.Details: return (
                <CharacterDetails
                    character={this.state.selectedCharacter}
                    campaigns={this.state.campaigns}
                    close={this.setComponentMode}
                    joinCampaign={this.handleJoinCampaign}
                />
            );
            default: return null;
        }
    }

    render() {
        //const { characters } = this.props;
        const self = this;
        const { characters, mode } = this.state;

        const renderedPanel = this.renderPanel(mode);

        return (
            <div className="content-page characters" id="characters">
                <h1>Here are your Characters</h1>
                <div className="previews">
                    {characters.map((character:any) => 
                        <CharacterPreview key={character.name} name={character.name} 
                            campaignName={self.getCampaign(character)} 
                            onClick={() => self.setState({selectedCharacter:character, mode:ComponentMode.Details})}/>
                    )}
                    <div className="character-preview add-item" onClick={this.setComponentMode.bind(null, ComponentMode.Create)}>
                        <span>+</span>
                    </div>
                </div>
                {renderedPanel}
                {/*
                {this.state.joinCharacter && <form onSubmit={() => this.handleSubmit(event, "joinCampaign")} className="joinCampaign">
                    <span>{this.state.joinCharacter.name}</span>
                    <select onChange={(event) => this.updateInputState("selectedCampaign", event)}>
                        <option value=""> </option>
                        {this.state.campaigns.map((campaign: Campaign) => <option key={campaign._id} value={campaign._id}>{campaign.name}</option>)}
                    </select>
                    <button title="Join Campaign" type="submit">Join</button>
                    </form>*/}
            </div>
        );
    }
}

export default CharactersSection;
