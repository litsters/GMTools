import React, {MouseEventHandler, SFC} from "react";

interface CharacterProps {
    name: string,
    campaign?: string,
    join?: MouseEventHandler,
}

const CharacterPreview: SFC<CharacterProps> = (props) => {
    return (
        <div className="character-preview">
            <span>{props.name}</span>
            <span>{props.campaign && props.campaign.length > 0 ? (
                props.campaign
            ) : (
                <button type="button" title="Add to campaign" onClick={props.join}>+</button>
            )}</span>
        </div>
    );
};

export default CharacterPreview;
