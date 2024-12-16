import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../utils/Order/Loading';

const KhoVoucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userID, setUserID] = useState(null);


    // Hàm fetch dữ liệu từ API
    useEffect(() => {
        
        const fetchVouchers = async () => {
            const storedUser = await JSON.parse(sessionStorage.getItem('user'));
        if (storedUser) {
            setUserID(storedUser.id_tai_khoan);
        }
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/save-voucher/get-${userID}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setVouchers(response.data); // Lưu dữ liệu từ API vào state
                console.log(userID)
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
                        <p style={{fontSize: '20px', color: 'red'}}>Không có voucher nào được lưu. {userID}</p>
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
