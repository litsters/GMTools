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
    openItems: Array<any>,
    openItemIdx: number
}

class LookupPage extends Component<IPage & LookupPageProps, LookupPageState> {

    constructor(props:any) {
        super(props);
        this.state = {
            filterText: "",
            openItems: [],
            openItemIdx: 0
        }

        this.openItem = this.openItem.bind(this);
    }

    componentDidMount() {
        if (!this.props.codex) this.props.apiGetCodex();
    }

    openItem(item:object) {
        let openItems = this.state.openItems;
        openItems.push(item);

        this.setState({
            openItems,
            openItemIdx: openItems.length - 1
        });
    }

    closeItem(index:number) {
        let openItems = this.state.openItems;
        openItems.splice(index, 1);

        let newIndex = index - 1;
        if (newIndex < 0) newIndex = 0;

        this.setState({
            openItems,
            openItemIdx: newIndex
        });
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
                <CategoryList key={key} headline={key} items={codex[key]}
                    onItemClick={this.openItem}
                />
            );
        });
    }

    renderOpenItem(item:object) {
        if (!item) return null;

        return (
            <MonsterDetails data={item}/>
        );
    }

    render() {
        const { codex } = this.props;
        const { filterText, openItems, openItemIdx } = this.state;
        const filteredCodex = filterText ? this.filterEntries(filterText, codex) : codex;
        const categories = this.renderCategories(filteredCodex);
        const openItem = this.renderOpenItem(openItems[openItemIdx])

        return (
            <div>
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