import React, { useEffect, useState } from 'react';

import './FormVisibleAll.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Notification from '../Notification/Notification';
import PrintBill from './PrintBill';

import { getInfoOfOrderDetailById, updateOrderDetailStatus } from "../../utils/API/OrderDetailsAPI";
import Alert from "../../utils/Order/Alert";
import { getDonHangById } from '../API/OrderAPI';

const OrderForm = ({ listOrders, onClose, onCancel, onApply, onPrintBill, status, statusHeader, orderID }) => {

    // *Hiện thông báo thất bại hay thành công
    const [alert, setAlert] = useState({ message: '', type: '' });
    // * In hóa đơn
    const [isPrintBill, setIsPrintBill] = useState(false);
    // * Lưu thông tin đơn hàng chi tiết
    const [orderDetail, setOrderDetail] = useState({});
    const [donHang, setDonHang] = useState({});

    useEffect(() => {

        const fetchData = async () => {
            try {
                const orderDetailData = await getInfoOfOrderDetailById(orderID);
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

    // * Thông báo khi bấm nút hủy đơn hàng
    const [thongBaoHuyDon, setThongBaoHuyDon] = useState(false);
    // * * ẩn hiện form thông báo hủy đơn
    const handleShowCancelOrder = () => {
        setThongBaoHuyDon(true);
    };
    const handleCloseCancelOrder = () => {
        setThongBaoHuyDon(false);
    };
    const handleApplyCancelOrder = () => {
        alert('Close order' + orderID)
    }

    // * Thông báo khi bấm nút xác nhận đơn hàng
    const [thongBaoXacNhanDatHang, setThongBaoXacNhanDatHang] = useState(false);
    // * * ẩn hiện form thông báo xác nhận đơn hàng
    const handleShowApplyOrder = () => {
        setThongBaoXacNhanDatHang(true);
    };
    const handleCloseApplyOrder = () => {
        setThongBaoXacNhanDatHang(false);
    };
    const handleApplyApplyOrder = () => {
        handleUpdateOrderStatus();
    }

    // * Thông báo khi bấm nút hủy yêu cầu trả hàng
    const [thongBaoHuyTraHang, setThongBaoHuyTraHang] = useState(false);
    // * * ẩn hiện form thông báo Hủy yêu cầu trả hàng
    const handleShowThongBaoHuyTraHang = () => {
        setThongBaoHuyTraHang(true);
    };
    const handleCloseThongBaoHuyTraHang = () => {
        setThongBaoHuyTraHang(false);
    };
    const handleApplyThongBaoHuyTraHang = () => {
        handleUpdateOrderStatus();
    }

    // * Thông báo khi bấm nút xác nhận yêu cầu trả hàng
    const [thongBaoXacNhanTraHang, setThongBaoXacNhanTraHang] = useState(false);
    // * * ẩn hiện form thông báo Xác nhận yêu cầu trả hàng
    const handleShowXacNhanThongBaoHuyTraHang = () => {
        setThongBaoXacNhanTraHang(true);
    };
    const handleCloseXacNhanThongBaoHuyTraHang = () => {
        setThongBaoXacNhanTraHang(false);
    };
    const handleApplyXacNhanThongBaoHuyTraHang = () => {
        handleUpdateOrderStatus();
    }

    // * Hàm cập nhật order
    const handleUpdateOrderStatus = async (maTrangThai) => {
        try {
            const orderDataUpdate = { ...orderDetail, trang_thai: {
                ma_trang_thai: maTrangThai
            } };
            const data = await updateOrderDetailStatus(orderDataUpdate);

            setThongBaoHuyDon(false);
            setThongBaoXacNhanDatHang(false);
            setThongBaoHuyTraHang(false);
            setThongBaoXacNhanTraHang(false);
            
            console.log('Update trạng thái:', data);
    
            if(data){
                setAlert({ message: 'Trạng thái đơn hàng đã được cập nhật thành công!', type: 'success' });
                window.location.reload();
            }else{
                setAlert({ message: 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.', type: 'error' });
            }
    
        } catch (error) {
            setAlert({ message: 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.', type: 'error' });
            console.log('Lỗi test'+error);
            
        }
    }
    

    //* hiện form printbill
    const handleShowPrintBill = () => {
        setIsPrintBill(true);

    }
    const handleClosePrintBill = () => {
        setIsPrintBill(false);

    }
    const handleApplyPrintBill = () => {

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

                        {/* button */}
                        <div className="order-form_button">
                            {
                                status === 'xacnhan' && (
                                    <>
                                        <button onClick={handleShowCancelOrder}>Hủy đơn</button>
                                        <button onClick={handleShowApplyOrder}>Xác nhận đặt hàng</button>
                                        <button onClick={handleShowPrintBill}>In hóa đơn</button>
                                    </>
                                )
                            }
                            {
                                status === 'trahang' && (
                                    <>
                                        <button onClick={handleShowThongBaoHuyTraHang}>Hủy yêu vầu</button>
                                        <button onClick={handleShowXacNhanThongBaoHuyTraHang}>Xác nhận trả hàng</button>
                                    </>
                                )
                            }
                        </div>
                    </div>
                )
            }

            {
                thongBaoXacNhanDatHang && status === 'xacnhan' && (
                    <Notification
                        title={'Xác nhận đơn hàng'}
                        content1={'Khi bấm xác nhận đồng nghĩa với việc bạn thông báo cho khách hàng biết rằng: “Sản phẩm đã được đóng gói và chuyển giao cho dịch vụ vận chuyển"'}
                        onClose={handleCloseApplyOrder}
                        onApply={() => handleUpdateOrderStatus(12)} />
                )
            }
            {
                thongBaoHuyDon && status === 'xacnhan' && (
                    <Notification
                        title={'Hủy đơn hàng'}
                        content1={'Bạn chắc chắn muốn hủy đơn hàng này?'}
                        onClose={handleCloseCancelOrder}
                        onApply={() => handleUpdateOrderStatus(16)} />
                )
            }
            {
                thongBaoHuyTraHang && status === 'trahang' && (
                    <Notification
                        title={'Hủy yêu cầu Trả hàng - hoàn tiền'}
                        content1={'Khi bấm xác nhận đồng nghĩa với việc bạn thông báo cho khách hàng biết rằng: “Tôi đồng ý với yêu cầu Trả hàng - Hoàn tiền."'}
                        onClose={handleCloseThongBaoHuyTraHang}
                        onApply={() => handleUpdateOrderStatus(18)} />
                )
            }
            {
                thongBaoXacNhanTraHang && status === 'trahang' && (
                    <Notification
                        title={'Xác nhận Trả hàng - Hoàn tiền'}
                        content1={'Khi bấm xác nhận đồng nghĩa với việc bạn thông báo cho khách hàng biết rằng: “Tôi đồng ý với yêu cầu Trả hàng - Hoàn tiền."'}
                        onClose={handleCloseXacNhanThongBaoHuyTraHang}
                        onApply={() => handleUpdateOrderStatus(17)} />
                )
            }
            {
                isPrintBill && (
                    <PrintBill listOrder={orderDetail} onClose={handleClosePrintBill} onApply={handleApplyPrintBill} />
                )
            }
        </div>
    );
};

export default OrderForm;