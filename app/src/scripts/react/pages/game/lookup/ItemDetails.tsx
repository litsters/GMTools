import React, { SFC } from "react";

interface ItemProps {
    name:string,
    type:string,
    weight:any,
    text:string,
    value:string
}

export interface ItemDetailsProps {
    item:ItemProps,
    id:any
    openTab:any
}

const ItemDetails: SFC<ItemDetailsProps> = (props) => {
    const { item } = props;

    return (
        <div>
            <button type="button" 
                onClick={props.openTab.bind(null, {text: item.name, path: `/game/lookup/items/${props.id}`, icon: "https://i1.wp.com/www.pixelmatortemplates.com/wp-content/uploads/2014/11/cartoon-icon-final.jpg"})}
                >
                Pin
            </button>
            <h3>{item.name}</h3>
            <p>{item.text}</p>
            <ul>
                <li><strong>Type</strong> {item.type}</li>
                <li><strong>Weight</strong> {item.weight}</li>
                <li><strong>Value</strong> {item.value}</li>
            </ul>
        </div>
    );
}

export default ItemDetails;