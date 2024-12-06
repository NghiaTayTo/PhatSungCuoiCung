import React from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import HomeUser from '../pages/Home/HomeUser';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Register from '../pages/Login/Register';
import Login from '../pages/Login/SignIn';
import ShoppingCart from '../pages/Cart/HomeCart';
import CheckOut from '../pages/Cart/CheckOut';
import ResetPassword from '../pages/Login/ForgotPass';
import ProfileUser from '../pages/ProfileUser/ProfileUser';
import AddressUser from '../pages/ProfileUser/AddressUser';
import ChangePassword from '../pages/ProfileUser/ChangePass';
import DonHang from '../pages/Cart/Donhang';
import RegisterSeller from '../pages/Seller/ResgisterSeller';
import RechargeForm from '../pages/Wallet/wallet';
import HomeUserIndex from '../pages/Home/HomeUserIndex';
import StorePage from '../pages/Home/PageSeller';

const User = () => {
    return (
        <div>
            <Routes>
                <Route path="HomeUser" element={<HomeUser />} />
                <Route path='shopping' element={<ShoppingCart />} />
                <Route path='checkout' element={<CheckOut />} />
                <Route path="ProductDetail/:id" element={<ProductDetail />} />
                <Route path='Register' element={<Register />} />
                <Route path='login' element={<Login />} />
                <Route path='profile-user' element={<ProfileUser />} />
                <Route path='address' element={<AddressUser />} />
                <Route path='change-pass' element={<ChangePassword />} />
                <Route path='donhang' element={<DonHang />} />
                <Route path='sellerRegister' element={<RegisterSeller />} />
                <Route path='wallet' element={<RechargeForm />} />
                <Route path='HomeUserIndex' element={<HomeUserIndex />} />
                <Route path='PageSeller/:id_cua_hang' element={<StorePage />} />
                <Route path='forgot-password' element={<ResetPassword />} />
            </Routes>
        </div>
    );
};

export default User;