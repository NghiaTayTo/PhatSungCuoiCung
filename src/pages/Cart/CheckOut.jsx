import React, { useEffect, useState } from 'react';
import HeaderUser from '../Component/HeaderUser';
import FooterUser from '../Component/FooterUser';
import AddressSelector from './AddressSelector'; // Component chọn địa chỉ
import './CheckOut.css';
import styles from '../Home/HomeUser.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faComments, faLocationDot } from '@fortawesome/free-solid-svg-icons';

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
            thanh_tien: item.gia * item.so_luong + shippingFee,
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

    const [visibleFormIndex, setVisibleFormIndex] = useState(null);

    const toggleForm = (index) => {
        setVisibleFormIndex(visibleFormIndex === index ? null : index);
    };

    return (
        <div className={styles.parent}>
            <HeaderUser fixed={false}/>

            <div className="checkout-container">
                <div className="shipping-info">
                    <div className="shipping-info-h3">
                        <FontAwesomeIcon className="shipping-info-h3-icon" icon={faLocationDot}></FontAwesomeIcon>
                        <h3>Địa chỉ nhận hàng</h3>
                    </div>
                    {address ? (
                        <div className="shipping-info-location">
                            <span>Trọng Nghĩa - 0972376536</span>
                            <p>{address.ten_dia_chi}</p>
                        </div>

                    ) : (
                        <p>Vui lòng chọn địa chỉ giao hàng.</p>
                    )}
                    <button className="change-button" onClick={() => setShowAddressSelector(true)}>Thay đổi</button>
                </div>

                <div className="order-summary">

                    <div className='product-table'>
                        <div className='product-table-head'>
                            <h3>Sản phẩm</h3>
                            <p>Đơn giá</p>
                            <p>Số lượng</p>
                            <p>Thành tiền</p>
                        </div>
                        <div className='products-list-dathang'>
                            {checkoutCart.map((product, index) => (
                                <div className='item-background-fff'>
                                    <div className='products-list-dathang-store'>
                                        <p>ZUTEE</p>
                                        <span>
                                            <FontAwesomeIcon icon={faComments}></FontAwesomeIcon>
                                            Chat ngay</span>
                                    </div>
                                    <div key={index} className='products-list-dathang-item'>
                                        <div className="product-details">
                                            <img src={product.anh_san_pham} alt="Book cover" className="product-image" />
                                            <div className="product-text">
                                                <h4>{product.ten_san_pham}</h4>
                                            </div>
                                        </div>
                                        <div className="product-price">
                                            <p>{product.gia.toLocaleString('vi-VN')} đ</p>
                                            <span>

                                                {product.gia_sol || 0}
                                                <img src='/images/solana.png' alt='solana icon' /></span>
                                        </div>
                                        <div className="product-quantityC">
                                            <p>{product.so_luong}</p>
                                        </div>
                                        <div className="product-total">
                                            <p>{(product.gia * product.so_luong).toLocaleString('vi-VN')} đ</p>
                                            <span>
                                                {product.gia_sol > 0 ? (product.gia_sol * product.so_luong) : 0}
                                                <img src='/images/solana.png' alt='solana icon' /> </span>
                                        </div>
                                    </div>

                                    <div className="additional-vouchers-list">
                                        <div></div>
                                        <div>
                                            <div className="additional-vouchers-list-svg">
                                                <svg fill="none" viewBox="0 0 23 22" class="shopee-svg-icon icon-voucher-applied-line"><rect x="13" y="9" width="10" height="10" rx="5" fill="#EE4D2D"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M20.881 11.775a.54.54 0 00-.78.019l-2.509 2.765-1.116-1.033a.542.542 0 00-.74.793l1.5 1.414a.552.552 0 00.844-.106l2.82-3.109a.54.54 0 00-.019-.743z" fill="#fff"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M6.488 16.178h.858V14.57h-.858v1.607zM6.488 13.177h.858v-1.605h-.858v1.605zM6.488 10.178h.858V8.572h-.858v1.606zM6.488 7.178h.858V5.572h-.858v1.606z" fill="#EE4D2D"></path><g filter="url(#voucher-filter1_d)"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 4v2.325a1.5 1.5 0 01.407 2.487l-.013.012c-.117.103-.25.188-.394.251v.65c.145.063.277.149.394.252l.013.012a1.496 1.496 0 010 2.223l-.013.012c-.117.103-.25.188-.394.251v.65c.145.063.277.149.394.252l.013.012A1.5 1.5 0 011 15.876V18h12.528a6.018 6.018 0 01-.725-1H2v-.58c.55-.457.9-1.147.9-1.92a2.49 2.49 0 00-.667-1.7 2.49 2.49 0 00.667-1.7 2.49 2.49 0 00-.667-1.7A2.49 2.49 0 002.9 7.7c0-.773-.35-1.463-.9-1.92V5h16v.78a2.494 2.494 0 00-.874 2.283 6.05 6.05 0 011.004-.062A1.505 1.505 0 0119 6.325V4H1z" fill="#EE4D3D"></path></g><defs><filter id="voucher-filter1_d" x="0" y="3" width="20" height="16" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix><feOffset></feOffset><feGaussianBlur stdDeviation=".5"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter></defs></svg>
                                                <p>Voucher của Shop</p>
                                            </div>
                                            <div className="additional-vouchers-choose">
                                                <div className="additional-vouchers-choose-box">
                                                    <p>-<span>₫</span>10k</p>
                                                </div>
                                                <p onClick={() => toggleForm(index)}>Chọn Voucher khác</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="additional-info">
                                        <div className="additional-info-loinhan">
                                            <label>Lời nhắn:</label>
                                            <textarea placeholder="Lưu ý cho người bán ..."></textarea>
                                        </div>
                                        <div className="additional-info-vanchuyen">
                                            <div style={{ padding: '20px' }} >
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <span>Đơn vị vận chuyển:</span>
                                                        <span>Nhanh</span>
                                                    </div>
                                                    <span>{shippingFee.toLocaleString('vi-VN')} đ</span>
                                                </div>
                                                <p>Ước tính nhận hàng trong 3 ngày kể từ ngày đặt hàng</p>

                                            </div>
                                            <div className="additional-info-dongkiem">
                                                <span>Được đồng kiểm</span>
                                            </div>
                                        </div>
                                    </div>

                                    {visibleFormIndex === index && (
                                        <div className='form_voucher_choose'>
                                            <h3>ZUTEE</h3>
                                            <div className='form_voucher_choose_list'>
                                                <div className='form_voucher_choose_item ticket'>
                                                    <img src='/images/zutee.jpg' />
                                                    <div className='form_voucher_choose_item_info'>
                                                        <p>Giảm ₫25k</p>
                                                        <p>Đơn tối thiểu ₫225k</p>
                                                        <p>Số lần sử dụng: 6</p>
                                                        <p>HSD: 21/12/2024</p>
                                                    </div>
                                                </div>
                                                <div className='form_voucher_choose_item ticket'>
                                                    <img src='/images/zutee.jpg' />
                                                    <div className='form_voucher_choose_item_info'>
                                                        <p>Giảm ₫25k</p>
                                                        <p>Đơn tối thiểu ₫225k</p>
                                                        <p>Số lần sử dụng: 6</p>
                                                        <p>HSD: 21/12/2024</p>
                                                    </div>
                                                </div>
                                                <div className='form_voucher_choose_item ticket'>
                                                    <img src='/images/zutee.jpg' />
                                                    <div className='form_voucher_choose_item_info'>
                                                        <p>Giảm ₫25k</p>
                                                        <p>Đơn tối thiểu ₫225k</p>
                                                        <p>Số lần sử dụng: 6</p>
                                                        <p>HSD: 21/12/2024</p>
                                                    </div>
                                                </div>
                                                <div className='form_voucher_choose_item ticket'>
                                                    <img src='/images/zutee.jpg' />
                                                    <div className='form_voucher_choose_item_info'>
                                                        <p>Giảm ₫25k</p>
                                                        <p>Đơn tối thiểu ₫225k</p>
                                                        <p>Số lần sử dụng: 6</p>
                                                        <p>HSD: 21/12/2024</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                </div>

                            ))}
                        </div>
                    </div>


                </div>

                <div className="payment-methodC">
                    <div className="payment-methodC-thanhtoan">
                        <h3>Phương thức thanh toán</h3>
                        <div className="payment-methodC-thanhtoan-method">
                            <div className='payment-methodC-thanhtoan-method-active'>Ví BookerPay</div>
                            <div>Thanh toán VNPay</div>
                            <div>SOLANA - SOL</div>
                        </div>
                    </div>

                    {/* <div className="payment-details">
                        <span style={{ marginTop: '17px' }}>Thanh toán trực tiếp</span>
                    </div> */}
                    <div className="payment-methodC-number">
                        <div></div>
                        <div className="summary">
                            <div className="summary-item">
                                <span>Tổng tiền hàng</span>
                                <span>₫{totalAmount.toLocaleString('vi-VN')}</span>
                            </div>

                            {checkoutCart.length <= 1 ? (
                                <div className="summary-item">
                                    <span>Tổng tiền phí vận chuyển</span>
                                    <span>₫{shippingFee.toLocaleString('vi-VN')}</span>
                                </div>
                            ) : (
                                <div className="summary-item">
                                    <span>Tổng tiền phí vận chuyển</span>
                                    <span>₫{(shippingFee * 2).toLocaleString('vi-VN')}</span>
                                </div>
                            )}

                            <div className="summary-item">
                                <span>Tổng cộng Voucher giảm giá</span>
                                <span>₫{shippingFee.toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="summary-item grand-total">
                                <span>Tổng thanh toán</span>
                                <p>₫{grandTotal.toLocaleString('vi-VN')}</p>
                            </div>
                            <button onClick={createOrder} className="place-order-button">Đặt hàng</button>
                        </div>
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