import React, { Component } from "react";
import CharacterPreview from "./CharacterPreview";
import CharacterCreate from "./CharacterCreate";

interface CharacterSectionProps {
    characters:string[],
    updateCharacters:any
}

interface CharacterSectionState {
    isCreating:boolean
}

class CharactersSection extends Component<CharacterSectionProps, CharacterSectionState> {
    private setCreatePanelOpen:any;

    constructor(props:any) {
        super(props);

        this.state = {
            isCreating: false
        }

        this.setCreatePanelOpen = (val:boolean = true) => this.setState({isCreating: val});
        this.renderCharacterCreate = this.renderCharacterCreate.bind(this);
    }

    addCharacter(character:any) {
        // TODO send the new character to the server? Open a new character page?
        const characters = this.props.characters;
        characters.push(character);

        this.props.updateCharacters(characters);
    }

    renderCharacterCreate(isCreating:boolean) {
        if (!isCreating) return null;

        return (
            <CharacterCreate createCharacter={this.addCharacter.bind(this)} close={this.setCreatePanelOpen.bind(null, false)} existing={null} />
        );
    }

    render() {
        const { characters } = this.props;
        const { isCreating } = this.state;

        const renderedCharacterCreate = this.renderCharacterCreate(isCreating);

        return (
            <div className="content-page characters" id="characters">
                <h1>Here are your Characters</h1>
                <div className="previews">
                    {characters ? characters.map((character:any) => <CharacterPreview key={character.name} name={character.name}/>) : null }
                    <div className="character-preview add-item" onClick={this.setCreatePanelOpen.bind(null, true)}>
                        <span>+</span>
                    </div>
                </div>
                {renderedCharacterCreate}
            </div>
        );
    }
}

export default CharactersSection;
