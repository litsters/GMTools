import React, { SFC } from "react";

interface MasterDetailProps {
    master: any,
    details: any,
    clearDetails: any
}

const MasterDetailLayout: SFC<MasterDetailProps> = (props) => {
    return (
        <div className="layout-master-details">
            <div className="master">{props.master}</div>
            {props.details ? 
                <div className="details">
                    <button type="button" className="details-close" onClick={props.clearDetails}>{"<-"}</button>
                    {props.details}
                </div>
            : null}
        </div>
    )
}

export default MasterDetailLayout;