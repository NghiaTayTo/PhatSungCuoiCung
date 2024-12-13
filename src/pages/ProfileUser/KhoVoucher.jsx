import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../utils/Order/Loading';

const KhoVoucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm fetch dữ liệu từ API
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/save-voucher', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setVouchers(response.data); // Lưu dữ liệu từ API vào state
            } catch (error) {
                console.error('Error fetching vouchers:', error);
            } finally {
                setLoading(false); // Tắt trạng thái loading
            }
        };

        fetchVouchers();
    }, []);

    if(loading){
        <Loading />
    }

    return (
        <div>
            <div className="voucher-user">
                <h2>Kho Voucher</h2>
                <div className="voucher-user_list">
                    {vouchers.length === 0 ? (
                        <p>Không có voucher nào được lưu.</p>
                    ) : (
                        vouchers.map((voucher, index) => (
                            <div key={index} className="voucher-user_item">
                                <img src="/images/zutee.jpg" alt="Voucher" />
                                <div className="voucher-user_item_info">
                                    <p>{voucher.voucher?.ten_voucher || 'Tên voucher không xác định'}</p>
                                    <p>Giảm ₫ {voucher.voucher?.giam_gia || 0}</p>
                                    <p>Giá tối thiểu ₫ {voucher.voucher?.gia_ap_dung || 0}</p>
                                    <p>HSD: {voucher.voucher?.ngay_het_han || 'Không rõ'}</p>
                                </div>
                                <div className="voucher-user_item_sld">x {voucher.voucher.so_lan_dung || 1}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default KhoVoucher;
