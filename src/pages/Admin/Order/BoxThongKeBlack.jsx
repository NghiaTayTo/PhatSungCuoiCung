import React from 'react';

const BoxThongKeBlack = ({ action, title, value, image, cursor } ) => {
    return (
        <div onClick={action} className='admin-home-item admin-home-default' style={{cursor: `${cursor}`}}>
            <div>
                <p className='admin-home-item_title'>{title}</p>
                <h1 className='admin-home-item_data'>{value}</h1>
            </div>
            <div>
                <img src={`/images/${image}`} alt='book' />
            </div>
        </div>
    );
};

export default BoxThongKeBlack;