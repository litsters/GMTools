import React, { Component } from "react";
import { Link } from "react-router-dom";
import CampaignPreview from "./CampaignPreview";
import { MainRouterConfig } from "../../routers/config";


interface CampaignSectionState {
    showNew:boolean,
    campaigns:string[],
    campaignName:string,
    campaignSystem:string,
}

class CampaignsSection extends Component<{}, CampaignSectionState> {

    constructor(props:any) {
	super(props);

	this.state = {
	    // TODO load from the server
	    showNew: false,
	    campaignName: '',
	    campaignSystem: '',
	    campaigns: ['Campaign 1', 'Campaign 2'],
	};
    }

    addCampaign() {
	// TODO send new campaign to the server or open a new campaign page?
	const campaigns = this.state.campaigns.slice();
	campaigns.push(this.state.campaignName);

	this.setState({
	    campaigns: campaigns
	});
    }

    updateInputState(key:string, event:any) {
	const newState = {};
	newState[key] = event.target.value;
	this.setState(newState);
    }

    handleSubmit(event:any) {
	event.preventDefault();
	this.addCampaign()
	this.setState({
	    showNew: false,
	    campaignName: '',
	});
    }

    render() {
        return (
            <div className="content-page campaigns" id="campaigns">
                <h1>Here are your Campaigns</h1>
                <Link to={MainRouterConfig.routes.game.path}>go to demo</Link>
		<div className="previews">
		    {this.state.campaigns.map((campaign:string) => <CampaignPreview key={campaign} name={campaign}/>)}
		</div>
		<div className="newCampaign">
		    {this.state.showNew ? (
			<form onSubmit={(event) => this.handleSubmit(event)}>
			    <select value={this.state.campaignSystem} onChange={(event) => this.updateInputState('campaignSystem', event)}>
				<option value='dnd5e'>D&amp;D 5e</option>
			    </select>
			    <input type="text" placeholder="Name" value={this.state.campaignName} onChange={(event) => this.updateInputState('campaignName', event)}/>
			    <button title="Create Campaign" type="submit">Create</button>
			</form>
		) : (
		    <button title="New Campaign" onClick={() => this.setState({showNew: true})}>+</button>
		)}
		</div>
            </div>
        );
    }
}

export default CampaignsSection;
