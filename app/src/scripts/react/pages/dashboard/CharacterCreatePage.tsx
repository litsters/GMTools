import React, { Component } from "react";


class CharacterCreatePage extends Component {
    private txtbName:HTMLInputElement

    constructor(props:any) {
        super(props);

        this.buildCharacter = this.buildCharacter.bind(this);
    }

    buildCharacter() {
        let character = {
            name: this.txtbName.value
        };

        return character;
    }

    render() {
        return (
            <div>
                <h3>Create a character</h3>
                <label>Name</label>
                <input type="text" ref={el => this.txtbName = el}/>
                <br/>
                <button type="button">Create</button>
            </div>
        );
    }
}

export default CharacterCreatePage;