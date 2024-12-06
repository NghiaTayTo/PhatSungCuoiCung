import React, { useEffect, useState } from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./ListProduct.css";
import Pagination from '../Pagination/Pagination';

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

import OrderForm from '../FormVisible/OrderForm';
import PrintBill from '../FormVisible/PrintBill';
import Notification from '../Notification/Notification';

const Book = {
    name: '',

};

const ListOrderStatistics = ({ listOrders = [], keySearch, status, statusHeader }) => {

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


    const currentProducts = Array.isArray(orderDetails)
        ? orderDetails.slice(indexOfFirstItem, indexOfLastItem)
        : [];


    //* hiện form printbill
    const handleShowPrintBill = () => {
        setIsPrintBill(true);

    }
    const handleClosePrintBill = () => {
        setIsPrintBill(false);

    }
    const handleApplyPrintBill = () => {

    }

    // * xác nhận hủy hàng (click vào nút xác nhận)
    const handleCancelOrder = (orderId) => {
        alert(`Cancelled order ${orderId}`);
    }

    //* click vào trang mấy
    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
        console.log('Selected value:', event.target.value); // In ra giá trị được chọn
    };

    const alertHandle = () => {
        alert('hi');
    }

    //* const tableRows = currentItems.map((book, index) => ());
    const tableRows = currentProducts.map((order, index) => (
        <tr key={index}>
            <td>
                <span className='stt'>{index + 1 + indexOfFirstItem}</span>
            </td>

            {/* <td style={{ width: '120px', textAlign: 'center' }}>
                <img src="/images/sach.jpg" alt="book" />
            </td> */}
            <td style={{ width: '150px', textAlign: 'center' }}>{order.ma_don_hang_chi_tiet}</td>
            <td style={{ width: '150px', textAlign: 'center' }}>{order.san_pham?.ten_san_pham}</td>
            <td style={{ width: '100px', textAlign: 'center' }}>{order.so_luong}</td>
            <td style={{ width: '170px', textAlign: 'center' }}>{order.san_pham?.gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
            <td style={{ width: '170px', textAlign: 'center' }}>{order.voucher?.giam_gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
            <td style={{ width: '170px', textAlign: 'center' }}>{order.thanh_tien.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
            <td style={{ width: '300px', textAlign: 'center' }}><strong className='trangthai-update'>{order.trang_thai?.ten_trang_thai}</strong></td>
            {/* xác nhận */}
            
        </tr>
    ));

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)

        console.log(currentPage);
    }

    useEffect(() => {
        setOrderDetails(listOrders);

        const lengthOrders = listOrders.length;
        setPagination(Math.ceil(lengthOrders / selectedValue)); // số trang tổng cộng
    }, [selectedValue, listOrders]);

    return (
        <div>
            {/* hiển thị danh sách sản phẩm */}
            <div className="product-list">
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

                {/* danh sách sản phẩm */}
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '40px', textAlign: 'center' }}>
                                    Stt
                                </th>
                                <th style={{ width: '150px', textAlign: 'center' }}>Mã đơn hàng</th>
                                <th style={{ width: '150px', textAlign: 'center' }}>Sản phẩm</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>Số lượng</th>
                                <th style={{ width: '170px', textAlign: 'center' }}>Đơn giá</th>
                                <th style={{ width: '170px', textAlign: 'center' }}>Giảm giá</th>
                                <th style={{ width: '170px', textAlign: 'center' }}>Thành tiền</th>
                                {/* <th style={{ width: '100px', textAlign: 'center' }}>Đã bán</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>Còn hàng</th> */}
                                <th style={{ width: '300px', textAlign: 'center' }}>Trạng thái</th>
                                <th style={{ width: '100px', textAlign: 'center' }}></th>
                            </tr>
                        </thead>
                        <tbody style={{ marginTop: '10px' }}>
                            {tableRows}
                        </tbody>
                    </table>


                </div>
            </div>


            {/* <FontAwesomeIcon className='pagination-icon' icon={faAngleLeft}></FontAwesomeIcon> */}
            <Pagination totalPages={pagination} onPageChange={handlePageChange}></Pagination>
            {/* <FontAwesomeIcon className='pagination-icon' icon={faAngleRight}></FontAwesomeIcon> */}

            {//selectedBook
                isDetailOrder && (
                    <OrderForm
                        onClose={handleCloseDetailOrder}
                        status={status}
                        statusHeader={statusHeader}
                    />
                )
            }
        </div>
    );
};

export default ListOrderStatistics;