import React, { SFC } from "react";
import { Link } from "react-router-dom";

interface CategoryListProps {
    headline:string,
    items:Array<any>,
}

const CategoryList: SFC<CategoryListProps> = (props) => {
    const { headline, items } = props;
    if (!headline || !items) return null;
    return (
        <div>
            <h2>{headline}</h2>
            {items.map((item:any, i:number) => {
                return (
                    <li key={i}>
                        <Link to={`/game/lookup/${headline}/${item.id ? item.id : i}`}>{item.name}</Link>
                    </li>
                );
            })}
        </div>
    )
}

export default CategoryList;