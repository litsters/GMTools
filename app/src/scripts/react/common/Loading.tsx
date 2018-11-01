import React, { SFC } from "react";

interface LoadingProps {

}

const Loading: SFC<LoadingProps> = (props) => {
    return (
        <div className="loader">loading</div>
    );
}

export default Loading;