import React, { useEffect, useState } from "react";

import "./FormVisibleAll.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { getDonHangById } from "../API/OrderAPI";

const PrintBill = ({ listOrder = {}, onClose, onApply }) => {

    const [a, setA] = useState(listOrder.length);

    const getListOrder = () => {
        const rows = [];

        for (let i = 0; i < 1; i++) {
            rows.push(
                <div>
                    <p style={{ width: "55%", textAlign: "left", marginLeft: '7px' }}>
                        {listOrder.san_pham?.ten_san_pham}
                    </p>
                    <p style={{ width: "17%", textAlign: "center" }}>{listOrder.so_luong}</p>
                    <p style={{ width: "28%", textAlign: "center" }}>{listOrder.san_pham ? listOrder.san_pham?.gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0'}</p>
                </div>
            );
        }

        return rows;
    };

    const [donHang, setDonHang] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try{
                const orderData = await getDonHangById(listOrder.don_hang?.ma_don_hang);
                setDonHang(orderData);
            }catch(e){
                console.log(e);
                
            }
        }
        fetchData();
        
    }, [listOrder])

    return (
        <div className="bg_black">
            <div className="print-bill">
                <div className="print-bill_header">
                    <img src="/images/logoBooker.png" alt="booker-logo" />
                    <p>Booker</p>
                </div>

                <p className="print-bill_ship">Giao hàng hỏa tốc</p>

                <div className="print-bill_people">
                    <p>
                        Người gửi: <span>{listOrder.san_pham?.cua_hang?.ten_cua_hang}</span>
                    </p>
                    <p>
                        {listOrder.san_pham?.cua_hang?.dia_chi_cua_hang}
                    </p>
                </div>

                <div className="print-bill_people">
                    <p>
                        Người nhận: <span>{listOrder.don_hang?.tai_khoan?.ho_ten}</span>
                    </p>
                    <strong>{listOrder.don_hang?.tai_khoan?.so_dt}</strong>
                    <p>
                        {listOrder.don_hang?.dia_chi?.ten_dia_chi}
                    </p>
                </div>

                <p className="print-bill_mess">{donHang.loi_nhan ? donHang.loi_nhan : 'không có lời nhắn'}</p>

                <div className="print-bill_info">
                    <h4>Mã đơn hàng: {donHang.ma_don_hang}</h4>
                    <h4>Ngày đặt hàng: {donHang.ngay_tao}</h4>

                    <div className="print-bill_info--title">
                        <div>
                            <p style={{ width: "55%", textAlign: "left", marginLeft: '7px' }}>Sản phẩm</p>
                            <p style={{ width: "17%", textAlign: "center" }}>Số lượng</p>
                            <p style={{ width: "28%", textAlign: "center" }}>Giá</p>
                        </div>
                        <div>{getListOrder()}</div>
                    </div>

                    <div className="print-bill_total">
                        <div className="print-bill_total--title">
                            <h3>Phí vận chuyển: </h3>
                            <h3>Giảm giá: </h3>
                            <h3>Thanh toán:</h3>
                        </div>
                        <div className="print-bill_total--price">
                            <h3>10.000đ</h3>
                            <h3>{listOrder.voucher ? listOrder.voucher?.giam_gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0đ'}</h3>
                            <h3>{listOrder.thanh_tien.toLocaleString('vi-VN')}đ</h3>
                        </div>
                    </div>
                </div>

                <p className="tks">Cảm ơn bạn đã mua hàng, bạn đánh giá 5sao cho shop nhé</p>

                <div className="print-bill_btn">
                    <button onClick={onClose}>
                        <span style={{ marginRight: '14px' }}>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </span>
                        Thoát
                    </button>
                    <button onClick={onApply}>
                        <span style={{ marginRight: '14px' }}>
                            <FontAwesomeIcon icon={faPrint} />
                        </span>
                        In hóa đơn
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrintBill;
