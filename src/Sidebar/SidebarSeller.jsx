import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import './Sidebar.css'

import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faOutdent, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { faHireAHelper } from '@fortawesome/free-brands-svg-icons';




const SidebarSeller = () => {

    const [openMenu, setOpenMenu] = useState("home"); // Trạng thái lưu mục cha đang được mở
    const [openMenuChild, setOpenMenuChild] = useState(null);

    // Hàm để mở hoặc đóng menu
    const handleMenuClick = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu); // Đóng mục đang mở hoặc mở mục mới
    };

    return (
        <nav className='sidebarStyle'>
            <ul className='listStyle scroll-container2'>
                <li>
                    <Link className={openMenu === "home" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("home")} to="/seller">
                        <FontAwesomeIcon className='mr-5' icon={faStore}></FontAwesomeIcon>
                        Thông tin cửa hàng</Link>
                </li>
                {/* <li>
                    <Link className={openMenu === "info" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("info")} to="/seller/information-store">
                        <FontAwesomeIcon className='mr-5' icon={faShopify}></FontAwesomeIcon>
                        Thông tin cửa hàng</Link>
                </li> */}
                <li>
                    <Link className={openMenu === "manage_product_store" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("manage_product_store")} to="/seller/manage-product-store">
                        <FontAwesomeIcon className='mr-5' icon={faBook}></FontAwesomeIcon>
                        Quản lý sản phẩm</Link>
                </li>
                <li>
                    <Link style={{marginBottom: '12px'}} className={openMenu === "orders" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("orders")}>
                        <FontAwesomeIcon className='mr-5' icon={faFileInvoice}></FontAwesomeIcon>
                        Quản lý đơn hàng
                        <FontAwesomeIcon className='faAngleDown' icon={openMenu === "orders" ? faAngleUp : faAngleDown}></FontAwesomeIcon>

                        <div className='bg_white'>
                            {openMenu === "orders" && (
                                <div className={openMenu === "orders" ? "submenu submenu-open" : "submenu"}>
                                    <Link to="/seller/orders-new" className='submenu-item'>
                                        Đơn hàng mới
                                    </Link>
                                    <Link to="/seller/orders-cancel" className='submenu-item'>
                                        Đơn hàng hủy
                                    </Link>
                                    <Link to="/seller/orders-is-being-delivered" className='submenu-item'>
                                        Đơn hàng đang giao
                                    </Link>
                                    <Link to="/seller/orders-delivered" className='submenu-item'>
                                        Đơn hàng đã giao
                                    </Link>
                                    <Link to="/seller/orders-return" className='submenu-item'>
                                        Trả hàng - Hoàn tiền
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Link>
                </li>

                <li>
                    <Link className={openMenu === "manage-voucher-store" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("manage-voucher-store")} to="/seller/manage-voucher-store">
                        <FontAwesomeIcon className='mr-5' icon={faTicket}></FontAwesomeIcon>
                        Quản lý Voucher</Link>
                </li>

                {/* <li>
                    <Link className={openMenu === "manage-comment" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("manage-comment")} to="/seller/manage-comment">
                        <FontAwesomeIcon className='mr-5' icon={faCommentDots}></FontAwesomeIcon>
                        Đánh giá sản phẩm</Link>
                </li> */}

                <li>
                    <Link style={{marginBottom: '12px'}} className={openMenu === "manage-comment" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("manage-comment")}>
                        <FontAwesomeIcon className='mr-5' icon={faCommentDots}></FontAwesomeIcon>
                        Đánh giá sản phẩm
                        <FontAwesomeIcon className='faAngleDown' icon={openMenu === "manage-comment" ? faAngleUp : faAngleDown}></FontAwesomeIcon>

                        <div className='bg_white'>
                            {openMenu === "manage-comment" && (
                                <div className={openMenu === "manage-comment" ? "submenu submenu-open" : "submenu"}>
                                    <Link to="/seller/manage-comment" className='submenu-item'>
                                        Xem đánh giá
                                    </Link>
                                    <Link to="/seller/manage-comment-reported" className='submenu-item'>
                                        Đánh giá đã báo cáo
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Link>
                </li>

                <li>
                    <Link style={{marginBottom: '12px'}} className={openMenu === "statistical" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("statistical")}>
                        <FontAwesomeIcon className='mr-5' icon={faChartSimple}></FontAwesomeIcon>
                        Thống kê cửa hàng
                        <FontAwesomeIcon className='faAngleDown' icon={openMenu === "statistical" ? faAngleUp : faAngleDown}></FontAwesomeIcon>

                        <div className='bg_white'>
                            {openMenu === "statistical" && (
                                <div className={openMenu === "statistical" ? "submenu submenu-open" : "submenu"}>
                                    <Link to="/seller/best-selling-products" className='submenu-item'>
                                        Sản phẩm bán chạy
                                    </Link>
                                    <Link to="/seller/order-statistics" className='submenu-item '>
                                        Thống kê đơn hàng
                                    </Link>
                                    <Link to="/seller/revenue-statistics" className='submenu-item'>
                                        Thống kê doanh thu
                                    </Link>
                                </div>
                            )}
                        </div>

                    </Link>
                </li>

                <li>
                    <Link className={openMenu === "transaction-history" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("transaction-history")} to="/seller/transaction-history">
                        <FontAwesomeIcon className='mr-5' icon={faClockRotateLeft}></FontAwesomeIcon>
                        Rút tiền</Link>
                </li>

                <li>
                    <Link className={openMenu === "help" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("help")} to="/seller/help">
                        <FontAwesomeIcon className='mr-5' icon={faHireAHelper}></FontAwesomeIcon>
                        Hỗ trợ khách hàng</Link>
                </li>

                <li>
                    <Link className={openMenu === "bankrupt" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("bankrupt")} to="/seller/bankrupt">
                        <FontAwesomeIcon className='mr-5' icon={faOutdent}></FontAwesomeIcon>
                        Đóng cửa hàng</Link>
                </li>

            </ul>
        </nav>
    );
};


export default SidebarSeller;
