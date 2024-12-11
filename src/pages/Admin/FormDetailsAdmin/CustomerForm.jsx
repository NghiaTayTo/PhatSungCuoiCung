import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

import './FormDetailsAdmin.css';
import { getCustomerById, updateCustomer } from '../../../utils/API/CustomerAPI';
import { Transgender } from '@mui/icons-material';
import NotificationUI from '../../../utils/Notification/NotificationUI';

const CustomerForm = ({ customerID, status, onClose }) => {

    const [customer, setCustomer] = useState({});
    // * Hiển thị thông báo
    const [notificationStatus, setNotificationStatus] = useState('');
    const [closeNotification, setCloseNotification] = useState(true);

    // *Hàm close notification
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    const handleReturnDiemViPham = () => {
        const diem = customer.tong_diem_vi_pham;
        if (diem < 10) {
            return 'An toàn'
        } else if (12 < diem && diem < 20) {
            return 'Cảnh báo';
        } else if (diem >= 20) {
            return 'Nguy hiểm';
        }
    }

    const handleReturnCss = () => {
        const diem = customer.tong_diem_vi_pham;
        if (diem < 10) {
            return 'note-color-green'
        } else if (12 < diem && diem < 20) {
            return 'note-color-yellow';
        } else if (diem >= 20) {
            return 'note-color-red';
        }
    }

    const handleUpdateTrangThaiTk = async (key) => {
        try {
            let diem = 0;
            let moKhoa;
            if (key === false) {
                diem = 0;
                moKhoa = false;
            } else {
                diem = customer.tong_diem_vi_pham;
                moKhoa = false
            }

            const dataUpdateTrangThaiTk = {
                ...customer,
                trang_thai_tk: key,
                mo_khoa: moKhoa,
                tong_diem_vi_pham: diem
            }
            const response = await updateCustomer(dataUpdateTrangThaiTk);
            if (response) {
                setCloseNotification(true);
                setNotificationStatus('updateIsSuccess');
                window.location.reload();
            }
        } catch (e) {
            setCloseNotification(true);
            setNotificationStatus('updateIsFail');
            console.log(e);
        }


    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCustomerById(customerID);
                setCustomer(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [customerID]);

    return (
        <div>
            <div className="bg_black">
                <div className="addnewbook customer-form-heigth">
                    <div className="addnewbook-header customer-form-header">
                        <div>
                            <h3>Thông tin khách hàng</h3>
                            <p className={`title-customer ${status ? 'khoa' : 'conhang'}`}>{status ? 'Vô hiệu hóa' : 'Hoạt động'}</p>
                        </div>
                        <FontAwesomeIcon
                            onClick={onClose}
                            style={{ cursor: 'pointer' }} className="faXmark" icon={faXmark}></FontAwesomeIcon>
                    </div>

                    <div className='customer-form'>
                        <div className='customer-form-img'>
                            <img className={status ? 'shadow-no' : 'shadow-ok'} src='/images/avtadmin.jpg' alt='customer' />
                        </div>
                        <div className='customer-form-info'>
                            <div className='customer-form-info_col'>
                                <div className='customer-form-info_col_item'>
                                    <label>Tên tài khoản</label>
                                    <input disabled
                                        value={customer.ho_ten}
                                    />
                                </div>
                                <div className='customer-form-info_col_item'>
                                    <label>Email</label>
                                    <input disabled value={customer.email} />
                                </div>
                                <div className='customer-form-info_col_item'>
                                    <label>Số điện thoại</label>
                                    <input disabled value={customer.so_dt} />
                                </div>
                            </div>
                            <div className='customer-form-info_col'>
                                <div className='customer-form-info_col_item'>
                                    <label>Ngày sinh</label>
                                    <input disabled value={customer.ngay_sinh} />
                                </div>
                                <div className='customer-form-info_col_item'>
                                    <label>Vai trò</label>
                                    <input disabled value={customer.vai_tro?.ma_vai_tro === 2 ? 'Người bán, Người dùng' : 'Người dùng'} />
                                </div>
                                <div className='customer-form-info_col_item'>
                                    <label>Ngày tạo</label>
                                    <input disabled value={customer.ngay_tao} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='customer-form-footter'>
                        <div className={`customer-form-note ${handleReturnCss()}`}>
                            <p>Điểm vi phạm: {customer.tong_diem_vi_pham} - {handleReturnDiemViPham()}</p>
                        </div>
                        <div className='customer-form-btn'>
                            <button className='customer-form-btn_out' onClick={onClose}>Thoát</button>
                            {
                                status && (
                                    <button className='customer-form-btn_lock' onClick={() => handleUpdateTrangThaiTk(false)}>Mở khóa tài khoản</button>
                                )
                            }
                            {
                                customer.tong_diem_vi_pham >= 24 && customer.trang_thai_tk === false && (
                                    <button className='customer-form-btn_lock' onClick={() => handleUpdateTrangThaiTk(true)}>Khóa tài khoản</button>
                                )
                            }
                        </div>
                    </div>

                </div>
                {notificationStatus === 'updateIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title={'Cập nhật tài khoản'}
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
                            title={'Cập nhật tài khoản'}
                            description={`"Thất bại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerForm;