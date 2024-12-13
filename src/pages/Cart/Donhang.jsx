import React, { useEffect, useState } from 'react';
import HeaderUser from '../Component/HeaderUser';
import FooterUser from '../Component/FooterUser';
import axios from 'axios';
import styles from './Donhang.module.css';
import RatingForm from '../Rating/RatingForm';
import ReportForm from '../Rating/Report';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faSearch, faStore } from '@fortawesome/free-solid-svg-icons';

const DonHang = () => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [filteredOrderDetails, setFilteredOrderDetails] = useState([]);
    const [selectedReason, setSelectedReason] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderDetailToCancel, setOrderDetailToCancel] = useState(null);
    const [activeStatus, setActiveStatus] = useState("Tất cả");
    const [userId, setUserID] = useState(null)
    const [idProduct, setIdProduct] = useState(null)
    const [idOrderDetail, setIdOrderdetail] = useState(null)
    const [idCuaHang, setIdCuaHang] = useState(null)



    useEffect(() => {
        const fetchAllOrderDetails = async () => {
            try {
                const userId = JSON.parse(sessionStorage.getItem('user')).id_tai_khoan;
                setUserID(userId);
                const response = await axios.get(`http://localhost:8080/api/v1/donhang/taikhoan-${userId}`);
                setOrderDetails(response.data);
                setFilteredOrderDetails(response.data); // Hiển thị tất cả đơn hàng ban đầu
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đơn hàng chi tiết:", error);
            }
        };
        fetchAllOrderDetails();
    }, []);



    const filterOrderDetails = (status) => {
        setActiveStatus(status); // Cập nhật trạng thái đã chọn
        // Thực hiện lọc đơn hàng dựa trên trạng thái
        const filteredOrders = orderDetails.filter(order => order.trang_thai?.ten_trang_thai === status || status === "Tất cả");
        setFilteredOrderDetails(filteredOrders); // Cập nhật danh sách đơn hàng sau khi lọc
    };

    const handleCancelOrderDetail = (orderDetailId) => {
        setOrderDetailToCancel(orderDetailId);
        setShowCancelModal(true);
    };

    const confirmCancelOrderDetail = async () => {
        try {
            const reason = selectedReason;
            await axios.put(`http://localhost:8080/api/v1/orderdetail/huy/${orderDetailToCancel}`, null, {
                params: {
                    lyDoHuy: reason
                }
            });

            const updatedOrderDetails = orderDetails.map(detail =>
                detail.ma_don_hang_chi_tiet === orderDetailToCancel
                    ? { ...detail, trang_thai: { ma_trang_thai: 14, ten_trang_thai: "Khách hàng hủy" } }
                    : detail
            );

            setOrderDetails(updatedOrderDetails);
            setFilteredOrderDetails(updatedOrderDetails.filter(detail => activeStatus === "Tất cả" || detail.trang_thai?.ten_trang_thai === activeStatus));

            setShowCancelModal(false);
        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
        }
    };

    const confirmReceivedOrderDetail = async (orderDetailId) => {
        try {
            await axios.put(`http://localhost:8080/api/v1/orderdetail/nhan/${orderDetailId}`);

            const updatedOrderDetails = orderDetails.map(detail =>
                detail.ma_don_hang_chi_tiet === orderDetailId
                    ? { ...detail, trang_thai: { ma_trang_thai: 13, ten_trang_thai: "Đã giao hàng" } }
                    : detail
            );

            setOrderDetails(updatedOrderDetails);
            setFilteredOrderDetails(updatedOrderDetails.filter(detail => activeStatus === "Tất cả" || detail.trang_thai?.ten_trang_thai === activeStatus));
            alert("Đơn hàng đã được xác nhận nhận hàng");
        } catch (error) {
            console.error("Lỗi khi xác nhận nhận hàng:", error);
        }
    };

    const confirmTraHang = async (orderDetailId) => {
        try {
            await axios.put(`http://localhost:8080/api/v1/orderdetail/tra/${orderDetailId}`);

            const updatedOrderDetails = orderDetails.map(detail =>
                detail.ma_don_hang_chi_tiet === orderDetailId
                    ? { ...detail, trang_thai: { ma_trang_thai: 15, ten_trang_thai: "Yêu cầu trả hàng / Hoàn tiền" } }
                    : detail
            );

            setOrderDetails(updatedOrderDetails);
            setFilteredOrderDetails(updatedOrderDetails.filter(detail => activeStatus === "Tất cả" || detail.trang_thai?.ten_trang_thai === activeStatus));

            alert("Yêu cầu trả hàng/Hoàn tiền đã được gửi.");
        } catch (error) {
            console.error("Lỗi khi yêu cầu trả hàng/Hoàn tiền:", error);
        }
    };
    const [showForm, setShowForm] = useState(false);
    const [showFormReport, setShowFormReport] = useState(false);

    const handleRateClick = async (orderDetailId, productId) => {
        const userId = JSON.parse(sessionStorage.getItem('user')).id_tai_khoan; // Lấy userId từ sessionStorage
        setUserID(userId)
        setIdOrderdetail(orderDetailId)
        setIdProduct(productId)
        setShowForm(true);
        console.log(productId)
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    const handleReportClick = async (idCuaHang, idProduct) => {
        setIdCuaHang(idCuaHang)
        setIdProduct(idProduct)
        setShowFormReport(true)
        console.log(123)
    }
    const handleCloseFormReport = () => {
        setShowFormReport(false)
    }

    return (
        <div>
            {/* <HeaderUser/> */}

            <div className={styles.orderContainer}>

                <div className={styles.orderTabs}>
                    {["Tất cả", "Đang xử lý", "Đang vận chuyển", "Đã giao hàng", "Khách hàng hủy", "Yêu cầu Trả hàng / Hoàn tiền"].map(status => (
                        <button
                            key={status}
                            className={`${styles.buttonDonHang} ${activeStatus === status ? styles.active : ''}`}
                            onClick={() => filterOrderDetails(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className={styles.donhang_search}>
                    <FontAwesomeIcon className={styles.donhang_search_icon} icon={faSearch}></FontAwesomeIcon>
                    <input
                        className={styles.donhang_search_input}
                        placeholder='Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản Phẩm'
                    />
                </div>


                <div className={styles.orderList}>
                    {filteredOrderDetails.map((detail, index) => (
                        <div key={detail.ma_don_hang_chi_tiet} className={styles.orderDetailItem}>
                            <div className={styles.orderDetailHeaderM}>
                                <div className={styles.orderDetailHeader}>
                                    <div className={styles.orderDetailHeaderShop}>
                                        <p>ZUTEE</p>
                                        <span>
                                            <FontAwesomeIcon className={styles.iconShop} icon={faCommentDots}></FontAwesomeIcon>
                                            Chat</span>
                                        <span>
                                            <FontAwesomeIcon className={styles.iconShop} icon={faStore}></FontAwesomeIcon>
                                            Xem Shop</span>
                                    </div>
                                    <div className={styles.orderDetailStatus}>
                                        <p style={{ fontSize: '16px' }}>{detail.trang_thai?.ten_trang_thai || "Không xác định"}</p>
                                    </div>
                                </div>

                            </div>
                            <div className={styles.orderDetailBodyM}>
                                <div className={styles.orderDetailBody}>
                                    <div style={{ marginRight: '20px' }}><img src={detail.san_pham?.anh_san_pham} alt={detail.san_pham?.ten_san_pham} className={styles.productImage} /></div>
                                    <div className={styles.orderDetailBodyInfo}>
                                        <h4 style={{ marginBottom: '10px', fontSize: '17px' }}>{detail.san_pham?.ten_san_pham}</h4>
                                        <p style={{ fontSize: '16px' }}>x{detail.so_luong}</p>
                                    </div>
                                </div>
                                <div className={styles.orderDetailBodyGiaSoLuong}>
                                    {/* <p style={{ fontSize: '16px' }}>₫{(detail.thanh_tien).toLocaleString()}</p> */}
                                    <del>₫{(detail.gia * detail.so_luong).toLocaleString()}</del>
                                    <p style={{ fontSize: '15px' }}>₫{(detail.gia * detail.so_luong).toLocaleString()}</p>
                                </div>

                            </div>
                            <div className={styles.orderDetailFooterM}>
                                <div className={styles.orderDetailFooterMMoney}>
                                    <p style={{ fontSize: '16px' }}>Thành tiền: <span>₫{(detail.thanh_tien).toLocaleString()}</span></p>
                                </div>
                                <div className={styles.orderDetailFooter}>
                                    {detail.trang_thai?.ma_trang_thai === 11 && (
                                        <button className={styles.cancelButton} onClick={() => handleCancelOrderDetail(detail.ma_don_hang_chi_tiet)}>Huỷ đơn hàng</button>
                                    )}
                                    {detail.trang_thai?.ma_trang_thai === 12 && (
                                        <button className={styles.confirmOrderButton} onClick={() => confirmReceivedOrderDetail(detail.ma_don_hang_chi_tiet)}>Đã nhận hàng</button>
                                    )}
                                    {detail.trang_thai?.ma_trang_thai === 13 && (
                                        <>
                                            <button onClick={() => handleRateClick(detail.ma_don_hang_chi_tiet, detail.san_pham.ma_san_pham)} className={styles.rateButton}>
                                                Đánh giá
                                            </button>
                                        </>
                                    )}

                                    {detail.trang_thai?.ma_trang_thai === 13 && (
                                        <button className={styles.returnmoneyButton} onClick={() => confirmTraHang(detail.ma_don_hang_chi_tiet)}>Yêu cầu trả hàng/Hoàn tiền</button>
                                    )}
                                    {detail.trang_thai?.ma_trang_thai === 13 && (
                                        <button className={styles.returnmoneyButton} onClick={() => handleReportClick(detail.san_pham.ma_cua_hang, detail.san_pham.ma_san_pham)}>Báo cáo</button>
                                    )}
                                </div>

                            </div>

                        </div>
                    ))}
                </div>

                {showCancelModal && (
                    <div className={styles.cancelModal}>
                        <div className={styles.modalContent}>
                            <h3>Lý do</h3>
                            <div className={styles.reasonOptions}>
                                <label><input type="radio" name="reason" value="Cập nhật địa chỉ" onChange={(e) => setSelectedReason(e.target.value)} /> Tôi muốn cập nhật địa chỉ / sdt nhận hàng</label>
                                <label><input type="radio" name="reason" value="Thay đổi sản phẩm" onChange={(e) => setSelectedReason(e.target.value)} /> Tôi muốn thay đổi sản phẩm</label>
                                <label><input type="radio" name="reason" value="Thanh toán rắc rối" onChange={(e) => setSelectedReason(e.target.value)} /> Thủ tục thanh toán rắc rối</label>
                                <label><input type="radio" name="reason" value="Tìm chỗ khác" onChange={(e) => setSelectedReason(e.target.value)} /> Tôi tìm thấy chỗ mua khác tốt hơn</label>
                                <label><input type="radio" name="reason" value="Không có nhu cầu" onChange={(e) => setSelectedReason(e.target.value)} /> Tôi không có nhu cầu mua nữa</label>
                                <label><input type="radio" name="reason" value="Không lý do phù hợp" onChange={(e) => setSelectedReason(e.target.value)} /> Tôi không tìm thấy lý do hủy phù hợp</label>
                            </div>
                            <div className={styles.modalActions}>
                                <button className={styles.confirmCancel} onClick={confirmCancelOrderDetail}>Xác nhận hủy</button>
                                <button className={styles.cancel_huy} onClick={() => setShowCancelModal(false)}>Hủy bỏ</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {showForm && (
                <RatingForm
                    onClose={handleCloseForm}
                    userId={userId} // Truyền userId
                    orderDetailId={idOrderDetail} // Truyền orderDetailId
                    productId={idProduct} // Truyền productId
                />
            )}
            {showFormReport && (
                <ReportForm userId={userId} storeId={idCuaHang} productId={idProduct} onClose={handleCloseFormReport} />
            )}
        </div>
    );
};

export default DonHang;