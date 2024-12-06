import React, { useEffect, useState } from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./ListProduct.css";
import Pagination from '../Pagination/Pagination';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";

import BookForm from '../FormVisible/BookForm';



const ListBestSelling = ({ listBookBestSelling = [], keySearch, status, statusHeader }) => {

    // * Lưu danh sách sản phẩm bán chạy
    const [bookList, setBookList] = useState([]);
    // * Phân trang
    const [pagination, setPagination] = useState();
    // * Trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    // * Mỗi trang 10 sản phẩm
    const [checkedProducts, setCheckedProducts] = useState(Array(10).fill(false)); // Mảng cho 10 sản phẩm
    const [selectedValue, setSelectedValue] = useState(10); // số lượng sản phẩm hiển thị mỗi trang

    // *Trang được chọn
    const indexOfLastItem = currentPage * selectedValue;
    const indexOfFirstItem = indexOfLastItem - selectedValue;

    const [selectedProduct, setSelectedProduct] = useState(''); // Trạng thái lưu thông tin sách đang xem
    const [isDetailVisible, setDetailVisible] = useState(false); // Trạng thái hiển thị chi tiết sách

    const [selectedBook, setSelectedBook] = useState(null);

    // * Ẩn hiện form xem chi tiết sản phẩm
    const handleShowDetails = (bookID, statusInt) => {
        setSelectedBook(bookID);
        // setStatus(handleGetTrangThaiText(statusInt));
        // setStatusInt(statusInt);
        setDetailVisible(true); // Hiển thị giao diện chi tiết
    };
    const handleCloseDetails = () => {
        setDetailVisible(false);
    };

    //* click vào cái nào
    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const currentProducts = Array.isArray(bookList)
        ? bookList.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    //* const tableRows = currentItems.map((book, index) => ());
    const tableRows = currentProducts.map((book, index) => (
        <tr key={index} className='box-shadow_row'
            onClick={() => handleShowDetails(book.ma_san_pham, book.trang_thai_hoat_dong)}>
            <td>
                <span className='stt'>{index + 1 + indexOfFirstItem}</span>
            </td>

            <td style={{ width: '120px', textAlign: 'center' }}>
                <img src={`${book.anh_san_pham}`} alt={book.ten_san_pham} />
            </td>
            {/* <td style={{ width: '150px', textAlign: 'center' }}>20232</td> */}
            <td style={{ width: '220px' }}>{book.ten_san_pham}</td>
            <td style={{ width: '120px', textAlign: 'center' }}>{book.gia?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
            <td style={{ width: '120px', textAlign: 'center', fontWeight: 'bold' }}>{book.da_ban?.toLocaleString('vi-VN')}</td>
            <td style={{ width: '170px', textAlign: 'center' }}>{book.doanh_thu ? book.doanh_thu.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 0}</td>
            <td style={{ width: '120px', textAlign: 'center' }}>{book.con_hang?.toLocaleString('vi-VN')}</td>
            <td style={{ width: '120px', textAlign: 'center' }}>{book.diem_trung_binh ? Math.round(book.diem_trung_binh * 10) / 10 : 0} / 5</td>
            <td style={{ width: '100px', textAlign: 'center' }}>
                <button type="button" onClick={() => handleShowDetails(book.ma_san_pham)}>
                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                </button>
            </td>
        </tr>
    ));

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
        // console.log(currentPage);
    }

    useEffect(() => {

        setBookList(listBookBestSelling);
        const lengthBook = listBookBestSelling.length;

        const data = bookList;
        console.log(data);
        
        setPagination(Math.ceil(lengthBook / selectedValue)); // số trang tổng cộng

    }, [selectedValue, listBookBestSelling]);

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
                                <th style={{ width: '120px', textAlign: 'center' }}>Hình ảnh</th>
                                <th style={{ width: '220px' }}>Tên sách</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Giá</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Đã bán</th>
                                <th style={{ width: '170px', textAlign: 'center' }}>Doanh thu</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Kho</th>
                                {/* <th style={{ width: '100px', textAlign: 'center' }}>Đã bán</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>Còn hàng</th> */}
                                <th style={{ width: '120px', textAlign: 'center' }}>Đánh giá</th>
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


            {
                isDetailVisible && (
                    <BookForm
                        keyForm='best-selling'
                        onClose={handleCloseDetails}
                        bookID={selectedBook}
                        />
                )
            }
        </div>
    );
};

export default ListBestSelling;