import React, { Component } from "react";
import CharacterPreview from "./CharacterPreview";

class CharactersSection extends Component<{}> {
    render() {
        return (
            <div className="content-page characters" id="characters">
                <h1>Here are your Characters</h1>
                <div className="previews">
                    <CharacterPreview />
                    <CharacterPreview />
                    <CharacterPreview />
                </div>
            </div>
        );
    }
}

export default CharactersSection;