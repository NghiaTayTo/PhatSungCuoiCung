import { faEye, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faArrowDownLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import Notification from '../../../utils/Notification/Notification';
import NotificationUI from '../../../utils/Notification/NotificationUI';
import Pagination from '../../../utils/Pagination/Pagination';
import CustomerForm from '../FormDetailsAdmin/CustomerForm';

const ListCustomer = ({ CustomerList = [], keySearch, searchName, trangThaiTK }) => {
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
    const [selectedCustomer, setSelectedCustomer] = useState(null); // Trạng thái lưu thông tin sách đang xem
    const [isDetailVisible, setDetailVisible] = useState(false); // Trạng thái hiển thị chi tiết sách
    const [notificationDelAll, setNotificationDelAll] = useState(false); // Trạng thái hiển thị thông báo của del all
    const [notificationDelBook, setNotificationDelBook] = useState(false); // Trạng thái hiển thị thông báo của del từng sản phẩm
    const [nameBook, setNameBook] = useState(''); // Trạng thái hiển thị thông báo của del từng sản phẩm
    const [exportExcel, setExportExcel] = useState(false); // Từ khóa tìm kiếm

    //* Trạng thái của sản phẩm
    const [status, setStatus] = useState(false);
    const [statusInt, setStatusInt] = useState();

    // ** Ẩn hiện form chi tiết tài khoản
    const handleShowDetails = (status, idCustomer) => {
        setSelectedCustomer(idCustomer);
        setStatus(status);
        setDetailVisible(true); // Hiển thị giao diện chi tiết
    };
    const handleCloseDetails = () => {
        setSelectedCustomer(null);
        setStatus(false);
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

    const handleGetTrangThai = (diemViPham, trangThai) => {
        if (diemViPham >= 24) {
            return 'khoa';
        } else if (trangThai) {
            return 'khoa';
        } else {
            return 'conhang';
        }
    }
    const handleGetTrangThaiText = (diemViPham, trangThai) => {
        if (diemViPham >= 24 && trangThai === false) {
            return 'Vi phạm';
        } else if (trangThai) {
            return 'Vô hiệu hóa';
        } else {
            return 'Hoạt động'
        }
    }



    const tableRows = currentProducts.map((customer, index) => (
        <tr key={index} className={`box-shadow_row ${customer.trang_thai_tk ? 'css-block' : ''}`}
            onClick={() => handleShowDetails(customer.trang_thai_tk, customer.id_tai_khoan)}>
            <td>
                {/* <input
                    type="checkbox"
                    checked={isCheckedAll || checkedProducts[index]} // Checkbox cho từng sản phẩm
                    onChange={() => handleCheckProduct(index)}
                /> */}
                <span>{index + 1 + indexOfFirstItem}</span>
            </td>

            <td style={{ width: '120px', textAlign: 'center' }}>
                <img className='image-border-radius'
                    // src={`${customer.anh_dai_dien}`} 
                    src="/images/avtadmin.jpg"
                    alt="customer" />
            </td>
            <td style={{ width: '190px' }}>{customer.ho_ten}</td>
            <td style={{ width: '170px', textAlign: 'center' }}>{customer.email}</td>
            <td style={{ width: '150px', textAlign: 'center' }}>{customer.so_dt}</td>
            <td style={{ width: '130px', textAlign: 'center' }}>{customer.ngay_sinh}</td>
            <td style={{ width: '150px', textAlign: 'center' }}>
                {customer.vai_tro?.ma_vai_tro === 2 && (
                    <div style={{ marginBottom: '7px' }}>{customer.vai_tro?.ten_vai_tro}</div>
                )}
                <div>Người dùng</div>
            </td>
            {/* <td style={{ width: '100px', textAlign: 'center' }}>{customer.so_luong_hang - customer.da_ban}</td> */}
            {
                trangThaiTK === 'yeucau' ? (
                    <td style={{ width: '100px', textAlign: 'center', fontWeight: '500' }} className='yeucau'>
                        Yêu cầu mở khóa
                    </td>
                ) : (
                    <td style={{ width: '100px', textAlign: 'center', fontWeight: '500' }} className={handleGetTrangThai(customer.tong_diem_vi_pham, customer.trang_thai_tk)}>

                        {handleGetTrangThaiText(customer.tong_diem_vi_pham, customer.trang_thai_tk)}
                        {/* .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) */}
                    </td>
                )
            }


            <td style={{ width: '100px', textAlign: 'center' }}>
                <button type="button" onClick={(e) => {
                    e.stopPropagation();
                    handleShowDetails(customer.ma_san_pham, customer.trang_thai_hoat_dong)
                }}>
                    <FontAwesomeIcon icon={faEye} />
                </button>
                {/* <button onClick={(e) => {
                    e.stopPropagation();
                    handleShowDelBook(book.ten_san_pham, book.ma_san_pham)
                }}>
                    <FontAwesomeIcon icon={faTrashCan} />
                </button> */}
            </td>
        </tr>
    ));

    // * Hàm xóa sản phẩm
    const [notificationStatus, setNotificationStatus] = useState('');
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
        const totalProducts = CustomerList.length;
        setProductList(CustomerList)
        setPagination(Math.ceil(totalProducts / selectedValue)); // số trang tổng cộng
    }, [selectedValue, CustomerList]);

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
                                                    onChange={handleCheckAll}></input>Stt */}
                                                Stt
                                            </th>
                                            <th style={{ width: '120px', textAlign: 'center' }}>Hình ảnh</th>
                                            <th style={{ width: '190px' }}>Họ tên</th>
                                            <th style={{ width: '170px', textAlign: 'center' }}>Email</th>
                                            <th style={{ width: '150px', textAlign: 'center' }}>Số điện thoại</th>
                                            <th style={{ width: '130px', textAlign: 'center' }}>Ngày sinh</th>
                                            <th style={{ width: '150px', textAlign: 'center' }}>Vai trò</th>
                                            {/* <th style={{ width: '100px', textAlign: 'center' }}>Còn hàng</th> */}
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
                            <div className='notification-notstore' style={{ height: '400px' }}>
                                <img className='storenotbook' src={`/images/customernot.png`} alt="Hãy tạo sản phẩm đầu tiên của bạn." />

                                <div>
                                    {
                                        keySearch === 'searchIsNull'
                                            ? (<h3 style={{ bottom: '0' }}>Không tìm thấy sản phẩm<strong>{searchName ? `: ${searchName}` : ''}</strong>.</h3>)
                                            : (<h3 style={{ bottom: '10px' }}>Hệ thống chưa có khách hàng.</h3>)
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

            {/* {
                isDetailVisible && (
                    <BookFormAdmin
                        onClose={handleCloseDetails}
                        bookID={selectedBook}
                        statusText={status}
                        statusInt={statusInt}
                        trangThaiSach={trangThaiSach}
                    />
                )
            } */}

            {
                isDetailVisible && (
                    <CustomerForm
                        customerID={selectedCustomer}
                        status={status}
                        onClose={handleCloseDetails}
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

export default ListCustomer;