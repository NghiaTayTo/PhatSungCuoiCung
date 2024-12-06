import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { getDetail } from "../../../utils/API/OrderDetailsAPI";
import Alert from "../../../utils/Order/Alert";
import { getDonHangById } from '../../../utils/API/OrderAPI';

const OrderFormAdmin = ({ onClose, status, statusHeader, orderID }) => {

    // *Hiện thông báo thất bại hay thành công
    const [alert, setAlert] = useState({ message: '', type: '' });
    // * Lưu thông tin đơn hàng chi tiết
    const [orderDetail, setOrderDetail] = useState({});
    const [donHang, setDonHang] = useState({});

    useEffect(() => {

        const fetchData = async () => {
            try {
                const orderDetailData = await getDetail(orderID);
                setOrderDetail(orderDetailData);

                const orderData = await getDonHangById(orderDetailData.don_hang?.ma_don_hang);
                setDonHang(orderData);
            } catch (error) {
                console.log("Lỗi lấy thông tin 1 hóa đơn chi tiết: " + error);
            }
        }

        fetchData();
    }, [orderID])

    const orderRows = () => {
        const rows = [];

        if (orderDetail) {
            rows.push(
                <tr className='order-form_tbody__row'>
                    <td style={{ width: '20px' }}>1</td>
                    <td style={{ width: '120px' }}><img className='order-form_img' src={`${orderDetail.san_pham?.anh_san_pham}`} alt={`${orderDetail.san_pham?.ten_san_pham}`} /></td>
                    <td style={{ width: '170px' }}>{orderDetail.san_pham?.ten_san_pham}</td>
                    <td style={{ width: '100px' }}>{orderDetail.so_luong}</td>
                    <td style={{ width: '120px' }}>{orderDetail.san_pham?.gia?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    <td style={{ width: '120px' }}>{orderDetail.thanh_tien?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                </tr>);
        }
        return rows;
    }


    return (

        <div className="bg_black">
            {alert.message && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ message: '', type: '' })}
                />
            )}
            {
                orderDetail && (
                    <div className="order-form">
                        <div className="addnewbook-header">
                            <h3>Mã đơn hàng: {orderDetail.ma_don_hang_chi_tiet} <span className={status}>{statusHeader}</span></h3>
                            <FontAwesomeIcon onClick={onClose} style={{ cursor: 'pointer' }} className="faXmark" icon={faXmark}></FontAwesomeIcon>
                        </div>
                        {/* table thông tin từng sản phẩm trong đơn hàng */}
                        <h3 style={{ marginTop: '10px' }}>Thông tin đơn hàng:</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '20px' }}>Stt</th>
                                    <th style={{ width: '120px' }}>Hình ảnh</th>
                                    <th style={{ width: '170px' }}>Tên sản phẩm</th>
                                    <th style={{ width: '100px' }}>Số lượng</th>
                                    <th style={{ width: '120px' }}>Giá</th>
                                    <th style={{ width: '120px' }}>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody className='order-form_tbody' style={{ marginTop: '10px' }}>
                                {orderRows()}
                            </tbody>
                        </table>
                        {/* ======================== */}

                        {/* thông tin chi tiết */}
                        <div className="order-form_info">
                            <h3>Ngày đặt hàng: {orderDetail.don_hang?.ngay_tao}</h3>
                            <p style={{ marginTop: '10px' }}>
                                <strong>Người nhận:</strong> {orderDetail.don_hang?.tai_khoan?.ho_ten}
                                <strong style={{ marginLeft: '70px' }}>Số điện thoại: </strong>{orderDetail.don_hang?.tai_khoan?.so_dt}
                            </p>
                            <p><strong>Địa chỉ:</strong> {orderDetail.don_hang?.dia_chi?.ten_dia_chi}</p>
                            <p><strong>Phương thức thanh toán:</strong> Thanh toán khi nhận hàng</p>
                            <p><strong>Phí vận chuyển:</strong> 10.000đ</p>
                            <p><strong>Giảm giá: </strong> 
                            {orderDetail.voucher ? orderDetail.voucher?.giam_gia?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0đ'} {orderDetail.voucher ? orderDetail.voucher?.ten_voucher : ''}</p>
                            <p><strong>Lời nhắn:</strong> {donHang.loi_nhan ? donHang.loi_nhan : 'không có lời nhắn'}</p>
                            {
                                status === 'trahang' && (
                                    <p><strong>Lý do Trả hàng- Hoàn tiền:</strong> Sản phẩm không giống mẫu.</p>
                                )
                            }
                            <p style={{ fontSize: '23px' }}><strong>Tổng tiền:</strong> {orderDetail.thanh_tien?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default OrderFormAdmin;