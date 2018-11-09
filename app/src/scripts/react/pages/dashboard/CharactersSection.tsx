import React, { Component } from "react";
import CharacterPreview from "./CharacterPreview";

interface CharacterSectionState {
    showNew:boolean,
    characterName:string,
    characterSystem:string,
    characters:string[],
}

class CharactersSection extends Component<{}, CharacterSectionState> {

    constructor(props:any) {
        super(props);

        this.state = {
            // TODO load from the server
            showNew: false,
            characterName: '',
            characterSystem: '',
            characters: ['Character 1', 'Character 2'],
        };
    }

    addCharacter() {
        // TODO send the new character to the server? Open a new character page?
        const characters = this.state.characters.slice();
        characters.push(this.state.characterName);

        this.setState({
            characters: characters
        });
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

    render() {
        return (
            <div className="content-page characters" id="characters">
                <h1>Here are your Characters</h1>
                <div className="previews">
                    {this.state.characters.map((character:string) => <CharacterPreview key={character} name={character}/>)}
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
