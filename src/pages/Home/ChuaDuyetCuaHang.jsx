import React, { useState, useEffect } from 'react';
import { StoreApi } from '../../StoreId';
import { getCuaHangByIdAdmin, updateCuaHangAdmin } from '../../utils/API/StoreAPI';
import NotificationUI from '../../utils/Notification/NotificationUI';

const ChuaDuyetCuaHang = ({ text1, text2, keyBtnKhoa, keyBtnDuyet }) => {

    const [store, setStore] = useState({});

    // * Hàm xóa sản phẩm
    const [notificationStatus, setNotificationStatus] = useState('');
    const [closeNotification, setCloseNotification] = useState(true);
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    const handleUpdateTrangThaiCuaHang = async (key) => {
        let trangThai = 0;
        if (key === 0) {
            trangThai = 11;
        } else if (key === 1) {
            trangThai = 15;
        }
        try {
            const dataUpdate = {
                ...store,
                trang_thai_cua_hang: {
                    ma_trang_thai_cua_hang: trangThai
                }
            }
            const response = await updateCuaHangAdmin(dataUpdate);
            if (response) {
                setNotificationStatus('updateIsSuccess');
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
            setNotificationStatus('updateIsFail');
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storeID = await StoreApi();
                if (!storeID) {
                    throw new Error('Store ID is not available');
                }

                const data = await getCuaHangByIdAdmin(storeID);
                setStore(data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [])

    return (
        <div>
            <div className='chuaduyetcuahang'>
                <img src='./images/bookstore.png' alt='bookstore' />
                <h2>{text1}</h2>
                <h2 style={{ marginTop: '10px' }}>{text2}</h2>
                {
                    keyBtnDuyet === true && (
                        <button onClick={() => handleUpdateTrangThaiCuaHang(0)} className='btn_trangthai'>Gửi yêu cầu</button>
                    )
                }
                {
                    keyBtnKhoa === true && (
                        <button onClick={() => handleUpdateTrangThaiCuaHang(1)} className='btn_trangthai'>Gửi yêu cầu</button>
                    )
                }
            </div>

            {notificationStatus === 'updateIsSuccess' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="success"
                        title="Gửi yêu cầu"
                        description={`"Thành công."`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
            {notificationStatus === 'updateIsFail' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="error"
                        title="Gửi yêu cầu"
                        description={`"Thất bại."`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
        </div>

    );
};

export default ChuaDuyetCuaHang;