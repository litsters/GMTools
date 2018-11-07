import React, { SFC } from "react";

interface CampaignProps {
    name: string,
}

const CampaignPreview: SFC<CampaignProps> = (props) => {
    return (
        <div className="campaign-preview">
            {props.name}
        </div>
    );
};

export default CampaignPreview;
