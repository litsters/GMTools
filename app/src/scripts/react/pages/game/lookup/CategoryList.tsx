import React, { SFC } from "react";

interface CategoryListProps {
    headline:string,
    items:Array<any>
}

const CategoryList: SFC<CategoryListProps> = (props) => {
    const { headline, items } = props;
    if (!headline || !items) return null;
    return (
        <div>
            <h2>{headline}</h2>
            {items.map((item:any, i:number) => {
                console.log(item)
                return (
                    <li key={i}>{item.name}</li>
                );
            })}
        </div>
    )
}

export default CategoryList;