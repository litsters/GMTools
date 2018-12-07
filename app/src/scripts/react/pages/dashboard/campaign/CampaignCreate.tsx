import React, { Component } from "react";


interface CampaignCreateProps {
    createCampaign:any,
    close:any,
    existing:any
}

interface CampaignCreateState {
    plugins:Array<string>,
    validation:any
}

class CampaignCreate extends Component<CampaignCreateProps, CampaignCreateState> {
    private txtbName:HTMLInputElement;
    private ddnGame:HTMLSelectElement;

    constructor(props:CampaignCreateProps) {
        super(props);

        this.state = {
            plugins: [],
            validation: {}
        };

        this.loadPluginNames = this.loadPluginNames.bind(this);
        this.submit = this.submit.bind(this);
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

    buildCampaign() {
        let campaign:any = { };
        
        campaign.name = this.txtbName.value.trim();
        campaign.system = this.ddnGame.value;
        if (campaign.system === "none") campaign.system = null;

        return campaign;
    }

    validate(campaign:any = null) {
        if (!campaign) campaign = this.buildCampaign();
        let validation:any = {};
        
        validation.name = campaign.name === "" ? "Please enter a valid name" : null;
        validation.system = !campaign.system ? "Please select a game" : null;

        this.setState({validation});

        return !(validation.name || validation.system);
    }

    submit() {
        let campaign = this.buildCampaign();
        let isValid = this.validate(campaign);
        if (!isValid) return;

        this.props.createCampaign(campaign);

        this.props.close();
    }

    render() {
        const { plugins, validation } = this.state; 

        return (
            <div className="slide-panel">
                <span className="pointer float-right" onClick={this.props.close}>Close X</span>
                <h1>Create Campaign</h1>
                <div>
                    <label>Name</label>
                    {validation.name ? <p className="validator">{validation.name}</p> : null}
                    <input type="text" ref={el => this.txtbName = el}/>
                </div>
                <br/>
                <div>
                    <label>Game</label>
                    {validation.system ? <p className="validator">{validation.system}</p> : null}
                    <select ref={el => this.ddnGame = el}>
                        <option value={"none"}>Select Game...</option>
                        {Object.keys(plugins).map((key) => {
                            return <option value={key} key={key}>{plugins[key].name}</option>
                        })}
                    </select>
                </div>
                <br/>
                <br/>
                <br/>
                <button className="btn btn-success" type="button" onClick={this.submit}>Create</button>
            </div>
        );
    }
}

export default CampaignCreate;