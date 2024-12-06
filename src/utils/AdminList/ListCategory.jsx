import React, { useEffect, useState } from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// import "./ListProduct.css";
import Pagination from '../Pagination/Pagination';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";


import VoucherForm from '../FormVisible/VoucherForm';
import Notification from '../Notification/Notification';
import NotificationUI from '../Notification/NotificationUI';

import { deleteCategoryByID, deleteCategoryByMa, getCountBookByStore } from '../../utils/API/CategoryAPI';
import CategoryForm from '../FormVisible/CategoryForm';

const ListCategory = ({ listCategory = [], keySearch }) => {
    // * Tất cả vouchers
    const [categoryList, setCategoryList] = useState([]);

    const [isDetailVisible, setDetailVisible] = useState(false); // Trạng thái hiển thị chi tiết sách
    const [notificationDelAll, setNotificationDelAll] = useState(false); // Trạng thái hiển thị thông báo của del all
    const [notificationDelBook, setNotificationDelBook] = useState(false); // Trạng thái hiển thị thông báo của del từng sản phẩm
    const [maVoucher, setMaVoucher] = useState(''); // Trạng thái hiển thị thông báo của del từng sản phẩm

    // *Phân trang
    const [pagination, setPagination] = useState();
    // * Trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    // * Mỗi trang 10 sản phẩm
    const [selectedValue, setSelectedValue] = useState(10); // số lượng sản phẩm hiển thị mỗi trang

    // *Trang được chọn
    const indexOfLastItem = currentPage * selectedValue;
    const indexOfFirstItem = indexOfLastItem - selectedValue;

    // * trạng thái category
    const [categoryID, setCategoryID] = useState(0);
    const [key, setKey] = useState('');

    // ** Ẩn hiện form chi tiết sản phẩm
    const handleShowDetails = (voucherID, key) => {
        // setSelectedBook(book); // Lưu thông tin sách vào state
        setDetailVisible(true); // Hiển thị giao diện chi tiết
        setCategoryID(voucherID)
        setKey(key);
    };
    const handleCloseDetails = () => {
        setDetailVisible(false); // Đóng giao diện chi tiết
    };

    const [counts, setCounts] = useState({});

    //* xóa từng sản phẩm
    const handleShowDelBook = (id, voucherID) => {
        setNotificationDelBook(true);
        setMaVoucher(id);
        setID(voucherID);
    }
    const handleCloseDelBook = () => {
        setNotificationDelBook(false);
        setMaVoucher('');
        setID('');
    }
    // * Hàm xóa thể loại
    const [notificationStatus, setNotificationStatus] = useState('');
    const [id, setID] = useState();
    const handleApplyDelBook = () => {
        const fetchData = async () => {
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
        fetchData();
    }
    // * Hàm xóa thể loại
    const handleDelete = () => {
        return deleteCategoryByMa(id)
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

    // * Click vào trang mấy
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)

        console.log(currentPage);
    }

    //* click vào cái nào
    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    };

    // * Đóng thông báo
    const [closeNotification, setCloseNotification] = useState(true);
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    const currentCategory = Array.isArray(categoryList)
        ? categoryList.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    //* const tableRows = currentItems.map((book, index) => ());
    const tableRows = currentCategory.map((category, index) => (
        <tr key={index} className='box-shadow_row'
            onClick={() => handleShowDetails(category.ma_the_loai, 'edit')}>
            <td style={{ width: '60px', textAlign: 'center' }}>
                <span>{index + 1 + indexOfFirstItem}</span>
            </td>

            <td style={{ width: '270px', textAlign: 'center' }}>{category.ten_the_loai}</td>
            <td style={{ width: '520px' }}>{category.mo_ta_the_loai}</td>
            <td style={{ width: '160px', textAlign: 'center' }}>
                {counts[category.ma_the_loai] !== undefined
                    ? counts[category.ma_the_loai]
                    : 'Loading...'}
            </td>
            <td style={{ width: '100px', textAlign: 'center', position: 'relative' }}>
                <button className='mg-location' type="button" onClick={(e) => {
                    e.stopPropagation();
                    handleShowDetails(category.ma_the_loai, 'edit')
                }}>
                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                </button>

                {counts[category.ma_the_loai] !== undefined && counts[category.ma_the_loai] <= 0 && (
                    <button className='mg-location2' onClick={(e) => {
                        e.stopPropagation();
                        handleShowDelBook(category.ten_the_loai, category.ma_the_loai)
                    }}>
                        <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                    </button>
                )}
            </td>
        </tr>
    ));

    useEffect(() => {
        setCategoryList(listCategory);
        const totalProducts = listCategory.length;
        setPagination(Math.ceil(totalProducts / selectedValue));
    }, [selectedValue, listCategory]);

    useEffect(() => {
        const fetchCounts = async () => {
            const newCounts = { ...counts };
            const requests = currentCategory
                .filter((category) => newCounts[category.ma_the_loai] === undefined)
                .map(async (category) => {
                    try {
                        const response = await getCountBookByStore(category.ma_the_loai);
                        newCounts[category.ma_the_loai] = response;
                    } catch (e) {
                        console.log(e);
                    }
                });
    
            await Promise.all(requests);
            setCounts(newCounts);
        };
    
        if (currentCategory.length > 0) {
            fetchCounts();
        }
    }, [categoryList, indexOfLastItem]); // Chỉ gọi khi component mount
    
    // Có thể thêm `categoryList` hoặc `indexOfFirstItem`, `indexOfLastItem` nếu cần chạy lại khi các giá trị này thay đổi
    

    return (
        <div>
            {/* hiển thị danh sách sản phẩm */}
            <div className="product-list">

                {
                    listCategory.length > 0
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
                            </div>
                        )
                        : ''
                }

                {
                    listCategory.length > 0
                        ?
                        (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '60px', textAlign: 'center' }}>
                                                Stt
                                            </th>
                                            <th style={{ width: '270px', textAlign: 'center' }}>Tên thể loại</th>
                                            <th style={{ width: '520px', textAlign: 'center' }}>Mô tả</th>
                                            <th style={{ width: '160px', textAlign: 'center' }}>Số sản phẩm</th>
                                            <th style={{ width: '150px', textAlign: 'center' }}></th>
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
                                <img className='notvoucher' src={`/images/categoryno.png`} alt="Hãy tạo voucher đầu tiên cho cửa hàng của bạn." />
                                <h3 style={{ bottom: '70px' }}>Không có thể loại sách.</h3>
                            </div>
                        )
                }
            </div>

            {
                listCategory.length > 0
                    ?
                    (<Pagination totalPages={pagination} onPageChange={handlePageChange}></Pagination>)
                    : ''
            }

            {/* <FontAwesomeIcon className='pagination-icon' icon={faAngleLeft}></FontAwesomeIcon> */}

            {/* <FontAwesomeIcon className='pagination-icon' icon={faAngleRight}></FontAwesomeIcon> */}

            {//selectedBook
                isDetailVisible && (
                    <CategoryForm
                        keyForm={key}
                        onClose={handleCloseDetails}
                        categoryID={categoryID}
                    />
                )
            }

            {/* {//selectedBook
                isDetailVisible && (
                    <CategoryForm
                        keyForm={'detail'}
                        onClose={handleCloseDetails}
                        categoryID={categoryID}
                    />
                )
            } */}

            {
                notificationDelBook && (
                    <Notification
                        title={'Xóa thể loại'}
                        content1={`Bạn muốn xóa thể loại: `}
                        content2={` ${maVoucher} ?`}
                        onClose={handleCloseDelBook}
                        onApply={handleApplyDelBook} />
                )
            }
            {notificationStatus === 'deleteIsSuccess' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="success"
                        title="Xóa thể loại"
                        description={`"Xóa thể loại thành công."`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
            {notificationStatus === 'deleteIsFail' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="error"
                        title="Xóa thể loại"
                        description={`"Xóa thất bại."`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
        </div>
    );
};

export default ListCategory;