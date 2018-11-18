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

interface CharacterSectionState {
    showNew: boolean,
    characterName: string,
    characterSystem: string,
    characters: Character[],
}

class CharactersSection extends Component<{}, CharacterSectionState> {
    private events: EventBus;
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
        };
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

    handleSubmit(event:any) {
        event.preventDefault();
        this.addCharacter();
        this.setState({
            showNew: false,
            characterName: '',
        });
    }

    dataRetrieved(event: any) {
        if (event.namespace === "character" && event.key === "get_characters" && event.data) {
            // Character data retrieved, add to the UI
            this.setState({
                characters: event.data,
            });
        }
    }

    dataPersisted(event: any) {
        if (event.namespace === "character" && event.key === "new_character" && event.data) {
            // New character added, update the state to show this character
            const characters = this.state.characters.slice();
            characters.push(event.data);

            this.setState({
                characters: characters,
            });
        }
    }

    render() {
        return (
            <div className="content-page characters" id="characters">
                <h1>Here are your Characters</h1>
                <div className="previews">
                    {this.state.characters.map((character: Character) => <CharacterPreview key={character._id} name={character.name}/>)}
                </div>
                <div className="newCharacter">
                    {this.state.showNew ? (
                        <form onSubmit={(event) => this.handleSubmit(event)}>
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
            </div>
        );
    }
}

export default CharactersSection;
