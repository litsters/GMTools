import React, { Component } from "react";
import { connect } from "react-redux";
import IPage from "../../../interfaces/IPage";
import { apiGetCodex } from "../../../actions/codex-actions";
import { CodexReducer } from "../../../reducers";
import CategoryList from "./CategoryList";

// define categories that should not be rendered
const blockedCategories = ["config"];

interface LookupPageProps {
    codex: any,
    apiGetCodex: any
}

interface LookupPageState {
    filterText: string
}

class LookupPage extends Component<IPage & LookupPageProps, LookupPageState> {

    constructor(props:any) {
        super(props);
        this.state = {
            filterText: ""
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

            results[key] = codex[key].filter((item:any) => {
                return item.name && item.name.toLowerCase().indexOf(search) !== -1;
            })
        });

        return results;
    }

    renderCategories(codex:any) {
        if (!codex) return null;

        return Object.keys(codex).map((key) => {
            if (blockedCategories.indexOf(key) !== -1) return null;

            return (
                <CategoryList key={key} headline={key} items={codex[key]} />
            );
        });
    }

    render() {
        const { codex } = this.props;
        const { filterText } = this.state;
        const filteredCodex = filterText ? this.filterEntries(filterText, codex) : codex;
        const categories = this.renderCategories(filteredCodex);

        return (
            <div>
                <h1>Lookup Page</h1>
                <input type="text" onKeyUp={(event:any) => this.setState({filterText: event.target.value})}/>
                {categories}
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch:any) => ({
    apiGetCodex: () => dispatch(apiGetCodex())
})

export default connect(CodexReducer, mapDispatchToProps)(LookupPage);