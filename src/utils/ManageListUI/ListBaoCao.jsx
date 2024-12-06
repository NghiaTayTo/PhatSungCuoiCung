import React, { useEffect, useState } from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./ListProduct.css";
import Pagination from '../Pagination/Pagination';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import OrderForm from '../FormVisible/OrderForm';
import PrintBill from '../FormVisible/PrintBill';
import Notification from '../Notification/Notification';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { deleteBaoCaoCuaHang } from '../API/BaoCaoAPI';
import NotificationUI from '../Notification/NotificationUI';

const ListBaoCao = ({ listBaoCaos = [], keySearch, status, title, keyForm }) => {

    const [orderDetails, setOrderDetails] = useState([]);
    const [pagination, setPagination] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedValue, setSelectedValue] = useState(10); // số lượng sản phẩm hiển thị mỗi trang

    const indexOfLastItem = currentPage * selectedValue;
    const indexOfFirstItem = indexOfLastItem - selectedValue;
    // const currentItems = listBooks.slice(indexOfFirstItem, indexOfLastItem);

    const [selectedOrder, setSelectedOrder] = useState(''); // Trạng thái lưu thông tin sách đang xem
    // Trạng thái hiển thị thông báo của del all

    const [isDetailOrder, setIsDetailOrder] = useState(false);
    const [isPrintBill, setIsPrintBill] = useState(false);

    // ** Ẩn hiện form chi tiết đơn hàng
    const handleShowDetailOrder = (orderId) => {
        setSelectedOrder(orderId);
        setIsDetailOrder(true);
    };
    const handleCloseDetailOrder = () => {
        setIsDetailOrder(false); // Đóng giao diện chi tiết
        // setSelectedBook(null); // Xóa thông tin sách
    };

    //* hiện form printbill
    const handleShowPrintBill = () => {
        setIsPrintBill(true);

    }
    const handleClosePrintBill = () => {
        setIsPrintBill(false);

    }
    const handleApplyPrintBill = () => {

    }

    //* click vào trang mấy
    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
        console.log('Selected value:', event.target.value); // In ra giá trị được chọn
    };

    const currentProducts = Array.isArray(orderDetails)
        ? orderDetails.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    const getTrangThaiCSS = (id) => {
        if (id == 1) {
            return 'choduyet';
        } else if (id == 2 || id == 4 || id == 5) {
            return 'xong';
        } else if (id == 3) {
            return 'huy';
        }
    }

    //* xóa từng sản phẩm
    const [id, setID] = useState();
    const [notificationDelBook, setNotificationDelBook] = useState(false);
    const handleShowDelBaoCao = (id) => {
        setNotificationDelBook(true);
        setID(id);
    }

    const handleCloseDelBaoCao = () => {
        setNotificationDelBook(false);
        setID(null);
    }

    // * Hàm xóa sản phẩm
    const [notificationStatus, setNotificationStatus] = useState('');
    const handleApplyDelBaoCao = async () => {
        try {
            const isDeleted = await deleteBaoCaoCuaHang(id);
            if (isDeleted) {
                window.location.reload();
                setNotificationStatus('deleteIsSuccess');
            } else {

                setNotificationStatus('deleteIsFail');
            }
        } catch (error) {
            setNotificationStatus('deleteIsFail');
        }
    }

    //* const tableRows = currentItems.map((book, index) => ());
    const tableRows = currentProducts.map((baocao, index) => (
        <tr key={index} className='box-shadow_row'
        // onClick={() => handleShowDetailOrder(order.ma_don_hang_chi_tiet)}
        >
            <td>
                <span className='stt'>{index + 1 + indexOfFirstItem}</span>
            </td>

            {/* <td style={{ width: '120px', textAlign: 'center' }}>
                <img src="/images/sach.jpg" alt="book" />
            </td> */}
            <td style={{ width: '110px', textAlign: 'center' }}>{baocao.ngay_bao_cao}</td>
            <td style={{ width: '180px', textAlign: 'center' }}>{baocao.tai_khoan_bi_bao_cao?.ho_ten}</td>
            <td style={{ width: '340px', textAlign: 'center' }}>{baocao.danh_gia?.noi_dung_danh_gia}</td>
            <td style={{ width: '340px', textAlign: 'center' }}>{baocao.noi_dung_vi_phạm !== null ? baocao.noi_dung_vi_phạm : baocao.vi_pham?.ten_vi_pham}</td>
            <td style={{ width: '100px', textAlign: 'center' }} className={getTrangThaiCSS(baocao.trang_thai_bao_cao?.id_trang_thai_bao_cao)}>
            {
                    baocao.trang_thai_bao_cao?.id_trang_thai_bao_cao !== 1 && baocao.trang_thai_bao_cao?.id_trang_thai_bao_cao !== 3 ? (
                        <>Đã duyệt</>
                    ) : (
                        <>{baocao.trang_thai_bao_cao?.ten_trang_thai_bao_cao}</>
                    )
                }
            </td>
            {/* <td style={{ width: '110px', textAlign: 'center' }}>{order.gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td> */}
            {/* <td style={{ width: '110px', textAlign: 'center' }}>{order.voucher ? order.voucher?.giam_gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 0}</td> */}
            {/* <td style={{ width: '110px', textAlign: 'center' }}>{(order.thanh_tien).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td> */}

            {
                status === 'choduyet' && (
                    <td style={{ width: '80px', textAlign: 'center' }} >
                        <button onClick={(e) => {
                            e.stopPropagation();
                            handleShowDelBaoCao(baocao.id_bao_cao)
                        }}>
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </td>
                )
            }
        </tr>
    ));

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)

        console.log(currentPage);
    }

    const [closeNotification, setCloseNotification] = useState(true);
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    useEffect(() => {
        setOrderDetails(listBaoCaos);
        const totalOrder = listBaoCaos.length;
        setPagination(Math.ceil(totalOrder / selectedValue)); // số trang tổng cộng
    }, [selectedValue, listBaoCaos]);

    return (
        <div>
            {/* hiển thị danh sách sản phẩm */}
            <div className="product-list">

                {
                    listBaoCaos.length > 0 ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div className="product-list_pages">
                                    <span>Hiển thị</span>
                                    <select id="disabledSelect" className="form-select"
                                        value={selectedValue} onChange={handleSelectChange}>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                    <span style={{ color: "#757B82" }}>Trang 1 - {pagination}</span>
                                </div>
                                <div>
                                    <h3 style={{ marginTop: '10px', marginRight: '30px' }}>{title}</h3>
                                </div>
                            </div>

                            {/* danh sách sản phẩm */}
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '40px', textAlign: 'center' }}>
                                                Stt
                                            </th>
                                            <th style={{ width: '110px', textAlign: 'center' }}>Ngày báo cáo</th>
                                            <th style={{ width: '180px', textAlign: 'center' }}>Tài khoản bị báo cáo</th>
                                            <th style={{ width: '340px', textAlign: 'center' }}>Nội dung vi phạm</th>
                                            <th style={{ width: '340px', textAlign: 'center' }}>Lý do báo cáo</th>
                                            {/* <th style={{ width: '110px', textAlign: 'center' }}>Đơn giá</th>
                                            <th style={{ width: '110px', textAlign: 'center' }}>Giảm giá</th>
                                            <th style={{ width: '110px', textAlign: 'center' }}>Thành tiền</th> */}
                                            <th style={{ width: '120px', textAlign: 'center' }}>Trạng thái</th>
                                            {
                                                status === 'choduyet' && (
                                                    <th style={{ width: '80px', textAlign: 'center' }}></th>
                                                )
                                            }
                                        </tr>
                                    </thead>
                                    <tbody style={{ marginTop: '10px' }}>
                                        {tableRows}
                                    </tbody>
                                </table>


                            </div>
                        </>
                    ) : (
                        <div className='notification-notstore'>
                            {
                                keySearch === true
                                    ? (<img className='notvoucher' src={`/images/baocao.png`} alt="Không tìm thấy báo cáo." />)
                                    : (<img className='notvoucher' src={`/images/baocao.png`} alt="Cửa hàng chưa có báo cáo." />)
                            }

                            <div>
                                {
                                    keySearch === true
                                        ? (<h3 style={{ bottom: '0' }}>Không tìm thấy báo cáo.</h3>)
                                        : (<h3>Cửa hàng không có báo cáo.</h3>)
                                }
                            </div>
                        </div>
                    )
                }
            </div>

            {
                listBaoCaos.length > 10 && (
                    <Pagination totalPages={pagination} onPageChange={handlePageChange}></Pagination>
                )
            }

            {/* {
                isDetailOrder && (
                    <OrderForm
                        onClose={handleCloseDetailOrder}
                        status={status}
                        statusHeader={statusHeader}
                        orderID={selectedOrder}
                    />
                )
            } */}

            {
                notificationDelBook && (
                    <Notification
                        title={'Xóa báo cáo'}
                        content1={`Bạn muốn xóa báo cáo này`}
                        onClose={handleCloseDelBaoCao}
                        onApply={handleApplyDelBaoCao} />
                )
            }
            {notificationStatus === 'deleteIsSuccess' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="success"
                        title="Xóa báo cáo"
                        description={`"Thành công."`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
            {notificationStatus === 'deleteIsFail' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="error"
                        title="Xóa báo cáo"
                        description={`"Thất bại."`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
            {
                isPrintBill && (
                    <PrintBill onClose={handleClosePrintBill} onApply={handleApplyPrintBill} />
                )
            }
        </div>
    );
};

export default ListBaoCao;