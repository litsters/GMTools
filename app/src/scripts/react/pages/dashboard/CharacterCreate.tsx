import React, { Component } from "react";


interface CharacterCreateProps {
    createCharacter:any,
    close:any,
    existing:any
}

class CharacterCreate extends Component<CharacterCreateProps> {
    private txtbName:HTMLInputElement

    submit() {
        let character:any = { };
        
        character.name = this.txtbName.value.trim();

        this.props.createCharacter(character);

        this.props.close();
    }

    render() {
        return (
            <div className="slide-panel">
                <span className="pointer float-right" onClick={this.props.close}>Close X</span>
                <h1>Create Character</h1>
                <div>
                    <label>Name</label>
                    <input type="text" ref={el => this.txtbName = el}/>
                </div>
                <br/>
                <button type="button" onClick={this.submit.bind(this)}>Create</button>
            </div>
        );
    }
}

export default CharacterCreate;