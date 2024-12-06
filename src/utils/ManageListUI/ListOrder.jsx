import React, { useEffect, useState } from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./ListProduct.css";
import Pagination from '../Pagination/Pagination';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";

import OrderForm from '../FormVisible/OrderForm';
import PrintBill from '../FormVisible/PrintBill';

const ListOrder = ({ listOrders = [], keySearch, status, statusHeader, title, keyForm }) => {

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

    //* const tableRows = currentItems.map((book, index) => ());
    const tableRows = currentProducts.map((order, index) => (
        <tr key={index} className='box-shadow_row'
            onClick={() => handleShowDetailOrder(order.ma_don_hang_chi_tiet)}>
            <td>
                <span className='stt'>{index + 1 + indexOfFirstItem}</span>
            </td>

            {/* <td style={{ width: '120px', textAlign: 'center' }}>
                <img src="/images/sach.jpg" alt="book" />
            </td> */}
            <td style={{ width: '90px', textAlign: 'center' }}>{order.ma_don_hang_chi_tiet}</td>
            <td style={{ width: '180px', textAlign: 'center' }}>{order.san_pham?.ten_san_pham}</td>
            <td style={{ width: '140px', textAlign: 'center' }}>{order.don_hang?.tai_khoan?.ho_ten}</td>
            {
                keyForm === 'admin' && <td style={{ width: '140px', textAlign: 'center' }}>{order.san_pham?.cua_hang?.ten_cua_hang}</td>
            }
            <td style={{ width: '100px', textAlign: 'center' }}>{order.so_luong}</td>
            <td style={{ width: '110px', textAlign: 'center' }}>{order.gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
            <td style={{ width: '110px', textAlign: 'center' }}>{order.voucher ? order.voucher?.giam_gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 0}</td>
            <td style={{ width: '110px', textAlign: 'center' }}>{(order.thanh_tien).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>

            <td style={{ width: '220px', textAlign: 'center' }} >
                <button className={status}>{statusHeader}</button>
            </td>

            {
                keyForm === 'seller' && (
                    <td style={{ width: '100px', textAlign: 'center' }}>
                        {/* xác nhận */}
                        <button type="button" onClick={(e) => {
                            e.stopPropagation();
                            handleShowDetailOrder(order.ma_don_hang_chi_tiet)
                        }}>
                            <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                        </button>
                        {
                            status === 'xacnhan' && (
                                <>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        handleShowPrintBill()
                                    }}>
                                        <FontAwesomeIcon icon={faPrint}></FontAwesomeIcon>
                                    </button>
                                </>
                            )
                        }
                    </td>
                )
            }

        </tr>
    ));

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)

        console.log(currentPage);
    }

    useEffect(() => {
        setOrderDetails(listOrders);
        const totalOrder = listOrders.length;
        setPagination(Math.ceil(totalOrder / selectedValue)); // số trang tổng cộng
    }, [selectedValue, listOrders]);

    return (
        <div>
            {/* hiển thị danh sách sản phẩm */}
            <div className="product-list">

                {
                    listOrders.length > 0 ? (
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
                                            <th style={{ width: '90px', textAlign: 'center' }}>Mã đơn hàng</th>
                                            <th style={{ width: '180px', textAlign: 'center' }}>Sản phẩm</th>
                                            <th style={{ width: '140px', textAlign: 'center' }}>Người mua</th>
                                            {
                                                keyForm === 'admin' && <th style={{ width: '140px', textAlign: 'center' }}>Cửa hàng</th>
                                            }
                                            <th style={{ width: '100px', textAlign: 'center' }}>Số lượng</th>
                                            <th style={{ width: '110px', textAlign: 'center' }}>Đơn giá</th>
                                            <th style={{ width: '110px', textAlign: 'center' }}>Giảm giá</th>
                                            <th style={{ width: '110px', textAlign: 'center' }}>Thành tiền</th>
                                            <th style={{ width: '200px', textAlign: 'center' }}>Trạng thái</th>
                                            {
                                                keyForm === 'seller' && <th style={{ width: '100px', textAlign: 'center' }}></th>
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
                                    ? (<img className='notvoucher' src={`/images/searchnoorder.png`} alt="Không tìm thấy đơn hàng." />)
                                    : (<img className='notvoucher' src={`/images/storenoorder.png`} alt="Cửa hàng chưa có đơn đặt hàng." />)
                            }

                            <div>
                                {
                                    keySearch === true
                                        ? (<h3 style={{ bottom: '0' }}>Không tìm thấy đơn hàng.</h3>)
                                        : (<h3>Cửa hàng chưa có đơn đặt hàng.</h3>)
                                }
                            </div>
                        </div>
                    )
                }
            </div>

            {
                listOrders.length > 10 && (
                    <Pagination totalPages={pagination} onPageChange={handlePageChange}></Pagination>
                )
            }

            {//selectedBook
                isDetailOrder && (
                    <OrderForm
                        onClose={handleCloseDetailOrder}
                        status={status}
                        statusHeader={statusHeader}
                        orderID={selectedOrder}
                    />
                )
            }
            {/* {
                notificationApplyOrder && status === 'xacnhan' && (
                    <Notification
                        title={'Xác nhận đơn hàng'}
                        content1={'Khi bấm xác nhận đồng nghĩa với việc bạn thông báo cho khách hàng biết rằng: “Sản phẩm đã được đóng gói và chuyển giao cho đơn vị vận chuyển"'}
                        onClose={handleCloseApplyOrder}
                        onApply={handleApplyApplyOrder} />
                )
            }
            {
                notificationApplyOrder && status === 'trahang' && (
                    <Notification
                        title={'Xác nhận trả hàng - hoàn tiền'}
                        content1={'Khi bấm xác nhận đồng nghĩa với việc bạn thông báo cho khách hàng biết rằng: “Tôi đồng ý với yêu cầu Trả hàng - Hoàn tiền."'}
                        onClose={handleCloseApplyOrder}
                        onApply={handleApplyApplyOrder} />
                )
            } */}

            {
                isPrintBill && (
                    <PrintBill onClose={handleClosePrintBill} onApply={handleApplyPrintBill} />
                )
            }
        </div>
    );
};

export default ListOrder;