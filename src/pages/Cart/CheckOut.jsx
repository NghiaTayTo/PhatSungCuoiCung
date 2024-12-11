import React, { useEffect, useState } from 'react';
import HeaderUser from '../Component/HeaderUser';
import FooterUser from '../Component/FooterUser';
import AddressSelector from './AddressSelector'; // Component chọn địa chỉ
import './CheckOut.css';
import styles from '../Home/HomeUser.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckOut = () => {
    const [checkoutCart, setCheckoutCart] = useState([]);
    const [address, setAddress] = useState(null);
    const [showAddressSelector, setShowAddressSelector] = useState(false); // Điều khiển hiển thị AddressSelector
    const [buyNowProduct, setBuyNowProduct] = useState(null); // Lưu sản phẩm "Mua Ngay"
    const navigate = useNavigate();

    // Load giỏ hàng từ localStorage hoặc sản phẩm "Mua Ngay" từ sessionStorage
    useEffect(() => {
        // Kiểm tra nếu có sản phẩm "Mua Ngay" trong sessionStorage
        const singleProduct = JSON.parse(sessionStorage.getItem('checkoutItem'));
        if (singleProduct) {
            setBuyNowProduct(singleProduct); // Nếu có sản phẩm "Mua Ngay", lưu vào state
            setCheckoutCart([singleProduct]); // Đặt sản phẩm "Mua Ngay" làm giỏ hàng tạm thời
        } else {
            const savedCart = JSON.parse(localStorage.getItem('checkoutCart')) || [];
            setCheckoutCart(savedCart); // Nếu không có "Mua Ngay", sử dụng giỏ hàng
        }

        // Tải địa chỉ mặc định nếu có trong sessionStorage
        const savedAddress = JSON.parse(sessionStorage.getItem('address'));
        if (savedAddress) {
            setAddress(savedAddress);
        }
    }, []);


    



    // Tạo đơn hàng
    // Hàm tạo đơn hàng và trừ tiền
    const totalAmount = checkoutCart.reduce((total, item) => total + item.gia * item.so_luong, 0);
    const shippingFee = checkoutCart.length > 1 ? totalAmount / 10 / checkoutCart.length : totalAmount / 10;
    const grandTotal = totalAmount + (shippingFee * checkoutCart.length);
    const createOrder = async () => {
        const userId = JSON.parse(sessionStorage.getItem('user')).id_tai_khoan;
        const addressId = address?.ma_dia_chi;

        if (!addressId) {
            alert("Vui lòng chọn địa chỉ giao hàng.");
            return;
        }

        // Chi tiết sản phẩm từ giỏ hàng hoặc sản phẩm "Mua Ngay"
        const orderDetails = checkoutCart.map(item => ({
            so_luong: item.so_luong,
            gia: item.gia,
            thanh_tien: grandTotal,
            san_pham: { ma_san_pham: item.ma_san_pham },
            id_voucher: item.voucher || null,
            ma_trang_thai: 11  // Mã trạng thái mặc định hoặc trạng thái đơn hàng ban đầu
        }));

        try {
            
            // Tạo đơn hàng
            const createOrderResponse = await axios.post(
                `http://localhost:8080/api/v1/donhang/create/taikhoan-${userId}/diachi-${addressId}`,
                []
            );

            const orderId = createOrderResponse.data.ma_don_hang;
            console.log('Order created successfully:', createOrderResponse.data);

            // Cập nhật mã đơn hàng cho từng chi tiết đơn hàng
            const orderDetailsWithOrderId = orderDetails.map(detail => ({
                ...detail,
                ma_don_hang: orderId
            }));

            console.log("Order details to be added:", JSON.stringify(orderDetailsWithOrderId, null, 2));
            console.log(orderDetailsWithOrderId)

            // Thêm chi tiết đơn hàng
            const addDetailsResponse = await axios.post(
                `http://localhost:8080/api/v1/donhang/add-details/donhang-${orderId}`,
                orderDetailsWithOrderId
            );

            console.log('Order details added successfully:', addDetailsResponse.data);

            // Trừ tiền từ tài khoản của người dùng
            const totalAmountToDeduct = grandTotal; // Tổng tiền cần trừ (bao gồm phí vận chuyển)

            try {
                const deductMoneyResponse = await axios.post(
                    `http://localhost:8080/api/vi/deductMoney`, // Endpoint mới  
                    null, // Không cần body vì sử dụng query parameters
                    {
                        params: {
                            idVi: `TTTSS${userId}`, // ID tài khoản cần trừ
                            amount: totalAmountToDeduct // Số tiền cần trừ
                        }
                    }
                );
                navigate('/donhang');

            } catch (error) {
                console.error("Lỗi khi trừ tiền:", error.response?.data || error.message);
                alert("Vui lòng kiểm tra số dư!");
            }



            // Điều hướng tới trang đơn hàng


            // Xóa sản phẩm khỏi giỏ hàng hoặc sessionStorage
            if (buyNowProduct) {
                sessionStorage.removeItem('checkoutItem'); // Xóa sản phẩm "Mua Ngay" khỏi sessionStorage
            } else {
                localStorage.removeItem(`cart_${userId}`); // Xóa giỏ hàng sau khi đặt hàng thành công
            }

        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng hoặc thêm chi tiết đơn hàng:', error);
            alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
        }
    };


    // Xử lý khi chọn địa chỉ
    const handleSelectAddress = (selectedAddress) => {
        setAddress(selectedAddress);
        sessionStorage.setItem('address', JSON.stringify(selectedAddress));
        setShowAddressSelector(false);
        console.log(grandTotal)
    };

    return (
        <div className={styles.parent}>
            <HeaderUser />

            <div className="checkout-container">
                <div className="shipping-info">
                    <h3>Địa chỉ nhận hàng</h3>
                    {address ? (
                        <p>{address.ten_dia_chi}</p>
                    ) : (
                        <p>Vui lòng chọn địa chỉ giao hàng.</p>
                    )}
                    <button className="change-button" onClick={() => setShowAddressSelector(true)}>Thay đổi</button>
                </div>

                <div className="order-summary">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkoutCart.map((product, index) => (
                                <tr key={index}>
                                    <td className="product-details">
                                        <img src={product.anh_san_pham} alt="Book cover" className="product-image" />
                                        <div className="product-text">
                                            <h4>{product.ten_san_pham}</h4>
                                        </div>
                                    </td>
                                    <td className="product-price">
                                        {product.gia.toLocaleString('vi-VN')} đ
                                    </td>
                                    <td className="product-quantityC">
                                        {product.so_luong}
                                    </td>
                                    <td className="product-total">
                                        {(product.gia * product.so_luong).toLocaleString('vi-VN')} đ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="additional-info">
                        <textarea placeholder="Lưu ý cho người bán ..."></textarea>
                        <div>
                            <span>Đơn vị vận chuyển:</span>
                            <span>Nhanh</span>
                            <span>{shippingFee.toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div>
                            <span>Được đồng kiểm</span>
                        </div>
                        <div className="order-total">
                            Tổng số tiền: <strong>{grandTotal.toLocaleString('vi-VN')} đ</strong>
                        </div>
                    </div>
                </div>

                <div className="payment-methodC">
                    <h3>Phương thức thanh toán</h3>
                    <div className="payment-details">
                        <span style={{ marginTop: '17px' }}>Thanh toán trực tiếp</span>
                    </div>
                    <div className="summary">
                        <div className="summary-item">
                            <span>Tổng tiền hàng</span>
                            <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
                        </div>
                        {checkoutCart.length == 1 && (
                            <div className="summary-item">
                            <span>Phí vận chuyển</span>
                            <span>{shippingFee.toLocaleString('vi-VN')} đ</span>
                        </div>
                        )}
                        {checkoutCart.length > 1 && (
                            <div className="summary-item">
                            <span>Phí vận chuyển mỗi đơn</span>
                            <span>{shippingFee.toLocaleString('vi-VN')} đ</span>
                        </div>
                        )}
                        <div className="summary-item grand-total">
                            <span>Tổng thanh toán</span>
                            <strong>{grandTotal.toLocaleString('vi-VN')} đ</strong>
                        </div>
                        <button onClick={createOrder} className="place-order-button">Đặt hàng</button>
                    </div>
                </div>
            </div>

            <FooterUser />

            {showAddressSelector && (
                <AddressSelector
                    onSelectAddress={handleSelectAddress}
                    onClose={() => setShowAddressSelector(false)}
                />
            )}
        </div>
    );
};


export default CheckOut;