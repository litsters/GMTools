import React, { SFC } from "react";
import { Link } from "react-router-dom";

interface TabsProps {
    tabs: Array<Tab>,
    closeTab: any
}

export interface Tab {
    text: string,
    path: string,
    icon: string
}

const Tabs: SFC<TabsProps> = (props) => {
    const { tabs, closeTab } = props;
    console.log(tabs);
    if (!tabs) return null;

    return (
        <div className="tabs-wrapper">
            <ul className="tabs">
                {tabs.map((tab, i) => {
                    const text = tab.text.length > 16 ? `${tab.text.substr(0,16)}...` : tab.text;
                    return (
                        <li className="tab" key={i}>
                            {tab.icon ? <img className="tab-icon" src={tab.icon}/> : null}
                            <Link to={tab.path} className="tab-text" title={tab.text}>{text}</Link>
                            <i className="tab-close" onClick={closeTab.bind(null, i)}>X</i>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default Tabs;