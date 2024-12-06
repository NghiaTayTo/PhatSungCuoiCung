import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderUser from '../Component/HeaderUser';
import FooterUser from '../Component/FooterUser';
import './HomeCart.css';
import styles from '../Home/HomeUser.module.css';

const ShoppingCart = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            const cartKey = `cart_${user.id_tai_khoan}`;
            const savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
            setCart(savedCart);
        }
    }, []);

    const updateCartInLocalStorage = (updatedCart) => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const cartKey = `cart_${user.id_tai_khoan}`;
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    };

    const handleQuantityChange = (productId, change) => {
        const updatedCart = cart.map((item) => {
            if (item.ma_san_pham === productId) {
                const newQuantity = item.so_luong + change;
                if (newQuantity > 0) {
                    return { ...item, so_luong: newQuantity };
                }
            }
            return item;
        });
        setCart(updatedCart);
        updateCartInLocalStorage(updatedCart);
    };

    const handleRemoveItem = (productId) => {
        const updatedCart = cart.filter(item => item.ma_san_pham !== productId);
        setCart(updatedCart);
        updateCartInLocalStorage(updatedCart);
    };

    const handleSelectItem = (productId) => {
        const updatedCart = cart.map(item =>
            item.ma_san_pham === productId ? { ...item, selected: !item.selected } : item
        );
        setCart(updatedCart);
        updateCartInLocalStorage(updatedCart);
    };

    const handleCheckout = () => {
        const selectedItems = cart.filter(item => item.selected); // Lấy các sản phẩm được chọn
        if (selectedItems.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
            return;
        }

        const user = JSON.parse(sessionStorage.getItem('user'));
        const cartKey = `cart_${user.id_tai_khoan}`;

        localStorage.setItem('checkoutCart', JSON.stringify(selectedItems)); // Lưu sản phẩm tick vào localStorage
        navigate('/checkout'); // Điều hướng đến trang Checkout
    };

    // Tính tổng tiền chỉ cho các sản phẩm được tick
    const totalAmount = cart
        .filter(item => item.selected) // Chỉ tính những sản phẩm được tick
        .reduce((total, item) => total + item.gia * item.so_luong, 0);

    return (
        <div className={styles.parent}>
            <HeaderUser />

            <div className="cart-content">
                {cart.length === 0 ? (
                    <p>Giỏ hàng của bạn đang trống.</p>
                ) : (
                    <>
                        {cart.map(product => (
                            <div key={product.ma_san_pham} className="cart-product">
                                <input
                                    type="checkbox"
                                    checked={product.selected || false}
                                    onChange={() => handleSelectItem(product.ma_san_pham)}
                                />
                                <div className="product-details">
                                    <img src={product.anh_san_pham} alt="Book cover" className="product-image" />
                                    <div>
                                        <h3>{product.ten_san_pham}</h3>
                                        <p>Tác giả: {product.tac_gia}</p>
                                    </div>
                                </div>
                                <div className="product-price">
                                    {(product.gia * product.so_luong).toLocaleString('vi-VN')} đ
                                </div>
                                <div className="product-quantity">
                                    <button className='buttonCart' onClick={() => handleQuantityChange(product.ma_san_pham, -1)}>-</button>
                                    <input
                                        type="number"
                                        style={{ width: '45px', height: '35px', border: 'none', padding: '5px' }}
                                        value={product.so_luong}
                                        readOnly
                                    />
                                    <button
                                        className='buttonCart'
                                        style={{ marginRight: '10px' }}
                                        onClick={() => handleQuantityChange(product.ma_san_pham, 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    style={{ width: '45px', height: '35px', border: 'none', padding: '5px' }}
                                    onClick={() => handleRemoveItem(product.ma_san_pham)}
                                >
                                    XÓA
                                </button>
                            </div>
                        ))}
                        <div className="cart-summary">
                            <p>Tổng tiền hàng: {totalAmount.toLocaleString('vi-VN')} đ</p>
                            <button
                                style={{ fontSize: '16px' }}
                                onClick={handleCheckout}
                                className="checkout-button"
                            >
                                Tiến hành thanh toán
                            </button>
                        </div>
                    </>
                )}
            </div>

            <FooterUser />
        </div>
    );
};

export default ShoppingCart;