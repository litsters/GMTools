import React, { Component } from "react";
import { connect } from "react-redux";
import MasterDetailsLayout from "../../../layout/MasterDetailLayout";
import IPage from "../../../interfaces/IPage";
import { apiGetCodex } from "../../../actions/codex-actions";
import { CodexReducer } from "../../../reducers";
import CategoryList from "./CategoryList";
import MonsterDetails from "./MonsterDetails";
import ItemDetails from "./ItemDetails";
import Tabs, { Tab } from "./Tabs";

// define categories that should not be rendered
const blockedCategories = ["config"];

interface LookupPageProps {
    codex: any,
    apiGetCodex: any
}

interface LookupPageState {
    filterText: string,
    tabs: Array<Tab>
}

class LookupPage extends Component<IPage & LookupPageProps, LookupPageState> {

    constructor(props:any) {
        super(props);
        this.state = {
            filterText: "",
            tabs: []
        }

        this.openTab = this.openTab.bind(this);
        this.closeTab = this.closeTab.bind(this);
        this.renderMaster = this.renderMaster.bind(this);
    }

    componentDidMount() {
        if (!this.props.codex) this.props.apiGetCodex();
    }

    openTab(tab:Tab) {
        let tabs = this.state.tabs;
        tabs.push(tab);
        this.setState({tabs});
    }

    closeTab(index:number) {
        let tabs = this.state.tabs;
        tabs.splice(index, 1);
        this.setState({tabs});
    }


    filterEntries(search:string, codex:any) {
        search = search.trim().toLowerCase();
        let results: any = [];

        Object.keys(codex).forEach((key) => {
            if (blockedCategories.indexOf(key) !== -1) return;

            // results[key] = codex[key].filter((item:any) => {
            //     return item.name && item.name.toLowerCase().indexOf(search) !== -1;
            // });
            results[key] = [];
            for (let i = 0; i < codex[key].length; i++) {
                let item = codex[key][i];
                item.id = i;
                if (item.name && item.name.toLowerCase().indexOf(search) !== -1)
                    results[key].push(item);
            }
        });

        return results;
    }

    renderCategories(codex:any) {
        if (!codex) return null;

        return (
            <div className="codex-categories">
                {Object.keys(codex).map((key) => {
                    if (blockedCategories.indexOf(key) !== -1) return null;

                    return (
                        <CategoryList key={key} headline={key} items={codex[key]}/>
                    );
                })}
            </div>
        );
    }

    renderOpenItem(codex:any, category:string, id:number, openTab:any) {
        if (!category || !id || !codex) return null;
        category = category.toLowerCase();
        let item = this.props.codex[category][id];

        switch(category.toLowerCase()) {
            case "creatures":
                return <MonsterDetails monster={item} id={id} openTab={openTab}/>;
            case "items":
                return <ItemDetails item={item} id={id} openTab={openTab}/>;
            default: return null;
        }
    }

    renderMaster(renderedCategories:any) {
        return (
            <div className="codex-master">
                <div className="codex-input">
                    <input type="text" placeholder={"search for an entry"} onKeyUp={(event:any) => this.setState({filterText: event.target.value})}/>
                </div>
                {renderedCategories}
            </div>
        );
    }

    render() {
        const { codex, match, history } = this.props;
        const { filterText, tabs } = this.state;
        const filteredCodex = filterText ? this.filterEntries(filterText, codex) : codex;
        const renderedCategories = this.renderCategories(filteredCodex);
        const renderedOpenItem = this.renderOpenItem(codex, match.params.category, match.params.id, this.openTab)
        const renderedTabs = <Tabs tabs={tabs} closeTab={this.closeTab}/>
        const renderedMaster = this.renderMaster(renderedCategories);

        return (
            <div className="layout-page">
                {renderedTabs}
                <MasterDetailsLayout master={renderedMaster} details={renderedOpenItem} clearDetails={() => history.push("/game/lookup")} />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch:any) => ({
    apiGetCodex: () => dispatch(apiGetCodex())
})

export default connect(CodexReducer, mapDispatchToProps)(LookupPage);