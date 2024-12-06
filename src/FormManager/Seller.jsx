import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import SidebarSeller from '../Sidebar/SidebarSeller';
import Admin from '../FormManager/Admin';
import Home from '../pages/Home/Home';

import ManageProduct from '../pages/ManageProduct/ManageProduct';
import ManagerOrderNew from '../pages/ManagerOrder/ManagerOrderNew';
import ManagerOrderCancel from '../pages/ManagerOrder/ManagerOrderCancel';
import ManagerOrderReturn from '../pages/ManagerOrder/ManagerOrderReturn';
import ManagerOrderOnDelivery from '../pages/ManagerOrder/ManagerOrderOnDelivery';
import ManagerProductByComment from '../pages/ManagerComment/ManagerProductByComment';
import ManagerOrderDelivered from '../pages/ManagerOrder/ManagerOrderDelivered';
import ManagerVoucher from '../pages/ManagerVoucher/ManagerVoucher';
import BestSellingProducts from '../pages/Statistical/BestSellingProducts';
import OrderStatistics from '../pages/Statistical/OrderStatistics';
import RevenueStatistics from '../pages/Statistical/RevenueStatistics';
import TransactionHistory from '../pages/TransactionHistory/TransactionHistory';
import ManagerCommentDetails from '../pages/ManagerComment/ManagerCommentDetails';
import ManagerBaoCao from '../pages/ManagerComment/ManagerBaoCao';
import SellerChat from '../chat/SellerChat';

const Seller = () => {
    return (
        <div>
            <Header />
            <div style={{ display: 'flex' }}>
                <SidebarSeller />
                <div style={contentStyle}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="manage-product-store" element={<ManageProduct />} />
                        <Route path="orders-new" element={<ManagerOrderNew />} />
                        <Route path="orders-cancel" element={<ManagerOrderCancel />} />
                        <Route path="orders-is-being-delivered" element={<ManagerOrderOnDelivery />} />
                        <Route path="orders-delivered" element={<ManagerOrderDelivered />} />
                        <Route path="orders-return" element={<ManagerOrderReturn />} />
                        <Route path="manage-voucher-store" element={<ManagerVoucher />} />
                        <Route path="manage-comment" element={<ManagerProductByComment />} />
                        <Route path="manager-comment-details" element={<ManagerCommentDetails />} />
                        <Route path="manage-comment-reported" element={<ManagerBaoCao />} />
                        <Route path="best-selling-products" element={<BestSellingProducts />} />
                        <Route path="order-statistics" element={<OrderStatistics />} />
                        <Route path="revenue-statistics" element={<RevenueStatistics />} />
                        <Route path="transaction-history" element={<TransactionHistory />} />
                        <Route path="help" element={<SellerChat />} />
                        <Route path="admin/*" element={<Admin />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

const contentStyle = {
    marginLeft: '130px',
    width: '100%',
    float: 'right',
};

export default Seller;