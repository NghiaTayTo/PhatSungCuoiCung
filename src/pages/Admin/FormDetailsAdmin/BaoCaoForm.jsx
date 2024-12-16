import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { getBaoCaoCuaHangById, updateBaoCaoCuaHang } from '../../../utils/API/BaoCaoAPI';

import './FormDetailsAdmin.css';
import NotificationUI from '../../../utils/Notification/NotificationUI';

import { NotificationContainer, NotificationManager } from 'react-notifications';


const BaoCaoForm = ({ baoCaoID, onClose, trangThaiBaoCao }) => {

    const [baoCao, setBaoCao] = useState({});

    // const trangThaiBaoCaoDuyet = {
    //     id_trang_thai_bao_cao: 2,
    //     ten_trang_thai_bao_cao: 'Chưa xem'
    // }
    // const trangThaiBaoCaoHuy = {
    //     id_trang_thai_bao_cao: 3,
    //     ten_trang_thai_bao_cao: 'Không hợp lệ'
    // }

    const handleUpdateBaoCao = async (key) => {
        let dataUpdate = {};
        try {

            if (key === 0) {
                dataUpdate = {
                    ...baoCao,
                    trang_thai_bao_cao: {
                        id_trang_thai_bao_cao: 2
                    }
                };
            } else {
                dataUpdate = {
                    ...baoCao,
                    trang_thai_bao_cao: {
                        id_trang_thai_bao_cao: 3
                    }
                };
            }
            console.log('báo cáo');

            const response = await updateBaoCaoCuaHang(dataUpdate);
            if (response) {
                NotificationManager.success('Thành công', 'Xác nhận báo cáo');
                window.location.reload();
            }
        } catch (e) {
            NotificationManager.error('Thất bại', 'Xác nhận báo cáo');
            console.log(e);
        }
    }

    const [closeNotification, setCloseNotification] = useState(true);
    const [notificationStatus, setNotificationStatus] = useState('');
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    const fetchBaoCaoLai = async () => {
        try {
            const data = await getBaoCaoCuaHangById(baoCaoID);
            setBaoCao(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchBaoCaoLai();
    }, [baoCaoID]);

    return (
        <div>
            <div className="bg_black">
                <div className="addnewbook customer-form-heigth">
                    <div className="addnewbook-header customer-form-header">
                        <div>
                            <h3>Báo cáo đánh giá người dùng: {baoCao.id_bao_cao} | {baoCao.ngay_bao_cao}</h3>
                        </div>
                        <FontAwesomeIcon
                            onClick={onClose}
                            style={{ cursor: 'pointer' }} className="faXmark" icon={faXmark}></FontAwesomeIcon>
                    </div>

                    <div className='baocao_content'>
                        <div className='baocao_content_flex'>
                            <div className='baocao_content_item_store'>
                                <h3 style={{ color: 'gray' }}>Cửa hàng báo cáo</h3>
                                <div className='baocao_content_item_flex'>
                                    <img className='baocao_content_item_store_avt' src={baoCao.cua_hang_bao_cao?.anh_dai_dien} alt="Logo cửa hàng" />
                                    <img className='baocao_content_item_store_bia' src={baoCao.cua_hang_bao_cao?.anh_bia} alt="Ảnh bìa cửa hàng" />
                                    <div className='baocao_content_item_store_content'>
                                        <strong>{baoCao.cua_hang_bao_cao?.ten_cua_hang}</strong>
                                        <p>{baoCao.cua_hang_bao_cao?.email}</p>
                                        <p>0{baoCao.cua_hang_bao_cao?.so_dien_thoai}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='baocao_content_item_user'>
                                <h3 style={{ marginLeft: '20px', color: 'gray' }}>Người dùng bị báo cáo</h3>
                                <div className='baocao_content_item_flex'>
                                    {/* <img className='baocao_content_item_user_img' src={baoCao.tai_khoan_bi_bao_cao?.anh_dai_dien} alt="Ảnh đại diện người dùng" /> */}
                                    <img className='baocao_content_item_user_img' src='/images/fukuda.jpg' alt="Ảnh đại diện người dùng" />
                                    <div className='baocao_content_item_user_content'>
                                        <strong>{baoCao.tai_khoan_bi_bao_cao?.ho_ten}</strong>
                                        <p>{baoCao.tai_khoan_bi_bao_cao?.email}</p>
                                        <p>{baoCao.tai_khoan_bi_bao_cao?.so_dt}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='baocao_text'>
                            <label>Đánh giá của khách hàng:</label>
                            <textarea value={baoCao.danh_gia?.noi_dung_danh_gia} disabled={true}></textarea>
                        </div>

                        <div className='baocao_text'>
                            <label>Nội dung báo cáo của cửa hàng:</label>
                            <textarea
                                value={baoCao.noi_dung_vi_pham ? baoCao.noi_dung_vi_pham : baoCao.vi_pham?.ten_vi_pham}
                                disabled={true}></textarea>
                        </div>

                        {
                            trangThaiBaoCao === 1 && (
                                <div className='baocao_button'>
                                    <button onClick={() => handleUpdateBaoCao(0)} className='baocao_button_yes'>Xác nhận báo cáo là đúng</button>
                                    <button onClick={() => handleUpdateBaoCao(1)} className='baocao_button_no'>Báo cáo không hợp lệ</button>
                                </div>
                            )
                        }

                    </div>

                </div>
            </div>

            <NotificationContainer />

        </div>
    );
};

export default BaoCaoForm;