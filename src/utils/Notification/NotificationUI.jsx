import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';

// Sử dụng trong component


import "./Notification.css";


const NotificationUI = ({ type, title, description, onClose, keyPage }) => {

    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true); // Kích hoạt hiệu ứng fade-out
            setTimeout(() => {
                onClose(); // Đóng thông báo sau khi hiệu ứng kết thúc
            }, 500); // Thời gian chờ để hoàn thành fade-out
        }, 3000);

        // Dọn dẹp timer khi component unmount
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification notification__${type} ${keyPage} ${fadeOut ? 'fade-out' : 'fade-in'}`}>
            <div className={`notification__left`}>
                {
                    type === 'success'
                        ? <FontAwesomeIcon icon={faCircleCheck} className={`notification__icon__${type}`}></FontAwesomeIcon>
                        : <FontAwesomeIcon icon={faCircleExclamation} className={`notification__icon__error`}></FontAwesomeIcon>
                }
                <div className="notification__content">
                    <div className={`notification__title notification__title__${type}`}>{title}</div>
                    <div className={`notification__description notification__description__${type}`}>{description}</div>
                </div>
            </div>
            <FontAwesomeIcon icon={faXmark} className={`notification__icon__x`} onClick={onClose}></FontAwesomeIcon>
        </div>
    );
};

export default NotificationUI;
