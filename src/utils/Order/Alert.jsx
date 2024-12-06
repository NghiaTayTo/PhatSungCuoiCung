import React, { useEffect, useState }  from 'react';
import './Order.css';

const Alert = ({ message, type, onClose }) => {

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
        <div className={`alert ${type === 'success' ? 'alert-success' : 'alert-error'} ${fadeOut ? 'fade-out' : 'fade-in'}` }>
            <span>{message}</span>
            <button className="alert-close" onClick={onClose}>&times;</button>
        </div>
    );
};

export default Alert;
