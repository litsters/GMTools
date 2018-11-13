import React, { Component } from "react";


interface CharacterCreateProps {
    createCharacter:any,
    close:any,
    existing:any
}

interface CharacterCreateState {
    plugins:Array<string>,
    validation:any
}

class CharacterCreate extends Component<CharacterCreateProps, CharacterCreateState> {
    private txtbName:HTMLInputElement;
    private ddnGame:HTMLSelectElement;

    constructor(props:CharacterCreateProps) {
        super(props);

        this.state = {
            plugins: [],
            validation: {}
        }

        this.loadPluginNames = this.loadPluginNames.bind(this);
        this.buildCharacter = this.buildCharacter.bind(this);
        this.validate = this.validate.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this.loadPluginNames();
    }

    loadPluginNames() {
        const self = this;

        fetch("/plugins/names")
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error();
        })
        .then(names => {
            self.setState({plugins: names});
        });
    }

    buildCharacter() {
        let character:any = { };
        
        character.name = this.txtbName.value.trim();
        character.game = this.ddnGame.value;
        if (character.game === "none") character.game = null;

        return character;
    }

    validate(character:any = null) {
        if (!character) character = this.buildCharacter();
        let validation:any = {};
        
        validation.name = character.name === "" ? "Please enter a valid name" : null;
        validation.game = !character.game ? "Please select a game" : null;

        this.setState({validation});

        if (validation.name || validation.game) return false;
        return true;
    }

    submit() {
        let character = this.buildCharacter();
        let isValid = this.validate(character);
        if (!isValid) return;

        this.props.createCharacter(character);

        this.props.close();
    }

    render() {
        const { plugins, validation } = this.state; 
        return (
            <div className="slide-panel">
                <span className="pointer float-right" onClick={this.props.close}>Close X</span>
                <h1>Create Character</h1>
                <div>
                    <label>Name</label>
                    {validation.name ? <p>{validation.name}</p> : null}
                    <input type="text" ref={el => this.txtbName = el}/>
                </div>
                <br/>
                <div>
                    <label>Game</label>
                    {validation.game ? <p>{validation.game}</p> : null}
                    <select ref={el => this.ddnGame = el}>
                        <option value={"none"}>Select Game...</option>
                        {Object.keys(plugins).map((key) => {
                            return <option value={key} key={key}>{plugins[key].name}</option>
                        })}
                    </select>
                </div>
                <br/>
                <button type="button" onClick={this.submit}>Create</button>
            </div>
        );
    }
}

export default CharacterCreate;