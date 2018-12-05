import React, { Component } from "react";
import Modal from "../../../common/Modal";


interface CharacterDetailsProps {
    character:any,
    campaigns:Array<any>
    close:any,
    joinCampaign:any
}

interface CharacterDetailsState {
    isJoining:boolean,
    selectedCampaign:any
}

class CharacterDetails extends Component<CharacterDetailsProps, CharacterDetailsState> {
    private setIsJoining:any;
    private setSelectedCampaign:any;

    constructor(props:CharacterDetailsProps) {
        super(props);

        this.state = {
            isJoining: false,
            selectedCampaign: null
        }

        this.setIsJoining = (val = true) => this.setState({isJoining: val});
        this.setSelectedCampaign = (val:any = null) => this.setState({selectedCampaign: val});
        this.handleJoinCampaign = this.handleJoinCampaign.bind(this);
        this.renderJoinDialog = this.renderJoinDialog.bind(this);
        this.renderCharacterCampaigns = this.renderCharacterCampaigns.bind(this);
    }

    handleJoinCampaign() {
        const { character, campaigns, joinCampaign } = this.props;
        let selectedCampaign = this.state.selectedCampaign;

        if (!selectedCampaign && campaigns.length > 0)
            selectedCampaign = campaigns[0];

        if (!character || !selectedCampaign) return;

        joinCampaign(character, selectedCampaign);
        this.setState({isJoining: false, selectedCampaign: null});
    }

    renderJoinDialog(campaigns:Array<any>) {
        if (!this.state.isJoining) return null;
        const self = this;

        return (
            <Modal close={this.setIsJoining.bind(null, false)}>
                <Modal.Header>
                    <h3>Select a campaign to join</h3>
                </Modal.Header>
                <Modal.Body>
                    <select>
                        {campaigns.map((campaign, i) => 
                            <option key={i} value={campaign._id} onSelect={self.setSelectedCampaign.bind(null, campaign)}>
                                {campaign.name}
                            </option>    
                        )}
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-success" type="button" onClick={self.handleJoinCampaign}>Save</button>
                </Modal.Footer>
            </Modal>
        );
    }

    renderCharacterCampaigns(campaigns:any) {
        let map:any = {};
        this.props.campaigns.forEach(c => map[c._id] = c);

        let content = campaigns.length > 0 
            ? <ul>
                {campaigns.map((campaignId:any, i:number) =>
                    <li key={i}>{map[campaignId].name}</li>
                )}
              </ul>
            : <p>No active campaigns</p>

        return (
            <div className="well">
                <h3>Active Campaigns <span className="float-right pointer" onClick={this.setIsJoining}>Join +</span></h3>
                {content}
            </div>
        )
    }

    render() {
        const { character, campaigns, close } = this.props;

        const modal = this.renderJoinDialog(campaigns);

        return (
            <div className="slide-panel">
                <span className="pointer float-right" onClick={close}>Close X</span>
                <h1>{character.name}</h1>
                {this.renderCharacterCampaigns(character.campaigns)}
                {modal}
            </div>
        );
    }
}

export default CharacterDetails;