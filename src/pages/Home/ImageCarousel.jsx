import React, { useState, useEffect } from 'react';
// import './ImageCarousel.css'

const ImageCarousel = () => {
    const images = [
        'https://bookbuy.vn/Res/Images/Album/a068832a-36e5-42f0-9904-cfb3985bf954.jpg?w=880&scale=both&h=320&mode=crop',
        'https://bookbuy.vn/Res/Images/Album/ae6cc50a-1a78-4e6a-912b-fb52b4edab70.jpg?w=880&scale=both&h=320&mode=crop',
        'https://bookbuy.vn/Res/Images/Album/8aee647d-753c-47c4-9c0e-c591563ea3d5.jpg?w=880&scale=both&h=320&mode=crop',
        'https://bookbuy.vn/Res/Images/Album/1b3b3268-841f-4364-83e9-708f1d321735.jpg?w=880&scale=both&h=320&mode=crop'
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        // Set interval to change the image every 2 seconds
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);

        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, [images.length]);

    return (
        <div>
            <img src={images[currentImageIndex]} alt="carousel" />
        </div>
    );
};

export default ImageCarousel;