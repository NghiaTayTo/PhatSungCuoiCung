import React, { useState } from 'react';
import { updateCuaHangAdmin } from '../API/StoreAPI';
import NotificationUI from '../Notification/NotificationUI';

const SolanaForm = ({ store, onClose }) => {

    const [dia_chi_sol, setDia_chi_sol] = useState(store.dia_chi_vi_sol);

    // * Hiển thị thông báo
    const [notificationStatus, setNotificationStatus] = useState('');
    const [closeNotification, setCloseNotification] = useState(true);

    // *Hàm close notification
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    const handleChangeInput = (e) => {
        setDia_chi_sol(e.target.value);
    }

    const handleAddPhantom = async () => {
        try {
            const shopDataUpdate = {
                ...store,
                dia_chi_vi_sol: dia_chi_sol
            }
            const data = await updateCuaHangAdmin(shopDataUpdate);
            if (data) {
                setNotificationStatus('updateIsSuccess');
                window.location.reload();
            }
        } catch (e) {
            setNotificationStatus('updateIsFail');
            console.log(e);
        }
    }

    return (
        <div className="bg_black">
            <div className="modal-box" id="box">
                <div className="modal-content">
                    <h4 className="modal-content_h4">Thêm địa chỉ ví Phantom</h4>
                    <p>Khi cập nhật địa chỉ ví Phantom, bạn có thể tạo sản phẩm mới và cho phép khách hàng của bạn thanh toán bằng tiền điện tử SOLANA - SOL</p>
                    <input
                        onChange={handleChangeInput}
                        value={dia_chi_sol}
                        placeholder='Nhập địa chỉ ví Phantom'
                    />
                    <div className="modal-btn">
                        <button onClick={onClose}>Hủy</button>
                        <button onClick={handleAddPhantom}>Cập nhật</button>
                    </div>
                </div>
            </div>

            {notificationStatus === 'updateIsSuccess' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="success"
                        title={'Thêm địa chỉ ví Phantom'}
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
                        title={'Thêm địa chỉ ví Phantom'}
                        description={`"Thất bại."`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
        </div>
    );
};

export default SolanaForm;