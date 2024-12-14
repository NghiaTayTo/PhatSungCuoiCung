import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VoucherList = ({ visibleFormIndex, index, idCuaHang, onVoucherSelect }) => {
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/save-voucher/${idCuaHang}`);
                setVouchers(response.data);
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };

        fetchVouchers();
    }, [idCuaHang]);

    return (
        <>
            {visibleFormIndex === index && (
                <div className="form_voucher_choose">
                    <h3>ZUTEE</h3>
                    <div className="form_voucher_choose_list">
                        {vouchers.length > 0 ? (
                            vouchers.map((voucher, i) => (
                                <div
                                    key={i}
                                    className="form_voucher_choose_item ticket"
                                    onClick={() => onVoucherSelect(voucher.voucher.giam_gia,index)} // Gửi giá trị giảm giá lên cha
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={voucher.imageUrl || '/images/zutee.jpg'} alt="Voucher" />
                                    <div className="form_voucher_choose_item_info">
                                        <p>Giảm {voucher.voucher.giam_gia || '₫25k'}</p>
                                        <p>Đơn tối thiểu {voucher.voucher.gia_ap_dung || '₫225k'}</p>
                                        <p>Số lần sử dụng: {voucher.voucher.so_lan_dung || '6'}</p>
                                        <p>HSD: {voucher.voucher.ngay_het_han || '21/12/2024'}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Đang tải voucher...</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default VoucherList;
