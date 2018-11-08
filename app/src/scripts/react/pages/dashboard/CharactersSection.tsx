import React, { Component } from "react";
import CharacterPreview from "./CharacterPreview";

interface CharacterSectionProps {
    characters:string[],
    updateCharacters:any
}

class CharactersSection extends Component<CharacterSectionProps, {}> {

    constructor(props:any) {
        super(props);

        // this.state = {
        //     // TODO load from the server
        //     characters: ['Character 1', 'Character 2'],
        // };
    }

    addCharacter() {
        // TODO send the new character to the server? Open a new character page?
        const characters = this.props.characters.slice();
        characters.push('Character ' + (characters.length + 1));

        this.props.updateCharacters(characters);
    }

    render() {
        const { characters } = this.props;

        return (
            <div className="content-page characters" id="characters">
                <h1>Here are your Characters</h1>
                <div className="previews">
                    {characters ? characters.map((character:string) => <CharacterPreview key={character} name={character}/>) : null }
                    <div className="character-preview add-item" onClick={() => this.addCharacter()}>
                        <span>+</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default CharactersSection;
