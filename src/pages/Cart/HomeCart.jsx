import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderUser from '../Component/HeaderUser';
import FooterUser from '../Component/FooterUser';
import './HomeCart.css';
import styles from '../Home/HomeUser.module.css';
import { faPlus, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
                    <div className="cart-content_no_product">
                        <p>Giỏ hàng của bạn đang trống.</p>
                        <button onClick={() => navigate('/HomeUserIndex')}>Quay lại trang chủ</button>
                    </div>

                ) : (
                    <>
                        <div className="cart-content-head">
                            <p>Sản phẩm</p>
                            <p>Đơn giá</p>
                            <p>Số lượng</p>
                            <p>Số tiền </p>
                            <p>Thao tác</p>
                        </div>

                        {cart.map(product => (

                            <div key={product.ma_san_pham} className="cart-product">
                                <div className='cart-product-store'>
                                    <p>ZUTEE</p>
                                    <svg viewBox="0 0 16 16" class="shopee-svg-icon AxeMgG"><g fill-rule="evenodd"><path d="M15 4a1 1 0 01.993.883L16 5v9.932a.5.5 0 01-.82.385l-2.061-1.718-8.199.001a1 1 0 01-.98-.8l-.016-.117-.108-1.284 8.058.001a2 2 0 001.976-1.692l.018-.155L14.293 4H15zm-2.48-4a1 1 0 011 1l-.003.077-.646 8.4a1 1 0 01-.997.923l-8.994-.001-2.06 1.718a.5.5 0 01-.233.108l-.087.007a.5.5 0 01-.492-.41L0 11.732V1a1 1 0 011-1h11.52zM3.646 4.246a.5.5 0 000 .708c.305.304.694.526 1.146.682A4.936 4.936 0 006.4 5.9c.464 0 1.02-.062 1.608-.264.452-.156.841-.378 1.146-.682a.5.5 0 10-.708-.708c-.185.186-.445.335-.764.444a4.004 4.004 0 01-2.564 0c-.319-.11-.579-.258-.764-.444a.5.5 0 00-.708 0z"></path></g></svg>
                                </div>
                                <div className='cart-product-form'>
                                    <div className="cart-product-info">
                                        <input
                                            type="checkbox"
                                            checked={product.selected || false}
                                            onChange={() => handleSelectItem(product.ma_san_pham)}
                                        />
                                        <div className="product-details">
                                            <img src={product.anh_san_pham} alt="Book cover" className="product-image2" />
                                            <div>
                                                <h3>{product.ten_san_pham}</h3>
                                                <p>Tác giả: {product.tac_gia}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="product-priceM">
                                        <p>₫{(product.gia).toLocaleString('vi-VN')}</p>
                                        <p>{product.gia_sol || 0}
                                            <img src='/images/solana.png' />
                                        </p>
                                    </div>
                                    <div className="product-quantity">
                                        {/* <button className='buttonCart' onClick={() => handleQuantityChange(product.ma_san_pham, -1)}>-</button>
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
                                        </button> */}
                                        <div className="quantityWrapper" style={{ marginLeft: '20px' }}>
                                            <button
                                                className="quantityBtn"
                                                onClick={() => handleQuantityChange(product.ma_san_pham, -1)}
                                            >
                                                <FontAwesomeIcon className='truhang' icon={faWindowMinimize}></FontAwesomeIcon>
                                            </button>
                                            <input

                                                value={product.so_luong}
                                                min="1"
                                                // onChange={(e) => setQuantity(Number(e.target.value))}
                                                className="quantityInput"
                                                readOnly={true}
                                            />
                                            <button
                                                className="quantityBtn"
                                                onClick={() => handleQuantityChange(product.ma_san_pham, 1)}
                                            >
                                                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                            </button>

                                        </div>
                                    </div>
                                    <div className="product-thanhtien">
                                        <p>₫{(product.gia * product.so_luong).toLocaleString('vi-VN')}</p>
                                        <p>{(product.gia_sol * product.so_luong).toFixed(6)}
                                            <img src='/images/solana.png' />
                                        </p>
                                    </div>
                                    <div className="product-thaotac">
                                        <button
                                            onClick={() => handleRemoveItem(product.ma_san_pham)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="cart-summary">
                            <p>Tổng thanh toán: <span>₫{totalAmount.toLocaleString('vi-VN')}</span></p>
                            <button
                                style={{ fontSize: '16px'}}
                                onClick={handleCheckout}
                                className="checkout-button"
                            >
                                Tiến hành thanh toán
                            </button>
                        </div>
                    </>
                )}
            </div>

            {cart.length === 0 ? (
                <FooterUser />
            ) : (
                <div style={{ height: '200px' }}></div>
            )}

        </div>
    );
};

export default ShoppingCart;