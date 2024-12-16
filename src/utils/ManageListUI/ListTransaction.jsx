import React, { useEffect, useState } from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./ListProduct.css";
import Pagination from '../Pagination/Pagination';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

import VoucherForm from '../FormVisible/VoucherForm';
import Notification from '../Notification/Notification';
import NotificationUI from '../Notification/NotificationUI';
import { getGiaoDichByID, updateGiaoDich } from '../API/GiaoDichAPI';
import { getCuaHangById, getCuaHangByIdAdmin, updateCuaHang } from '../API/StoreAPI';

import { NotificationContainer, NotificationManager } from 'react-notifications';


const ListTransaction = ({ listBooks, keySearch }) => {
    const [pagination, setPagination] = useState();
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedValue, setSelectedValue] = useState(10); // số lượng sản phẩm hiển thị mỗi trang

    const indexOfLastItem = currentPage * selectedValue;
    const indexOfFirstItem = indexOfLastItem - selectedValue;
    // const currentItems = listBooks.slice(indexOfFirstItem, indexOfLastItem);

    const [isDetailVisible, setDetailVisible] = useState(false); // Trạng thái hiển thị chi tiết sách
    const [notificationDelGiaoDich, setNotificationDelGiaoDich] = useState(false); // Trạng thái hiển thị thông báo của del từng sản phẩm
    const [idGiaoDich, setIdGiaoDich] = useState(null);
    // * trạng thái voucher
    const [isHanSuDung, setIsHanSuDung] = useState(true);

    const handleShowNottification = (idGD) => {
        setNotificationDelGiaoDich(true);
        setIdGiaoDich(idGD);
    }
    const handleCloseDetails = () => {
        setDetailVisible(false); // Đóng giao diện chi tiết
        // setSelectedBook(null); // Xóa thông tin sách
    };

    const [notificationStatus, setNotificationStatus] = useState('');
    const [closeNotification, setCloseNotification] = useState(true);
    // *Hàm close notification
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    // hủy giao dịch
    const handleCloseGiaoDich = () => {
        setNotificationDelGiaoDich(false);
    }
    const handleApplyGiaoDich = () => {
        const fetchData = async () => {
            try {
                const giaoDichData = await getGiaoDichByID(idGiaoDich);

                const idCuaHang = giaoDichData.cua_hang?.ma_cua_hang;
                const cuaHang = await getCuaHangByIdAdmin(idCuaHang);

                const backDoanhthu = cuaHang.doanh_thu + giaoDichData.so_tien;
                const data = {
                    ...giaoDichData,
                    trang_thai: 2
                }
                const cuaHangUpdate = {
                    ...cuaHang,
                    doanh_thu: backDoanhthu
                }
                // const backDoanhthu = 

                const dataUpdate = await updateGiaoDich(data);
                const cuaHangUpdateData = await updateCuaHang(cuaHangUpdate);
                if (dataUpdate && cuaHangUpdateData) {
                    // setNotificationStatus('xacNhanIsSuccess');
                    NotificationManager.success('Thành công', 'Hủy giao dịch rút tiền');
                    setCloseNotification(true);
                    window.location.reload();
                }
            } catch (e) {
                setCloseNotification(true);

                NotificationManager.error('Thất bại', 'Hủy giao dịch rút tiền');

                console.log("Lỗi khi update giao dịch cửa hàng" + e);
            }
        }
        fetchData();
    }

    // click vào cái nào
    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
        console.log('Selected value:', event.target.value); // In ra giá trị được chọn
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)

        console.log(currentPage);
    }


    const handleGetTrangThaiGiaoDich = (trangThai) => {
        if (trangThai === 0) {
            return 'choduyet'
        } else if (trangThai === 1) {
            return 'conhang'
        } else {
            return 'hethang'
        }
    }
    const handleTextTrangThai = (trangThai) => {
        if (trangThai === 0) {
            return 'Đang xử lý'
        } else if (trangThai === 1) {
            return 'Đã rút'
        } else {
            return 'Thất bại'
        }
    }

    const [giaoDichByStore, setGiaoDichByStore] = useState([]);

    useEffect(() => {
        const totalProducts = listBooks.length;
        setGiaoDichByStore(listBooks)
        setPagination(Math.ceil(totalProducts / selectedValue));
    }, [selectedValue, listBooks]);

    const currentGiaoDich = Array.isArray(giaoDichByStore)
        ? giaoDichByStore.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    //* const tableRows = currentItems.map((book, index) => ());
    const tableRows = currentGiaoDich.map((giaoDich, index) => (
        <tr key={index}>
            <td style={{ width: '60px', textAlign: 'center' }}> <span>{index + 1 + indexOfFirstItem}</span>
            </td>

            <td style={{ width: '200px', textAlign: 'center' }}>{giaoDich.id_gd}</td>
            <td className='rut' style={{ width: '120px', textAlign: 'center' }}>Rút</td>
            <td style={{ width: '240px', textAlign: 'center' }}>{giaoDich.ngay_giao_dich}</td>
            <td style={{ width: '240px', textAlign: 'center' }}>{giaoDich.so_tien ? giaoDich.so_tien.toLocaleString('vi-VN') : 0}</td>
            {/* <td style={{ width: '110px', textAlign: 'center' }}>3.000.000</td>
            <td style={{ width: '170px', textAlign: 'center' }}>1.000.000</td> */}
            <td style={{ width: '170px', textAlign: 'center' }} className={handleGetTrangThaiGiaoDich(giaoDich.trang_thai)}>{handleTextTrangThai(giaoDich.trang_thai)}</td>
            <td style={{ width: '100px', textAlign: 'center' }}>
                {
                    giaoDich.trang_thai === 0 && (
                        <button type="button" onClick={(e) => {
                            e.stopPropagation();
                            handleShowNottification(giaoDich.id_gd)
                        }}>
                            <FontAwesomeIcon className='icon_opacity' icon={faTrashCan} />
                        </button>
                    )
                }
            </td>
        </tr>
    ));

    return (
        <div className='pointer-events-auto'>
            {/* hiển thị danh sách sản phẩm */}
            {
                listBooks.length > 0 ? (
                    <>
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
                            <div className="table-container" style={{ marginLeft: '80px' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '60px', textAlign: 'center' }}>
                                                Stt
                                            </th>
                                            <th style={{ width: '200px', textAlign: 'center' }}>Mã giao dịch</th>
                                            <th style={{ width: '120px', textAlign: 'center' }}>Loại giao dịch</th>
                                            <th style={{ width: '240px', textAlign: 'center' }}>Ngày giao dịch</th>
                                            <th style={{ width: '240px', textAlign: 'center' }}>Số tiền rút</th>
                                            {/* <th style={{ width: '190px', textAlign: 'center' }}>Số tiền trước giao dịch</th>
                                <th style={{ width: '190px', textAlign: 'center' }}>Số tiền sau giao dịch</th> */}
                                            <th style={{ width: '120px', textAlign: 'center' }}>Trạng thái</th>
                                            <th style={{ width: '100px', textAlign: 'center' }}></th>

                                        </tr>
                                    </thead>
                                    <tbody style={{ marginTop: '10px' }}>
                                        {tableRows}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {
                            listBooks.length > 10 && (
                                <Pagination totalPages={pagination} onPageChange={handlePageChange}></Pagination>
                            )
                        }
                    </>
                ) : (
                    <div className='component_center'>
                        <img className='storenotbook-notsearch2' src={`/images/business.png`} alt="Không tìm thấy sản phẩm." />
                        <h3 style={{ bottom: '0' }}>Không có giao dịch nào được thực hiện.</h3>
                    </div>
                )
            }

            <NotificationContainer />

            {
                notificationDelGiaoDich && (
                    <Notification
                        title={'Hủy giao dịch'}
                        content1={`Bạn chắc chắn muốn hủy giao dịch này.`}
                        onClose={handleCloseGiaoDich}
                        onApply={handleApplyGiaoDich} />
                )
            }
            
        </div>
    );
};

export default ListTransaction;