import React, { Component } from "react";
import { Link } from "react-router-dom";
import CampaignPreview from "./CampaignPreview";
import { MainRouterConfig } from "../../routers/config";


class CampaignsSection extends Component<{}> {
    render() {
        return (
            <div className="content-page campaigns" id="campaigns">
                <h1>Here are your Campaigns</h1>
                <Link to={MainRouterConfig.routes.game.path}>go to demo</Link>
                <div className="previews">
                    <CampaignPreview />
                    <CampaignPreview />
                </div>
            </div>
        );
    }
}

export default CampaignsSection;