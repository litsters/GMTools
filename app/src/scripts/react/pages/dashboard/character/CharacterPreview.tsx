import React, {MouseEventHandler, SFC} from "react";

interface CharacterProps {
    name: string,
    campaignName?: string,
    onClick?: MouseEventHandler,
}

const CharacterPreview: SFC<CharacterProps> = (props) => {
    return (
        <div className="character-preview" onClick={props.onClick}>
            <span>{props.name}</span>
        </div>
    );
};

export default CharacterPreview;
