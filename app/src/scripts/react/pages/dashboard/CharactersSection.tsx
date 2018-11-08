import React, { Component } from "react";
import CharacterPreview from "./CharacterPreview";

interface CharacterSectionState {
    characters:string[],
}

class CharactersSection extends Component<{}, CharacterSectionState> {

    constructor(props:any) {
        super(props);

        this.state = {
            // TODO load from the server
            characters: ['Character 1', 'Character 2'],
        };
    }

    addCharacter() {
        // TODO send the new character to the server? Open a new character page?
        const characters = this.state.characters.slice();
        characters.push('Character ' + (characters.length + 1));

        this.setState({
            characters: characters
        });
    }

    render() {
        return (
            <div className="content-page characters" id="characters">
                <h1>Here are your Characters</h1>
                <div className="previews">
                    {this.state.characters.map((character:string) => <CharacterPreview key={character} name={character}/>)}
                    <div className="character-preview add-item" onClick={() => this.addCharacter()}>
                        <span>+</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default CharactersSection;
