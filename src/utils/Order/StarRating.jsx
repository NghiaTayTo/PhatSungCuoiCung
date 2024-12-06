import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            {[...Array(5)].map((_, index) => (
                <span key={index} style={{ fontSize: '15px', margin: '0 2px', color: 'orange' }}>
                    {index < rating ? <FaStar /> : <FaRegStar />}
                </span>
            ))}
        </div>
    );
};

export default StarRating;
