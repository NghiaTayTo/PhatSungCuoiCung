import React, { useState } from "react";
import './Menu.css';  // Import file CSS

const Menu = () => {
    const [openMenu, setOpenMenu] = useState(null); // Trạng thái lưu mục cha đang được mở

    // Hàm để mở hoặc đóng menu
    const handleMenuClick = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu); // Đóng mục đang mở hoặc mở mục mới
    };

    return (
        <div className="menu-container">
            {/* Quản lý sản phẩm */}
            <div className="menu-item">
                <div className="menu-title" onClick={() => handleMenuClick("products")}>
                    Quản lý sản phẩm
                    <span className={openMenu === "products" ? "arrow down" : "arrow right"}></span>
                </div>
                {openMenu === "products" && (
                    <div className="submenu">
                        <div>Sản phẩm đã bán</div>
                        <div>Sản phẩm tồn kho</div>
                    </div>
                )}
            </div>

            {/* Thông tin cửa hàng */}
            <div className="menu-item">
                <div className="menu-title" onClick={() => handleMenuClick("storeInfo")}>
                    Thông tin cửa hàng
                    <span className={openMenu === "storeInfo" ? "arrow down" : "arrow right"}></span>
                </div>
            </div>

            {/* Quản lý khách hàng */}
            <div className="menu-item">
                <div className="menu-title" onClick={() => handleMenuClick("customers")}>
                    Quản lý khách hàng
                    <span className={openMenu === "customers" ? "arrow down" : "arrow right"}></span>
                </div>
                {openMenu === "customers" && (
                    <div className="submenu">
                        <div>Khách hàng VIP</div>
                        <div>Khách hàng thường</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
