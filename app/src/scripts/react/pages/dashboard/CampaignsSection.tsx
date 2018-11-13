import React, { Component } from "react";
import { Link } from "react-router-dom";
import CampaignPreview from "./CampaignPreview";
import { MainRouterConfig } from "../../routers/config";


interface CampaignSectionProps {
	campaigns:string[],
	updateCampaigns:any
}

interface CampaignSectionState {

}

class CampaignsSection extends Component<CampaignSectionProps, CampaignSectionState> {

	constructor(props:CampaignSectionProps) {
		super(props);

		this.state = {
		}

	}

    addCampaign() {
		// TODO send new campaign to the server or open a new campaign page?
		let campaigns = this.props.campaigns;
		campaigns.push('Campaign ' + (campaigns.length + 1));

		this.props.updateCampaigns(campaigns);
    }

    render() {

        return (
            <div className="content-page campaigns" id="campaigns">
                <h1>Here are your Campaigns</h1>
                <Link to={MainRouterConfig.routes.game.path}>go to demo</Link>
				<div className="previews">
					{this.props.campaigns.map((campaign:string) => 
						<CampaignPreview key={campaign} name={campaign}/>
					)}
					<div className="campaign-preview add-item" onClick={this.addCampaign.bind(this)}>
						<span>+</span>
					</div>
				</div>
            </div>
        );
    }
}

export default CampaignsSection;
