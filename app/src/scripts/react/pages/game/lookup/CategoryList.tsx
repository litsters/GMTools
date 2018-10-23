import React, { SFC } from "react";

interface CategoryListProps {
    headline:string,
    items:Array<any>,
    onItemClick:any
}

const CategoryList: SFC<CategoryListProps> = (props) => {
    const { headline, items, onItemClick } = props;
    if (!headline || !items) return null;
    return (
        <div>
            <h2>{headline}</h2>
            {items.map((item:any, i:number) => {
                return (
                    <li key={i} onClick={onItemClick.bind(null, item)}>{item.name}</li>
                );
            })}
        </div>
    )
}

export default CategoryList;