import React, { Component } from "react";
import { Link } from "react-router-dom";
import CampaignPreview from "./CampaignPreview";
import { MainRouterConfig } from "../../routers/config";
import getBus, { EventBus } from "../../common/Events";
import { each } from "jquery"
import { Campaign } from "../../interfaces";


interface CampaignSectionProps {
	campaigns:string[],
	updateCampaigns:any
}

interface CampaignSectionState {
    showNew:boolean,
    campaigns:Campaign[],
    campaignName:string,
    campaignSystem:string,
}

class CampaignsSection extends Component<CampaignSectionProps, CampaignSectionState> {

    private events: EventBus;
    private readonly eventListeners: object;

    constructor(props:any) {
	super(props);

	this.eventListeners = {
	    'data.retrieved': this.dataRetrieved.bind(this),
	    'data.persisted': this.dataPersisted.bind(this),
	};

	this.events = getBus();
	each(this.eventListeners, (event, callback) => {
	    this.events.on(event, callback);
	});

	this.state = {
	    showNew: false,
	    campaignName: '',
	    campaignSystem: '',
	    campaigns: [],
	};
    }

    componentDidMount() {
	this.events.emit('data.get', { namespace: 'campaign', key: 'get_campaigns' }, true);
    }

    componentWillUnmount() {
	if (this.events !== null) {
	    each(this.eventListeners, (event, callback) => {
		this.events.removeListener(event, callback);
	    });
	}
    }

    addCampaign() {
	
	const payload = {
	    namespace: 'campaign',
	    key: 'new_campaign', 
	    data: {
		name: this.state.campaignName,
		system: this.state.campaignSystem,
	    },
	};
	this.events.emit('data.persist', payload, true);
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

    dataRetrieved(event: any) {
	if (event.namespace === "campaign" && event.key === "get_campaigns" && event.data) {
	    this.setState({
		campaigns: event.data,
	    });
	}
    }

    dataPersisted(event: any) {
	if (event.namespace === "campaign" && event.key === "new_campaign" && event.data) {
	    const campaigns = this.state.campaigns.slice();
	    campaigns.push(event.data);
	    this.setState({
		campaigns: campaigns,
	    });
	}
    }

    render() {

        return (
            <div className="content-page campaigns" id="campaigns">
                <h1>Here are your Campaigns</h1>
                <Link to={MainRouterConfig.routes.game.path}>go to demo</Link>
				{/*<div className="previews">
					{this.props.campaigns.map((campaign:string) => 
						<CampaignPreview key={campaign} name={campaign}/>
					)}
					<div className="campaign-preview add-item" onClick={this.addCampaign.bind(this)}>
						<span>+</span>
					</div>
					</div>*/}
		<div className="previews">
		    {this.state.campaigns.map((campaign: Campaign) => <CampaignPreview key={campaign._id} name={campaign.name}/>)}
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
