import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HeaderAdmin from '../Header/HeaderAdmin';
import SidebarAdmin from '../Sidebar/SidebarAdmin';

import HomeAdmin from '../pages/Home/HomeAdmin';
import Category from '../pages/Admin/Category/Category';
import NewBook from '../pages/Admin/ManagerBook/NewBook';
import BookInfringed from '../pages/Admin/ManagerBook/BookInfringed';
import BookDisabled from '../pages/Admin/ManagerBook/BookDisabled';
import UnlockBook from '../pages/Admin/ManagerBook/UnlockBook';
import BookForSale from '../pages/Admin/ManagerBook/BookForSale';
import Customer from '../pages/Admin/Customer/Customer';
import NewStore from '../pages/Admin/Store/NewStore';
import StoreDisabled from '../pages/Admin/Store/StoreDisabled';
import StoreViPham from '../pages/Admin/Store/StoreViPham';
import StoreHoatDong from '../pages/Admin/Store/StoreHoatDong';
import UnClockStore from '../pages/Admin/Store/UnClockStore';
import ManagerStoreDetails from '../pages/Admin/Store/ManagerStoreDetails';
import DonHangMoi from '../pages/Admin/ManagerOrder/DonHangMoi';
import DonHangHuy from '../pages/Admin/ManagerOrder/DonHangHuy';
import DonHangDangGiao from '../pages/Admin/ManagerOrder/DonHangDangGiao';
import DonHangHoanThanh from '../pages/Admin/ManagerOrder/DonHangHoanThanh';
import TraHangHoanTien from '../pages/Admin/ManagerOrder/TraHangHoanTien';
import AllComments from '../pages/Admin/Comments/AllComments';
import ManagerCommentDetailsAdmin from '../pages/Admin/Comments/ManagerCommentDetailsAdmin';
import WithdrawMoney from '../pages/Admin/WithdrawMoney/WithdrawMoney';
import WithdrawMoneySuccess from '../pages/Admin/WithdrawMoney/WithdrawMoneySuccess';
import WithdrawMoneyCacel from '../pages/Admin/WithdrawMoney/WithdrawMoneyCacel';
import BaoCaoDanhGia from '../pages/Admin/Report/BaoCaoDanhGia';
import MoneyStore from '../pages/Admin/Money/MoneyStore';
import MoneyAdmin from '../pages/Admin/Money/MoneyAdmin';
import ManagerStoreDetailsDichVu from '../pages/Admin/Store/ManagerStoreDetailsDichVu';
import CustomerDisabled from '../pages/Admin/Customer/CustomerDisabled';
import P2PNap from '../pages/Admin/Money/P2PNap';
import P2PRut from '../pages/Admin/Money/P2PRut';


const Admin = () => {
    return (
        <div>
            <HeaderAdmin />
            <div style={{ display: 'flex' }}>
                <SidebarAdmin />
                <div style={contentStyle}>
                    <Routes>
                        <Route path="/" element={<HomeAdmin />} />

                        <Route path="manage-category" element={<Category />} />

                        <Route path="new-book" element={<NewBook />} />
                        <Route path="book-infringed" element={<BookInfringed />} />
                        <Route path="book-disabled" element={<BookDisabled />} />
                        <Route path="unlock-book" element={<UnlockBook />} />
                        <Route path="books-for-sale" element={<BookForSale />} />

                        <Route path="my-customers" element={<Customer />} />
                        <Route path="account-disabled" element={<CustomerDisabled />} />

                        <Route path="new-store" element={<NewStore />} />
                        <Route path="violation-store" element={<StoreViPham />} />
                        <Route path="disable-store" element={<StoreDisabled />} />
                        <Route path="unclok-store" element={<UnClockStore />} />
                        <Route path="store-is-operating" element={<StoreHoatDong />} />

                        <Route path="manager-store-details" element={<ManagerStoreDetails />} />
                        <Route path="manager-store-details-phidichvu" element={<ManagerStoreDetailsDichVu />} />

                        <Route path="manager-comment-details" element={<ManagerCommentDetailsAdmin />} />
            
                        <Route path="orders-new" element={<DonHangMoi />} />
                        <Route path="orders-cancel" element={<DonHangHuy />} />
                        <Route path="orders-is-being-delivered" element={<DonHangDangGiao />} />
                        <Route path="orders-delivered" element={<DonHangHoanThanh />} />
                        <Route path="orders-return" element={<TraHangHoanTien />} />

                        <Route path="all-comments" element={<AllComments />} />

                        <Route path="ruttien-new" element={<WithdrawMoney />} />
                        <Route path="ruttien-success" element={<WithdrawMoneySuccess />} />
                        <Route path="ruttien-fail" element={<WithdrawMoneyCacel />} />
                        
                        <Route path="report-comment" element={<BaoCaoDanhGia />} />

                        <Route path="statistical-store" element={<MoneyStore />} />
                        <Route path="statistical-my-money" element={<MoneyAdmin/>} />
                        <Route path="p2p-transaction-nap" element={<P2PNap/>} />
                        <Route path="p2p-transaction-rut" element={<P2PRut/>} />

                        <Route path="report-comment" element={<BaoCaoDanhGia />} />

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

export default Admin;