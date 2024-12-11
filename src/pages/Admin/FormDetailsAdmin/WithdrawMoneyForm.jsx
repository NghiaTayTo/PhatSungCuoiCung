import React, { useEffect, useState } from 'react';
import { getGiaoDichByID, updateGiaoDich } from '../../../utils/API/GiaoDichAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import NotificationUI from '../../../utils/Notification/NotificationUI';
import { getCuaHangByIdAdmin, updateCuaHangAdmin } from '../../../utils/API/StoreAPI';

const WithdrawMoneyForm = ({ moneyID, onClose }) => {

    const [withdrawMoney, setWithdrawMoney] = useState({});
    const [store, setStore] = useState({});

    // * Hiển thị thông báo
    const [notificationStatus, setNotificationStatus] = useState('');
    const [closeNotification, setCloseNotification] = useState(true);
    // *Hàm close notification
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    const handleUpdateGiaoDich = (trangThai) => {
        const fetchData = async () => {
            try {
                const data = {
                    ...withdrawMoney,
                    trang_thai: trangThai
                }

                if (trangThai === 2) {
                    const doanhThu = withdrawMoney.so_tien + store.doanh_thu;
                    const storeDataUpdate = {
                        ...store,
                        doanh_thu: doanhThu
                    }
                    const storeData = await updateCuaHangAdmin(storeDataUpdate);
                    setStore(storeData);
                }

                const dataUpdate = await updateGiaoDich(data);

                if (dataUpdate && trangThai === 1) {
                    setNotificationStatus('xacNhanIsSuccess');
                    setCloseNotification(true);
                    window.location.reload();
                } else {
                    setNotificationStatus('huyIsSuccess');
                    setCloseNotification(true);
                    window.location.reload();
                }
            } catch (e) {
                setCloseNotification(true);
                if (trangThai === 1) {
                    setNotificationStatus('xacNhanIsSuccess');
                } else {
                    setNotificationStatus('huyIsSuccess');
                }
                console.log("Lỗi khi update giao dịch cửa hàng" + e);
            }
        }
        fetchData();
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getGiaoDichByID(moneyID);
                setWithdrawMoney(data);

                const idStore = data.cua_hang?.ma_cua_hang;
                const storeData = await getCuaHangByIdAdmin(idStore);
                setStore(storeData);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [moneyID]);

    return (
        <div>
            <div className="bg_black">
                <div className="addnewbook qrcode-form">
                    <div className="qrcode-form-store">
                        {
                            store.anh_dai_dien ? (
                                <img src={store.anh_dai_dien} />
                            ) : (
                                <img src='/images/avt_default.png' />
                            )
                        }
                        {
                            store.anh_bia ? (
                                <img src={store.anh_bia} />
                            ) : (
                                <img src='/images/anh_bia_default.jpg' />
                            )
                        }
                        <div className='qrcode-form-store-sdt'>
                            <p>{store.so_dien_thoai}</p>
                            <p>{store.email}dfbndsasdfghfdsasdfds</p>
                        </div>
                        <div className='qrcode-form-store-info'>
                            <h3>{store.ten_cua_hang}</h3>
                            <p style={{marginTop: '25px'}}>Số tiền rút: <span>{withdrawMoney.so_tien?.toLocaleString()}đ</span></p>
                            <p>Ngày giao dịch: <span>{withdrawMoney.ngay_giao_dich}</span></p>
                            <p>Nội dung chuyển khoản: <span>{withdrawMoney.mo_ta}</span></p>
                        </div>

                    </div>

                    <div className="qrcode-form-qr">
                        <img src={withdrawMoney.anh_qr} alt='QR rút tiền' />

                        <button onClick={onClose} className='qrcode-form_x'>
                            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                        </button>

                        {
                            withdrawMoney.trang_thai === 0 ? (
                                <div className='qrcode-form_button'>
                                    <button onClick={() => handleUpdateGiaoDich(2)}>Hủy yêu cầu</button>
                                    <button onClick={() => handleUpdateGiaoDich(1)}>Xác nhận đã chuyển</button>
                                </div>
                            ) : (
                                <></>
                            )
                        }
                    </div>

                </div>
            </div>

            {notificationStatus === 'xacNhanIsSuccess' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="success"
                        title="Xác nhận rút tiền"
                        description={`Thành công.`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
            {notificationStatus === 'xacNhanIsFail' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="error"
                        title="Xác nhận rút tiền"
                        description={`Thất bại.`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
            {notificationStatus === 'huyIsSuccess' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="success"
                        title="Hủy rút tiền"
                        description={`Thành công.`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
            {notificationStatus === 'huyIsFail' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="error"
                        title="Hủy rút tiền"
                        description={`Thất bại.`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}

        </div>
    );
};

export default WithdrawMoneyForm;