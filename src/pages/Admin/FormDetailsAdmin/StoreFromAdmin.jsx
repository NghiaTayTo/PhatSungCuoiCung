import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { getCuaHangByIdAdmin, updateCuaHangAdmin } from '../../../utils/API/StoreAPI';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import NotificationUI from '../../../utils/Notification/NotificationUI';

const StoreFromAdmin = ({ storeId, onClose, keyForm }) => {

    const [store, setStore] = useState({});
    const [notificationStatus, setNotificationStatus] = useState('');
    const [closeNotification, setCloseNotification] = useState(true);

    // *Hàm close notification
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    const returnTrangThai = (trang_thai) => {
        switch (trang_thai) {
            case 0:
                return "11";
            case 1:
                return "12";
            case 2:
                return "13";
            case 3:
                return "14";
            case 4:
                return "15";
            case 5:
                return "16";
            default:
                return "Trạng thái không xác định";
        }
    };


    // * 0-chờ duyệt, 1-hủy duyệt, 2-duyệt, 3-khoa, 4-yêu cầu mở khóa, 5-hủy yêu cầu mở khóa
    const handleUpdateTrangThaiStore = async (key) => {
        const trang_thai_number = returnTrangThai(key);
        try {
            const dataUpdate = {
                ...store,
                trang_thai_cua_hang: {
                    ma_trang_thai_cua_hang: trang_thai_number
                }
            }
            const data = await updateCuaHangAdmin(dataUpdate);
            if (data) {
                NotificationManager.success('Thành công', 'Duyệt cửa hàng');
                window.location.reload();
            }

        } catch (error) {
            console.error(error);
            NotificationManager.error('Thất bại', 'Duyệt cửa hàng');
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCuaHangByIdAdmin(storeId);
                setStore(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [storeId])

    return (
        <div>
            <div className="bg_black">
                <div className="addnewbook store-form">

                    <div className='store-form-img'>
                        <img src={store.anh_bia} alt='ảnh bìa' />
                    </div>

                    <div className='store-form-img-icon' >
                        <FontAwesomeIcon
                            onClick={onClose}
                            className='store-form-img-icon_css'
                            icon={faXmark} />
                    </div>

                    <div className='store-form-avt'>
                        <img src={store.anh_dai_dien} alt='avatar' />
                    </div>

                    <div className='store-form-info'>
                        <h1>{store.ten_cua_hang}</h1>
                        <p style={{ marginTop: '10px' }}>Email: {store.email}</p>
                        <p>Số điện thoại: {store.so_dien_thoai}</p>
                        <p>Địa chỉ: {store.dia_chi_cua_hang}</p>
                        <div className='store-form-info_account'>
                            <h2 style={{ marginTop: '20px' }}> - Tài khoản đăng ký:</h2>
                            <p style={{ marginTop: '10px' }}>Họ và tên: {store.tai_khoan?.ho_ten}</p>
                            <p>Email: {store.tai_khoan?.email}</p>
                            <p>Số điện thoại: {store.tai_khoan?.so_dt}</p>
                            <p>Ngày tạo: {store.tai_khoan?.ngay_tao}</p>
                        </div>
                    </div>

                    <div className='store-form-info_btn'>
                        {
                            keyForm === 0 && (
                                <>
                                    <button onClick={() => handleUpdateTrangThaiStore(1)}>Hủy duyệt</button>
                                    <button onClick={() => handleUpdateTrangThaiStore(2)}>Xác nhận cửa hàng</button>
                                </>
                            )
                        }
                        {
                            keyForm === 1 && (
                                <>
                                    <button onClick={onClose}>Thoát</button>
                                    <button onClick={() => handleUpdateTrangThaiStore(3)}>Khóa cửa hàng</button>
                                </>
                            )
                        }
                        {
                            keyForm === 2 && (
                                <>
                                    <button onClick={onClose}>Thoát</button>
                                    <button onClick={() => handleUpdateTrangThaiStore(2)}>Mở khóa cửa hàng</button>
                                </>
                            )
                        }
                        {
                            keyForm === 3 && (
                                <>
                                    <button onClick={() => handleUpdateTrangThaiStore(5)}>Hủy yêu cầu mở khóa</button>
                                    <button onClick={() => handleUpdateTrangThaiStore(2)}>Xác nhận mở khóa</button>
                                </>
                            )
                        }

                    </div>

                </div>
            </div>

            <NotificationContainer />

        </div>
    );
};

export default StoreFromAdmin;