import React, { SFC } from "react";

interface CharacterProps {
    name: string,
}

const CharacterPreview: SFC<CharacterProps> = (props) => {
    return (
        <div className="character-preview">
            {props.name}
        </div>
    );
};

export default CharacterPreview;
