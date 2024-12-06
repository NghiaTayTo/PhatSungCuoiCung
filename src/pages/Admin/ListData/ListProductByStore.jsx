import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import Pagination from '../../../utils/Pagination/Pagination';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

import BookForm from '../../../utils/FormVisible/BookForm';
import Notification from '../../../utils/Notification/Notification';
import NotificationUI from '../../../utils/Notification/NotificationUI';
import { deleteBook } from '../../../utils/API/ProductAPI';
import { OverlayTrigger } from 'react-bootstrap';
import { renderTooltip } from '../../../utils/Order/ToolTip';


const ListProductByStore = ({ listBooks = [], keySearch, searchName, form }) => {

    // * Mảng các Sản phẩm
    const [productList, setProductList] = useState([]);
    // * Phân trang
    const [pagination, setPagination] = useState();
    // * Trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    // * Mỗi trang 10 sản phẩm
    const [checkedProducts, setCheckedProducts] = useState(Array(10).fill(false)); // Mảng cho 10 sản phẩm
    const [isCheckedAll, setIsCheckedAll] = useState(false); // check all sp khi bấm chọn tất cả
    const [selectedValue, setSelectedValue] = useState(10); // số lượng sản phẩm hiển thị mỗi trang
    const [deleteall, setDeleteAll] = useState(false); // trang thái nút xóa

    // *Trang được chọn
    const indexOfLastItem = currentPage * selectedValue;
    const indexOfFirstItem = indexOfLastItem - selectedValue;
    // const currentItems = listBooks.slice(indexOfFirstItem, indexOfLastItem);

    // *Sách được chọn xem chi tiết
    const [selectedBook, setSelectedBook] = useState(null); // Trạng thái lưu thông tin sách đang xem
    const [isDetailVisible, setDetailVisible] = useState(false); // Trạng thái hiển thị chi tiết sách
    const [notificationDelAll, setNotificationDelAll] = useState(false); // Trạng thái hiển thị thông báo của del all
    const [notificationDelBook, setNotificationDelBook] = useState(false); // Trạng thái hiển thị thông báo của del từng sản phẩm
    const [nameBook, setNameBook] = useState(''); // Trạng thái hiển thị thông báo của del từng sản phẩm
    const [exportExcel, setExportExcel] = useState(false); // Từ khóa tìm kiếm

    //* Trạng thái của sản phẩm
    const [status, setStatus] = useState('');
    const [statusInt, setStatusInt] = useState();

    // ** Ẩn hiện form chi tiết sản phẩm
    const handleShowDetails = (bookID, statusInt) => {
        setSelectedBook(bookID);
        setStatus(handleGetTrangThaiText(statusInt));
        setStatusInt(statusInt);
        setDetailVisible(true); // Hiển thị giao diện chi tiết
    };
    const handleCloseDetails = () => {
        setDetailVisible(false);
    };

    //* ẩn hiện form thông báo del all
    const handleShowDelAll = () => {
        setNotificationDelAll(true); // Hiển thị giao diện thông báo
    };
    const handleCloseDelAll = () => {
        setNotificationDelAll(false); // Đóng giao diện thông báo
    };
    const handleApplyDelAll = () => { }

    //* xóa từng sản phẩm
    const [id, setID] = useState();
    const handleShowDelBook = (name, id) => {
        setNotificationDelBook(true);
        setNameBook(name);
        setID(id);
    }
    const handleCloseDelBook = () => {
        setNotificationDelBook(false);
        setNameBook('');
        setID(null);
    }

    //* xuất sản phẩm ra file excel
    const handleShowExcel = () => {
        setExportExcel(true);
    }
    const handleCloseExcel = () => {
        setExportExcel(false);
    }
    const handleApplyExcel = () => {
        // Xử lý xóa sản phẩm
        console.log('Excel')
    }


    //* click từng sản phẩm
    const handleCheckProduct = (index) => {

        setCheckedProducts(Array(selectedValue))

        const updatedCheckedProducts = checkedProducts.map((checked, idx) =>
            idx === index ? !checked : checked // Chỉ thay đổi trạng thái của sản phẩm được chọn
        );

        setCheckedProducts(updatedCheckedProducts);
        setDeleteAll(updatedCheckedProducts.some(checked => checked));
        // Cập nhật trạng thái "Chọn tất cả" nếu tất cả sản phẩm đều được chọn
        setIsCheckedAll(updatedCheckedProducts.every(checked => checked));

    };

    //* chọn tất cả sản phẩm
    const handleCheckAll = () => {
        const newCheckedState = !isCheckedAll;
        setIsCheckedAll(newCheckedState);
        setDeleteAll(newCheckedState);
        setCheckedProducts(Array(selectedValue).fill(newCheckedState)); // Cập nhật tất cả sản phẩm
    };

    //* click vào cái nào
    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const currentProducts = Array.isArray(productList)
        ? productList.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    const handleGetTrangThai = (trangThai) => {
        if (trangThai === 1) {
            return 'dangyeucau';
        } else if (trangThai === 2) {
            return 'khoa';
        } else if (trangThai === 3) {
            return 'conhang';
        } else if (trangThai === 4) {
            return 'hethang'
        } else {
            return 'yeucautrahang'
        }
    }
    
    const handleGetTrangThaiText = (trangThai) => {
        if (trangThai === 1) {
            return 'Chờ duyệt';
        } else if (trangThai === 2) {
            return 'Bị Khóa';
        } else if (trangThai === 3) {
            return 'Còn hàng';
        } else if (trangThai === 4) {
            return 'Hết hàng'
        } else {
            return 'Yêu cầu trả hàng'
        }
    }

    // * Hàm xóa sản phẩm
    const [notificationStatus, setNotificationStatus] = useState('');

    const handleApplyDelBook = async () => {
        try {
            const isDeleted = await handleDelete();
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

    // * Hàm xóa sản phẩm
    const handleDelete = () => {
        return deleteBook(id)
            .then(data => {
                handleCloseDelBook();
                return true;
            })
            .catch(error => {
                handleCloseDelBook();
                console.error('Error deleting data:', error);
                return false;
            });
    }

    const navigate = useNavigate();

    const handleRowClick = (bookID) => {
        navigate('/admin/manager-comment-details', { state: { bookID } });
    };

    const tableRows = currentProducts.map((book, index) => {
        return (
            form !== 'comment' ? (
                <tr key={index} className='box-shadow_row'
                    onClick={() => handleShowDetails(book.ma_san_pham, book.trang_thai_hoat_dong)}>
                    <td>
                        {/* <input
                        type="checkbox"
                        checked={isCheckedAll || checkedProducts[index]} // Checkbox cho từng sản phẩm
                        onChange={() => handleCheckProduct(index)}
                    /> */}
                        <span>{index + 1 + indexOfFirstItem}</span>
                    </td>

                    <td style={{ width: '120px', textAlign: 'center' }}>
                        <img src={`${book.anh_san_pham}`} alt="book" />
                    </td>
                    <td style={{ width: '220px' }}>{book.ten_san_pham}</td>
                    <td style={{ width: '170px', textAlign: 'center' }}>{book.tac_gia}</td>
                    <td style={{ width: '120px', textAlign: 'center' }}>{book.ten_the_loai}</td>
                    <td style={{ width: '100px', textAlign: 'center' }}>{book.gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    <td style={{ width: '100px', textAlign: 'center' }}>{book.da_ban}</td>
                    <td style={{ width: '100px', textAlign: 'center' }}>{book.so_luong_hang - book.da_ban}</td>
                    <td style={{ width: '100px', textAlign: 'center', fontWeight: '500' }} className={handleGetTrangThai(book.trang_thai_hoat_dong)}>

                        {handleGetTrangThaiText(book.trang_thai_hoat_dong)}

                    </td>

                    <td style={{ width: '100px', textAlign: 'center' }}>
                        <button type="button" onClick={(e) => {
                            e.stopPropagation();
                            handleShowDetails(book.ma_san_pham, book.trang_thai_hoat_dong)
                        }}>
                            <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            handleShowDelBook(book.ten_san_pham, book.ma_san_pham)
                        }}>
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </td>
                </tr>
            ) : (
                <OverlayTrigger
                    key={index}
                    placement="left"  // top, right, bottom, left)
                    overlay={(props) => renderTooltip(props, 'Bấm vào đây để xem đánh giá', 'custom-tooltip')}
                >
                    <tr key={index} className='box-shadow_row'
                        onClick={() => handleRowClick(book.ma_san_pham)}>
                        <td>
                            {/* <input
                        type="checkbox"
                        checked={isCheckedAll || checkedProducts[index]} // Checkbox cho từng sản phẩm
                        onChange={() => handleCheckProduct(index)}
                    /> */}
                            <span>{index + 1 + indexOfFirstItem}</span>
                        </td>

                        <td style={{ width: '120px', textAlign: 'center' }}>
                            <img src={`${book.anh_san_pham}`} alt="book" />
                        </td>
                        <td style={{ width: '220px' }}>{book.ten_san_pham}</td>
                        <td style={{ width: '170px', textAlign: 'center' }}>{book.tac_gia}</td>
                        <td style={{ width: '120px', textAlign: 'center' }}>{book.ten_the_loai}</td>
                        <td style={{ width: '100px', textAlign: 'center' }}>{book.gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                        <td style={{ width: '100px', textAlign: 'center' }}>{book.da_ban}</td>
                        <td style={{ width: '100px', textAlign: 'center' }}>{book.so_luong_hang - book.da_ban}</td>
                        <td style={{ width: '100px', textAlign: 'center', fontWeight: '500' }} className={handleGetTrangThai(book.trang_thai_hoat_dong)}>

                            {handleGetTrangThaiText(book.trang_thai_hoat_dong)}

                        </td>

                        <td style={{ width: '100px', textAlign: 'center' }}>
                            <button type="button" onClick={(e) => {
                                e.stopPropagation();
                                handleShowDetails(book.ma_san_pham, book.trang_thai_hoat_dong)
                            }}>
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                handleShowDelBook(book.ten_san_pham, book.ma_san_pham)
                            }}>
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                        </td>
                    </tr>
                </OverlayTrigger>
            )
        )

    }


    );

    const [closeNotification, setCloseNotification] = useState(true);
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)

        console.log(currentPage);
    }

    // useEffect(() => {
    //     setProductCount(listBooks.length);
    // }, [productCount]);

    // *Tổng số trang (số lượng sản phẩm / 10)
    useEffect(() => {
        const totalProducts = listBooks.length;
        setProductList(listBooks)
        setPagination(Math.ceil(totalProducts / selectedValue)); // số trang tổng cộng
    }, [selectedValue, listBooks]);

    return (
        <div>
            {/* hiển thị danh sách sản phẩm */}
            <div className="product-list">
                {
                    productList.length > 0
                        ?
                        (
                            <div className="product-list_pages">
                                <span>Hiển thị</span>
                                <select id="disabledSelect" className="form-select"
                                    value={selectedValue} onChange={handleSelectChange}>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <span style={{ color: "#757B82" }}>Trang {currentPage} - {pagination}</span>
                                <div className="gr-btn">
                                    {deleteall ? (
                                        <>
                                            <button className="btn-deleteall" onClick={handleShowDelAll}>
                                                <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                                            </button>
                                        </>
                                    ) : null}

                                    {/* <button className="btn-deleteall">
                                        <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                                    </button> */}

                                    <button className="btn-exportexxcel" onClick={handleShowExcel}>
                                        <FontAwesomeIcon style={{ marginRight: '7px' }} icon={faArrowDownLong}></FontAwesomeIcon>
                                        Xuất
                                    </button>
                                </div>

                            </div>
                        )
                        :
                        ''
                }



                {/* danh sách sản phẩm */}
                {
                    productList.length > 0 ?
                        (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '40px' }}>
                                                {/* <input type="checkbox"
                                                    checked={isCheckedAll}
                                                    onChange={handleCheckAll}></input> */}
                                                Stt
                                            </th>
                                            <th style={{ width: '120px', textAlign: 'center' }}>Hình ảnh</th>
                                            <th style={{ width: '220px' }}>Tên sách</th>
                                            <th style={{ width: '170px', textAlign: 'center' }}>Tác giả</th>
                                            <th style={{ width: '100px', textAlign: 'center' }}>Thể loại</th>
                                            <th style={{ width: '100px', textAlign: 'center' }}>Giá</th>
                                            <th style={{ width: '100px', textAlign: 'center' }}>Đã bán</th>
                                            <th style={{ width: '100px', textAlign: 'center' }}>Còn hàng</th>
                                            <th style={{ width: '100px', textAlign: 'center' }}>Trạng thái</th>
                                            <th style={{ width: '100px', textAlign: 'center' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ marginTop: '10px' }}>
                                        {tableRows}
                                    </tbody>
                                </table>


                            </div>
                        )
                        :
                        (
                            <div className='notification-notstore'>
                                {
                                    keySearch === 'searchIsNull'
                                        ? (<img className='storenotbook-notsearch' src={`/images/searchnotbook.png`} alt="Không tìm thấy sản phẩm." />)
                                        : (<img style={{ marginTop: '20px', height: '235px' }} className='storenotbook' src={`/images/storenotbook.png`} alt="Hãy tạo sản phẩm đầu tiên của bạn." />)
                                }

                                <div>
                                    {
                                        keySearch === 'searchIsNull'
                                            ? (<h3 style={{ bottom: '0' }}>Không tìm thấy sản phẩm<strong>{searchName ? `: ${searchName}` : ''}</strong>.</h3>)
                                            : (<h3 style={{ bottom: '10px' }}>Cửa hàng chưa tạo sản phẩm.</h3>)
                                    }

                                </div>
                            </div>
                        )
                }

            </div>

            {/* *=========================== */}

            {
                productList.length > 0
                    ?
                    (
                        /* <FontAwesomeIcon className='pagination-icon' icon={faAngleLeft}></FontAwesomeIcon> */
                        < Pagination totalPages={pagination} onPageChange={handlePageChange}></Pagination>
                        /* <FontAwesomeIcon className='pagination-icon' icon={faAngleRight}></FontAwesomeIcon> */
                    )
                    : ''
            }

            {//selectedBook
                isDetailVisible && (
                    <BookForm
                        keyForm={'admin'}
                        onClose={handleCloseDetails}
                        bookID={selectedBook}
                        statusText={status}
                        statusInt={statusInt}
                    />
                )
            }

            {
                notificationDelAll && (
                    <Notification
                        title={'Xóa sản phẩm'}
                        content={'Bạn muốn xóa các sản phẩm đã chọn?'}
                        onClose={handleCloseDelAll}
                        onApply={handleApplyDelAll} />

                )
            }

            {
                notificationDelBook && (
                    <Notification
                        title={'Xóa sản phẩm'}
                        content1={`Bạn muốn xóa sách:`}
                        content2={`${nameBook}?`}
                        onClose={handleCloseDelBook}
                        onApply={handleApplyDelBook} />
                )
            }

            {
                exportExcel && (
                    <Notification
                        title={'Xuất danh sách sản phẩm'}
                        content={'Bạn muốn xuất danh sách sản phẩm ra tệp Excel?'}
                        onClose={handleCloseExcel}
                        onApply={handleApplyExcel} />
                )
            }
            {notificationStatus === 'deleteIsSuccess' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="success"
                        title="Xóa sách"
                        description={`"Xóa sách thành công."`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
            {notificationStatus === 'deleteIsFail' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="error"
                        title="Xóa sách"
                        description={`"Sách đang được giao dịch - không thể xóa."`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
        </div >
    );
};

export default ListProductByStore;