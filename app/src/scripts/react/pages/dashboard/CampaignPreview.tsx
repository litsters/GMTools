import React, { SFC } from "react";

interface CampaignProps {
    name: string
}

const CampaignPreview: SFC<CampaignProps> = (props) => {
    const { name } = props;

    return (
        <div className="campaign-preview">
            {/* <img className="campaign-image" src={`/plugins/dnd-5e/assets/backdrops/campaign`}/> */}

            {name}
        </div>
    );
};

export default CampaignPreview;
