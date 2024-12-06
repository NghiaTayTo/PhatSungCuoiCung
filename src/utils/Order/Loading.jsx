import React from 'react';

import './Order.css'

const Loading = () => {
    const listItems = [];
    for (let n = 0; n < 18; n++) {
        listItems.push(<li key={n}>{n}</li>);
    }
    return (
        <div className="loading-bg">
            <div id="loader">
                <div id="shadow"></div>
                <div id="box-load"></div>
            </div>
        </div>

    );
};

export default Loading;