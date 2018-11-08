import React, { Component } from "react";
import { Link } from "react-router-dom";
import CampaignPreview from "./CampaignPreview";
import { MainRouterConfig } from "../../routers/config";


interface CampaignSectionState {
    campaigns:string[],
}

class CampaignsSection extends Component<{}, CampaignSectionState> {

    constructor(props:any) {
		super(props);

		this.state = {
			// TODO load from the server
			campaigns: ['Campaign 1', 'Campaign 2'],
		};
    }

    addCampaign() {
		// TODO send new campaign to the server or open a new campaign page?
		const campaigns = this.state.campaigns.slice();
		campaigns.push('Campaign ' + (campaigns.length + 1));

		this.setState({campaigns});
    }

    render() {
        return (
            <div className="content-page campaigns" id="campaigns">
                <h1>Here are your Campaigns</h1>
                <Link to={MainRouterConfig.routes.game.path}>go to demo</Link>
				<div className="previews">
					{this.state.campaigns.map((campaign:string) => <CampaignPreview key={campaign} name={campaign}/>)}
					<div className="campaign-preview add-item" onClick={() => this.addCampaign()}>
						<span>+</span>
					</div>
				</div>
            </div>
        );
    }
}

export default CampaignsSection;
