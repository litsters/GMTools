import React, { SFC } from "react";
import { Link } from "react-router-dom";

interface TabsProps {
    tabs: Array<Tab>,
    closeTab: any
}

export interface Tab {
    text: string,
    path: string
}

const Tabs: SFC<TabsProps> = (props) => {
    const { tabs, closeTab } = props;

    return (
        <div>
            <ul>
                {tabs.map((tab, i) => {
                    return (
                        <li key={i}>
                            <Link to={tab.path}>{tab.text}</Link>
                            <i onClick={closeTab.bind(null, i)}>X</i>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default Tabs;