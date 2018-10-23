import React, { Component } from "react";
import { connect } from "react-redux";
import IPage from "../../../interfaces/IPage";
import { apiGetCodex } from "../../../actions/codex-actions";
import { CodexReducer } from "../../../reducers";
import CategoryList from "./CategoryList";
import MonsterDetails from "./MonsterDetails";

// define categories that should not be rendered
const blockedCategories = ["config"];

interface LookupPageProps {
    codex: any,
    apiGetCodex: any
}

interface LookupPageState {
    filterText: string,
    tabs: Array<any>
}

class LookupPage extends Component<IPage & LookupPageProps, LookupPageState> {

    constructor(props:any) {
        super(props);
        this.state = {
            filterText: "",
            tabs: []
        }

    }

    componentDidMount() {
        if (!this.props.codex) this.props.apiGetCodex();
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

        return Object.keys(codex).map((key) => {
            if (blockedCategories.indexOf(key) !== -1) return null;

            return (
                <CategoryList key={key} headline={key} items={codex[key]}/>
            );
        });
    }

    renderOpenItem(codex:any, category:string, id:number) {
        if (!category || !id || !codex) return null;
        category = category.toLowerCase();
        let item = this.props.codex[category][id];

        switch(category.toLowerCase()) {
            case "creatures":
                return <MonsterDetails monster={item}/>;
            case "items":
                return null;
            default: return null;
        }
    }

    render() {
        const { codex, match } = this.props;
        const { filterText } = this.state;
        const filteredCodex = filterText ? this.filterEntries(filterText, codex) : codex;
        const categories = this.renderCategories(filteredCodex);
        const openItem = this.renderOpenItem(codex, match.params.category, match.params.id)
        const tabs:any = null;

        return (
            <div>
                {tabs}
                <h1>Lookup Page</h1>
                <input type="text" onKeyUp={(event:any) => this.setState({filterText: event.target.value})}/>
                {openItem}
                {categories}
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch:any) => ({
    apiGetCodex: () => dispatch(apiGetCodex())
})

export default connect(CodexReducer, mapDispatchToProps)(LookupPage);