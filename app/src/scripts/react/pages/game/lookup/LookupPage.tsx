import React, { Component } from "react";
import { connect } from "react-redux";
import IPage from "../../../interfaces/IPage";
import { apiGetCodex } from "../../../actions/codex-actions";
import { CodexReducer } from "../../../reducers";
import CategoryList from "./CategoryList";

const blockedCategories = ["config"];

interface LookupPage {
    codex: any,
    apiGetCodex: any
}

class LookupPage extends Component<IPage & LookupPage, {}> {
    componentDidMount() {
        this.props.apiGetCodex();
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
        const categories = this.renderCategories(codex);
        console.log(codex)
        return (
            <div>
                <h1>Lookup Page</h1>
                {categories}
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch:any) => ({
    apiGetCodex: () => dispatch(apiGetCodex())
})

export default connect(CodexReducer, mapDispatchToProps)(LookupPage);