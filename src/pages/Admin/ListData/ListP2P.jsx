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

const ListP2P = ({ p2pList = [], keySearch, searchName, typeTranSaction }) => {

    const navigate = useNavigate();

    const handleRowClick = (storeID) => {
        navigate('/admin/manager-store-details-phidichvu', { state: { storeID, form: 'comment' } });
    };

    // * Mảng các Sản phẩm
    const [productList, setProductList] = useState([]);
    // * Phân trang
    const [pagination, setPagination] = useState();
    // * Trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    // * Mỗi trang 10 sản phẩm
    const [selectedValue, setSelectedValue] = useState(10); // số lượng sản phẩm hiển thị mỗi trang

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



    const getTrangThaiCSS = (id) => {
        if (id === 0) {
            return 'choduyet';
        } else if (id === 1) {
            return 'xong';
        } else {
            return 'huy';
        }
    }
    const getTrangThaiText = (id) => {
        if (id === 0) {
            return 'Chờ duyệt';
        } else if (id === 1) {
            return 'Đã rút tiền';
        } else {
            return 'Đã hủy';
        }
    }

    const tableRowsNap = currentProducts.map((giaoDich, index) => (
        <tr key={index} className={`box-shadow_row`}
        // onClick={() => handleShowDetails(store.trang_thai_tk, store.id_tai_khoan)}
        >
            <td>
                <span>{index + 1 + indexOfFirstItem}</span>
            </td>

            <td style={{ width: '120px', textAlign: 'center' }}>
                {giaoDich.id_vi}
            </td>
            <td style={{ width: '160px', textAlign: 'center' }}>{giaoDich.vi?.tai_khoan?.ho_ten}</td>
            <td style={{ width: '160px', textAlign: 'center', padding: '0 20px' }}>{giaoDich.amount}</td>
            {/* <td style={{ width: '160px', textAlign: 'center', padding: '0 20px' }}>{giaoDich.amount ? giaoDich.amount.toLocaleString('vi-VN') : 0}</td> */}
            <td style={{ width: '150px', textAlign: 'center' }}>{giaoDich.transactionDate}</td>
            <td style={{ width: '300px', textAlign: 'center' }}>{giaoDich.description}</td>
            <td style={{ width: '120px', textAlign: 'center' }}>Nạp tiền</td>
            <td style={{ width: '120px', textAlign: 'center', fontWeight: '500' }} className='conhang'>
                Hoàn thành
            </td>
        </tr>
    )
    );

    const tableRowsRut = currentProducts.map((giaodich, index) => (
        <tr key={index} >
            <td style={{ width: '20px', textAlign: 'center' }}>
                <span style={{ marginTop: '3px' }}>{index + 1 + indexOfFirstItem}</span>
            </td>
            <td style={{ width: '120px', textAlign: 'center' }}>{giaodich.id_gd}</td>
            <td style={{ width: '150px', textAlign: 'center' }}>{giaodich.cua_hang?.ten_cua_hang}</td>
            <td style={{ width: '100px', textAlign: 'center' }}>Rút</td>
            <td style={{ width: '150px', textAlign: 'center' }}>{giaodich.so_tien?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
            <td style={{ width: '120px', textAlign: 'center' }}>{giaodich.ngay_giao_dich}</td>
            <td style={{ width: '170px', textAlign: 'center' }}>{giaodich.mo_ta}</td>

            <td style={{ width: '120px', textAlign: 'center', fontWeight: '500' }} >
                {
                    giaodich.trang_thai === 0 ? (
                        <img src={giaodich.anh_qr} alt="QR Code" />
                    ) : (
                        <img src="/images/giaodich.png" alt="QR Code" />
                    )
                }

            </td>

            <td style={{ width: '120px', textAlign: 'center' }} className={getTrangThaiCSS(giaodich.trang_thai)}>{getTrangThaiText(giaodich.trang_thai)}</td>
            <td style={{ width: '60px', textAlign: 'center' }}>
                <button type="button" >
                    <FontAwesomeIcon icon={faEye} />
                </button>
            </td>
        </tr>
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
        const totalProducts = p2pList.length;
        setProductList(p2pList)
        setPagination(Math.ceil(totalProducts / selectedValue)); // số trang tổng cộng
    }, [selectedValue, p2pList]);

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

                                        {
                                            typeTranSaction === 'nap' ? (
                                                <>
                                                    <tr>
                                                        <th style={{ width: '40px' }}>
                                                            Stt
                                                        </th>
                                                        <th style={{ width: '120px', textAlign: 'center' }}>Mã ví</th>
                                                        <th style={{ width: '160px', textAlign: 'center' }}>Tài khoản</th>
                                                        <th style={{ width: '160px', textAlign: 'center' }}>Số tiền nạp</th>
                                                        <th style={{ width: '150px', textAlign: 'center' }}>Ngày giao dịch</th>
                                                        <th style={{ width: '300px', textAlign: 'center' }}>Nội dung</th>
                                                        <th style={{ width: '120px', textAlign: 'center' }}>Loại giao dịch</th>
                                                        <th style={{ width: '120px', textAlign: 'center' }}>Trạng thái</th>
                                                    </tr>
                                                </>
                                            ) : (
                                                <>
                                                    <th style={{ width: '20px', textAlign: 'center' }}>
                                                        Stt
                                                    </th>
                                                    <th style={{ width: '120px', textAlign: 'center' }}>Mã giao dịch</th>
                                                    <th style={{ width: '150px', textAlign: 'center' }}>Cửa hàng</th>
                                                    <th style={{ width: '100px', textAlign: 'center' }}>Loại giao dịch</th>
                                                    <th style={{ width: '150px', textAlign: 'center' }}>Số tiền</th>
                                                    <th style={{ width: '120px', textAlign: 'center' }}>Ngày yêu cầu</th>
                                                    <th style={{ width: '170px', textAlign: 'center' }}>Mô tả</th>
                                                    <th style={{ width: '120px', textAlign: 'center' }}>QR Code</th>
                                                    <th style={{ width: '120px', textAlign: 'center' }}>Trạng thái</th>
                                                    <th style={{ width: '60px', textAlign: 'center' }}></th>
                                                </>
                                            )
                                        }

                                    </thead>
                                    <tbody style={{ marginTop: '10px' }}>
                                        {
                                            typeTranSaction === 'nap' ? (
                                                <>{tableRowsNap}</>
                                            ) : (
                                                <> {tableRowsRut}</>
                                            )
                                        }

                                        {/* { tableRowsNap } */}

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

export default ListP2P;