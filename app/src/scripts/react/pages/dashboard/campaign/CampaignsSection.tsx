import React, { Component } from "react";
import { Link } from "react-router-dom";
import CampaignPreview from "./CampaignPreview";
import { MainRouterConfig } from "../../../routers/config";
import EventBus from "../../../common/Events";
import { each } from "jquery"
import { Campaign } from "../../../interfaces";
import CampaignCreate from "./CampaignCreate";


interface CampaignSectionProps {
	campaigns:string[],
	updateCampaigns:any
}

interface CampaignSectionState {
    isCreating:boolean,
    campaigns:any[]
}

class CampaignsSection extends Component<CampaignSectionProps, CampaignSectionState> {

  private events: EventBus;
	private readonly eventListeners: object;
	private setIsCreating: any;

  constructor(props:any) {
		super(props);

		this.eventListeners = {
			'data.retrieved': this.dataRetrieved.bind(this),
			'data.persisted': this.dataPersisted.bind(this),
		};

		EventBus.get()
			.then((bus) => {
				this.events = bus;
				each(this.eventListeners, (event, callback) => {
					this.events.on(event, callback);
				});
			});

		this.state = {
			isCreating: false,
			campaigns: [],
		};

		this.setIsCreating = (val = true) => this.setState({isCreating: val});
		this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    EventBus.emit('data.get', {namespace: 'campaign', key: 'get_campaigns'}, true);
  }

  componentWillUnmount() {
		const self = this;
		if (this.events !== null) {
			each(this.eventListeners, (event, callback) => {
				self.events.removeListener(event, callback);
			});
		}
  }

  addCampaign(campaign:any) {
		const payload = {
			namespace: 'campaign',
			key: 'new_campaign', 
			data: {
				name: campaign.name,
				system: campaign.campaignSystem,
			},
		};
		this.events.emit('data.persist', payload, true);
  }

  updateInputState(key:string, event:any) {
		const newState = {};
		newState[key] = event.target.value;
		this.setState(newState);
  }

  handleSubmit(campaign:any) {
		this.addCampaign(campaign)
		this.setState({
			isCreating: false
		});
  }

  dataRetrieved(event: any) {
		if (event.namespace === "campaign" && event.key === "get_campaigns" && event.data) {
			this.setState({
				campaigns: event.data
			});
		}
  }

  dataPersisted(event: any) {
		if (event.namespace === "campaign" && event.key === "new_campaign" && event.data) {
			const campaigns = this.state.campaigns.slice();
			campaigns.push(event.data);
			this.setState({
				campaigns: campaigns
			});
		}
  }

  render() {
		const { isCreating, campaigns } = this.state;

    return (
      <div className="content-page campaigns" id="campaigns">
        <h1>Here are your Campaigns</h1>
        <Link to={MainRouterConfig.routes.game.path}>go to demo</Link>
				<div className="previews">
					{this.state.campaigns.map((campaign: Campaign) => 
						<CampaignPreview key={campaign._id} name={campaign.name}/>
					)}
					<div className="campaign-preview add-item" onClick={this.setIsCreating}>
						<span>+</span>
					</div>
				</div>
				{isCreating
					? <CampaignCreate close={this.setIsCreating.bind(null, false)} existing={campaigns} createCampaign={this.handleSubmit} />
					: null}
      </div>
    );
  }
}

export default CampaignsSection;
