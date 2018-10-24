import React, { Component } from "react";
import { Link } from "react-router-dom";

interface CategoryListProps {
    headline:string,
    items:Array<any>
}

interface CategoryListState {
    isCollapsed:boolean
}

class CategoryList extends Component<CategoryListProps, CategoryListState> {
    toggleCollapse:any

    constructor(props:CategoryListProps) {
        super(props);
        this.state = {
            isCollapsed: false
        }

        this.toggleCollapse = () => this.setState({isCollapsed: !this.state.isCollapsed});
    }

    render() {
        const { headline, items } = this.props;
        const { isCollapsed } = this.state;
        if (!headline || !items) return null;

        const toggleButton = <span className="category-collapse" onClick={this.toggleCollapse}>{isCollapsed ? "+" : "-"}</span>

        return (
            <div className="category">
                <h2>
                    {headline}
                    {toggleButton}
                </h2>
                <div className={"category-items" + (isCollapsed ? " hidden" : "")}>
                    {items.map((item:any, i:number) => {
                        return (
                            <li key={i}>
                                <Link to={`/game/lookup/${headline}/${item.id ? item.id : i}`}>{item.name}</Link>
                            </li>
                        );
                    })}
                </div>
            </div>
        )
    }
}

export default CategoryList;