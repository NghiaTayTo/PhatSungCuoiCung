// src/context/cartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            const cart = JSON.parse(localStorage.getItem(`cart_${user.id_tai_khoan}`)) || [];
            setCartItems(cart);
        }
    }, []);

    const addToCart = (product, quantity) => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) return;

        const cartKey = `cart_${user.id_tai_khoan}`;
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const existingProduct = cart.find(item => item.ma_san_pham === product.ma_san_pham);
        
        if (existingProduct) {
            existingProduct.so_luong += quantity;
        } else {
            cart.push({ ...product, so_luong: quantity });
        }

        localStorage.setItem(cartKey, JSON.stringify(cart));
        setCartItems([...cart]); // Cập nhật state giỏ hàng để đồng bộ hóa
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
