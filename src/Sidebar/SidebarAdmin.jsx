import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import './Sidebar.css'

import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faMoneyBillTransfer, faRectangleAd, faSackDollar, faStore, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faBtc } from '@fortawesome/free-brands-svg-icons';
import { faBook, faHouse, faList, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';


const SidebarAdmin = () => {

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
                    <Link className={openMenu === "home" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("home")} to="/admin">
                        <FontAwesomeIcon className='mr-5' icon={faHouse}></FontAwesomeIcon>
                        Trang chủ</Link>
                </li>
                {/* <li>
                    <Link className={openMenu === "info" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("info")} to="/admin/information-store">
                        <FontAwesomeIcon className='mr-5' icon={faShopify}></FontAwesomeIcon>
                        Thông tin cửa hàng</Link>
                </li> */}
                <li>
                    <Link className={openMenu === "manage-category" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("manage-category")} to="/admin/manage-category">
                        <FontAwesomeIcon className='mr-5' icon={faList}></FontAwesomeIcon>
                        Thể loại sách</Link>
                </li>
                <li>
                    <Link className={openMenu === "manage-banner" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("manage-banner")} to="/admin/manage-banner">
                        <FontAwesomeIcon className='mr-5' icon={faRectangleAd}></FontAwesomeIcon>
                        Quản lý banner</Link>
                </li>
                <li style={{marginBottom: '10px'}}>
                    <Link style={{marginBottom: '12px'}} className={openMenu === "manager-book" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("manager-book")}>
                        <FontAwesomeIcon className='mr-5' icon={faBook}></FontAwesomeIcon>
                        Quản lý sách
                        <FontAwesomeIcon className='faAngleDown' icon={openMenu === "manager-book" ? faAngleUp : faAngleDown}></FontAwesomeIcon>

                        <div className='bg_white'>
                            {openMenu === "manager-book" && (
                                <div className={openMenu === "manager-book" ? "submenu submenu-open" : "submenu"}>
                                    <Link to="/admin/new-book" className='submenu-item'>
                                        Sách mới
                                    </Link>
                                    <Link to="/admin/book-infringed" className='submenu-item'>
                                        Sách bị vi phạm
                                    </Link>
                                    <Link to="/admin/book-disabled" className='submenu-item'>
                                        Sách bị vô hiệu hóa
                                    </Link>
                                    <Link to="/admin/unlock-book" className='submenu-item'>
                                        Mở khóa sách
                                    </Link>
                                    <Link to="/admin/books-for-sale" className='submenu-item'>
                                        Sách đang bán
                                    </Link>
                                    {/* <Link to="/admin/orders-return" className='submenu-item'>
                                        Trả hàng - Hoàn tiền
                                    </Link> */}
                                </div>
                            )}
                        </div>
                    </Link>
                </li>

                {/* <li>
                    <Link className={openMenu === "manage-voucher-store" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("manage-voucher-store")} to="/admin/manage-voucher-store">
                        <FontAwesomeIcon className='mr-5' icon={faTicket}></FontAwesomeIcon>
                        Khách hàng</Link>
                </li> */}
                <li>
                    <Link style={{marginBottom: '12px'}} className={openMenu === "manager-user" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("manager-user")}>
                        <FontAwesomeIcon className='mr-5' icon={faUsers}></FontAwesomeIcon>
                        Khách hàng
                        <FontAwesomeIcon className='faAngleDown' icon={openMenu === "manager-user" ? faAngleUp : faAngleDown}></FontAwesomeIcon>

                        <div className='bg_white'>
                            {openMenu === "manager-user" && (
                                <div className={openMenu === "manager-user" ? "submenu submenu-open" : "submenu"}>
                                    <Link to="/admin/my-customers" className='submenu-item'>
                                        Khách hàng
                                    </Link>
                                    <Link to="/admin/account-disabled" className='submenu-item '>
                                        Yêu cầu mở khóa
                                    </Link>
                                </div>
                            )}
                        </div>

                    </Link>
                </li>

                <li>
                    <Link style={{marginBottom: '12px'}} className={openMenu === "manager-store" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("manager-store")}>
                        <FontAwesomeIcon className='mr-5' icon={faStore}></FontAwesomeIcon>
                        Cửa hàng
                        <FontAwesomeIcon className='faAngleDown' icon={openMenu === "manager-store" ? faAngleUp : faAngleDown}></FontAwesomeIcon>

                        <div className='bg_white'>
                            {openMenu === "manager-store" && (
                                <div className={openMenu === "manager-store" ? "submenu submenu-open" : "submenu"}>
                                    <Link to="/admin/new-store" className='submenu-item'>
                                        Cửa hàng mới
                                    </Link>
                                    <Link to="/admin/violation-store" className='submenu-item '>
                                        Cửa hàng vi phạm
                                    </Link>
                                    <Link to="/admin/disable-store" className='submenu-item '>
                                        Cửa hàng vô hiệu hóa
                                    </Link>
                                    <Link to="/admin/unclok-store" className='submenu-item '>
                                        Mở khóa cửa hàng
                                    </Link>
                                    <Link to="/admin/store-is-operating" className='submenu-item '>
                                        Đang hoạt động
                                    </Link>
                                </div>
                            )}
                        </div>

                    </Link>
                </li>

                <li>
                    <Link style={{marginBottom: '12px'}} className={openMenu === "ruttien" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("ruttien")}>
                        <FontAwesomeIcon className='mr-5' icon={faSackDollar}></FontAwesomeIcon>
                        Yêu cầu rút tiền
                        <FontAwesomeIcon className='faAngleDown' icon={openMenu === "ruttien" ? faAngleUp : faAngleDown}></FontAwesomeIcon>

                        <div className='bg_white'>
                            {openMenu === "ruttien" && (
                                <div className={openMenu === "ruttien" ? "submenu submenu-open" : "submenu"}>
                                    <Link to="/admin/ruttien-new" className='submenu-item'>
                                        Yêu cầu rút tiền mới
                                    </Link>
                                    <Link to="/admin/ruttien-success" className='submenu-item'>
                                        Rút tiền thành công
                                    </Link>
                                    <Link to="/admin/ruttien-fail" className='submenu-item'>
                                        Yêu cầu đã hủy
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Link>
                </li>

                <li>
                    <Link style={{marginBottom: '12px'}} className={openMenu === "orders" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("orders")}>
                        <FontAwesomeIcon className='mr-5' icon={faFileInvoice}></FontAwesomeIcon>
                        Đơn hàng
                        <FontAwesomeIcon className='faAngleDown' icon={openMenu === "orders" ? faAngleUp : faAngleDown}></FontAwesomeIcon>

                        <div className='bg_white'>
                            {openMenu === "orders" && (
                                <div className={openMenu === "orders" ? "submenu submenu-open" : "submenu"}>
                                    <Link to="/admin/orders-new" className='submenu-item'>
                                        Đơn hàng mới
                                    </Link>
                                    <Link to="/admin/orders-cancel" className='submenu-item'>
                                        Đơn hàng hủy
                                    </Link>
                                    <Link to="/admin/orders-is-being-delivered" className='submenu-item'>
                                        Đơn hàng đang giao
                                    </Link>
                                    <Link to="/admin/orders-delivered" className='submenu-item'>
                                        Đơn hàng đã giao
                                    </Link>
                                    <Link to="/admin/orders-return" className='submenu-item'>
                                        Trả hàng - Hoàn tiền
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Link>
                </li>

                {/* <li>
                    <Link className={openMenu === "voucher" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("voucher")} to="/admin/manager-voucher">
                        <FontAwesomeIcon className='mr-5' icon={faTicket}></FontAwesomeIcon>
                        Voucher</Link>
                </li> */}

                <li>
                    <Link style={{marginBottom: '12px'}} className={openMenu === "comments" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("comments")}>
                        <FontAwesomeIcon className='mr-5' icon={faComments}></FontAwesomeIcon>
                        Bình luận sản phẩm
                        <FontAwesomeIcon className='faAngleDown' icon={openMenu === "comments" ? faAngleUp : faAngleDown}></FontAwesomeIcon>

                        <div className='bg_white'>
                            {openMenu === "comments" && (
                                <div className={openMenu === "comments" ? "submenu submenu-open" : "submenu"}>
                                    <Link to="/admin/all-comments" className='submenu-item'>
                                        Tất cả
                                    </Link>
                                    <Link to="/admin/comment-report" className='submenu-item '>
                                        Bình luận vi phạm
                                    </Link>
                                    <Link to="/admin/comment-disabled" className='submenu-item'>
                                        Bình luận đã khóa
                                    </Link>
                                </div>
                            )}
                        </div>

                    </Link>
                </li>

                

                <li>
                    <Link style={{marginBottom: '12px'}} className={openMenu === "reportall" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("reportall")}>
                        <FontAwesomeIcon className='mr-5' icon={faTriangleExclamation}></FontAwesomeIcon>
                        Báo cáo vi phạm
                        <FontAwesomeIcon className='faAngleDown' icon={openMenu === "reportall" ? faAngleUp : faAngleDown}></FontAwesomeIcon>

                        <div className='bg_white'>
                            {openMenu === "reportall" && (
                                <div className={openMenu === "reportall" ? "submenu submenu-open" : "submenu"}>
                                    <Link to="/admin/report-store" className='submenu-item'>
                                        Báo cáo cửa hàng
                                    </Link>
                                    <Link to="/admin/report-comment" className='submenu-item '>
                                        Báo cáo đánh giá
                                    </Link>
                                    {/* <Link to="/admin/infringing-product" className='submenu-item'>
                                        Sản phẩm vi phạm
                                    </Link>
                                    <Link to="/admin/infringing-user" className='submenu-item'>
                                        Người dùng vi phạm
                                    </Link>
                                    <Link to="/admin/infringing-store" className='submenu-item'>
                                        Cửa hàng vi phạm
                                    </Link> */}
                                </div>
                            )}
                        </div>

                    </Link>
                </li>

                <li>
                    <Link style={{marginBottom: '12px'}} className={openMenu === "p2p" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("p2p")}>
                        <FontAwesomeIcon className='mr-5' icon={faMoneyBillTransfer}></FontAwesomeIcon>
                        Giao dịch nạp - rút
                        <FontAwesomeIcon className='faAngleDown' icon={openMenu === "p2p" ? faAngleUp : faAngleDown}></FontAwesomeIcon>

                        <div className='bg_white'>
                            {openMenu === "p2p" && (
                                <div className={openMenu === "p2p" ? "submenu submenu-open" : "submenu"}>
                                    <Link to="/admin/p2p-transaction-nap" className='submenu-item'>
                                        Nạp tiền
                                    </Link>
                                    <Link to="/admin/p2p-transaction-rut" className='submenu-item'>
                                        Rút tiền
                                    </Link>
                                </div>
                            )}
                        </div>

                    </Link>
                </li>

                <li>
                    <Link className={openMenu === "btc" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("btc")} to="/admin">
                        <FontAwesomeIcon className='mr-5' icon={faBtc}></FontAwesomeIcon>
                        Doanh thu tiền mã hóa</Link>
                </li>

                <li>
                    <Link style={{marginBottom: '12px'}} className={openMenu === "statistical" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("statistical")}>
                        <FontAwesomeIcon className='mr-5' icon={faChartSimple}></FontAwesomeIcon>
                        Doanh thu
                        <FontAwesomeIcon className='faAngleDown' icon={openMenu === "statistical" ? faAngleUp : faAngleDown}></FontAwesomeIcon>

                        <div className='bg_white'>
                            {openMenu === "statistical" && (
                                <div className={openMenu === "statistical" ? "submenu submenu-open" : "submenu"}>
                                    <Link to="/admin/statistical-store" className='submenu-item'>
                                        Doanh thu của hàng
                                    </Link>
                                    <Link to="/admin/statistical-my-money" className='submenu-item '>
                                        Doanh thu hệ thống
                                    </Link>
                                </div>
                            )}
                        </div>

                    </Link>
                </li>
                

                

                {/* <li>
                    <Link className={openMenu === "bankrupt" ? 'itemStyle-click itemStyle' : 'itemStyle'} onClick={() => handleMenuClick("bankrupt")} to="/admin/bankrupt">
                        <FontAwesomeIcon className='mr-5' icon={faOutdent}></FontAwesomeIcon>
                        Đóng cửa hàng</Link>
                </li> */}

            </ul>
        </nav>
    );
};


export default SidebarAdmin;
