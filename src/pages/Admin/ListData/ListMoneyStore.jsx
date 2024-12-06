import { faEye, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faArrowDownLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import Notification from '../../../utils/Notification/Notification';
import NotificationUI from '../../../utils/Notification/NotificationUI';
import Pagination from '../../../utils/Pagination/Pagination';
import CustomerForm from '../FormDetailsAdmin/CustomerForm';
import { OverlayTrigger } from 'react-bootstrap';
import { renderTooltip } from '../../../utils/Order/ToolTip';
import StoreFromAdmin from '../FormDetailsAdmin/StoreFromAdmin';
import { useNavigate } from 'react-router-dom';

const ListMoneyStore = ({ storeList = [], keySearch, searchName, trangThaiTK }) => {

    const navigate = useNavigate();

    const handleRowClick = (storeID) => {
        navigate('/admin/manager-store-details', { state: { storeID, form: 'comment' } });
    };

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
    const [selectedStore, setSelectedStore] = useState(null); // Trạng thái lưu thông tin sách đang xem
    const [isDetailVisible, setIsDetailVisible] = useState(false); // Trạng thái hiển thị chi tiết sách
    const [notificationDelAll, setNotificationDelAll] = useState(false); // Trạng thái hiển thị thông báo của del all
    const [exportExcel, setExportExcel] = useState(false); // Từ khóa tìm kiếm

    // ** Ẩn hiện form chi tiết tài khoản
    const handleShowDetails = (idStore) => {
        setSelectedStore(idStore);
        setIsDetailVisible(true);
    };
    const handleCloseDetails = () => {
        setSelectedStore(null);
        setIsDetailVisible(false);
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

    //* click vào cái nào
    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const currentProducts = Array.isArray(productList)
        ? productList.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    const handleGetTrangThai = (trangThai) => {
        if (trangThai === 11) {
            return 'dangyeucau';
        } else if (trangThai === 12) {
            return 'huy';
        } else if (trangThai === 13) {
            return 'conhang';
        } else if (trangThai === 14) {
            return 'khoa';
        } else if (trangThai === 15) {
            return 'yeucau';
        } else if (trangThai === 16) {
            return 'huy';
        }
    }

    const tableRows = currentProducts.map((store, index) => (

        <OverlayTrigger
            key={index}
            placement="left"  // top, right, bottom, left)
            overlay={(props) => renderTooltip(props, 'Bấm vào để xem chi tiết cửa hàng', 'custom-tooltip')}
        >
            <tr key={index} onClick={() => handleRowClick(store.ma_cua_hang)} className={`box-shadow_row`}
            // onClick={() => handleShowDetails(store.trang_thai_tk, store.id_tai_khoan)}
            >
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
                        // src={`${store.anh_dai_dien}`} 
                        src={store.anh_dai_dien}
                        alt="store" />
                </td>
                <td style={{ width: '210px', fontWeight: '600' }}>{store.ten_cua_hang}</td>
                <td style={{ width: '190px', textAlign: 'center', padding: '0 20px' }}>{store.email}</td>
                <td style={{ width: '150px', textAlign: 'center' }}>{store.so_dien_thoai}</td>
                <td style={{ width: '130px', textAlign: 'center' }}>{store.tong_luot_ban ? store.tong_luot_ban.toLocaleString('vi-VN') : 0}</td>
                <td style={{ width: '130px', textAlign: 'center' }}>{store.diem_cua_hang ? (Math.round(store.diem_trung_binh * 10) / 10) : '0 / 5'}</td>
                <td style={{ width: '100px', textAlign: 'center' }}>{store.doanh_thu ? store.doanh_thu.toLocaleString('vi-VN') : 0}</td>
                {/* <td style={{ width: '100px', textAlign: 'center' }}>{store.tong_luot_ban}</td> */}
                <td style={{ width: '100px', textAlign: 'center', fontWeight: '500' }} className={handleGetTrangThai(store.trang_thai_cua_hang?.ma_trang_thai_cua_hang)}>
                    {store.trang_thai_cua_hang?.ten_trang_thai_cua_hang}
                </td>
            </tr>
        </OverlayTrigger>
    )
    );

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

    // *Tổng số trang (số lượng sản phẩm / 10)
    useEffect(() => {
        const totalProducts = storeList.length;
        setProductList(storeList)
        setPagination(Math.ceil(totalProducts / selectedValue)); // số trang tổng cộng
    }, [selectedValue, storeList]);

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
                                            <th style={{ width: '210px' }}>Tên cửa hàng</th>
                                            <th style={{ width: '140px', textAlign: 'center' }}>Email</th>
                                            <th style={{ width: '120px', textAlign: 'center' }}>Số điện thoại</th>
                                            <th style={{ width: '100px', textAlign: 'center' }}>Lượt bán</th>
                                            <th style={{ width: '100px', textAlign: 'center' }}>Điểm</th>
                                            <th style={{ width: '150px', textAlign: 'center' }}>Doanh thu</th>
                                            <th style={{ width: '100px', textAlign: 'center' }}>Trạng thái</th>
                                            {/* <th style={{ width: '80px', textAlign: 'center' }}></th> */}
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
                                <img style={{ marginTop: '23px' }} className='storenotbook' src={`/images/notstore.png`} alt="Hãy tạo sản phẩm đầu tiên của bạn." />

                                <div>
                                    {
                                        keySearch === 'searchIsNull'
                                            ? (<h3 style={{ bottom: '0' }}>Không tìm thấy cửa hàng<strong>{searchName ? `: ${searchName}` : ''}</strong>.</h3>)
                                            : (<h3 style={{ bottom: '10px' }}>Hệ thống chưa có cửa hàng.</h3>)
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
            {
                isDetailVisible && (
                    <StoreFromAdmin
                        storeId={selectedStore}
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

export default ListMoneyStore;