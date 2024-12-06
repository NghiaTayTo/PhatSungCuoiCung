import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import "./FormVisibleAll.css";
import "../ManageListUI/ListProduct.css";

import {StoreApi} from '../../StoreId';

import NotificationUI from '../Notification/NotificationUI';
import Notification from '../Notification/Notification';

import { getVouchersByCuaHangIdAndVoucherID, addVoucher, updateVoucherByID, deleteVoucherByID } from "../../utils/API/VoucherAPI";
import { getCuaHangById } from "../../utils/API/StoreAPI";

const VoucherForm = ({ keyForm, onClose, voucherID, nameShop }) => {

    // * Thông tin voucher
    const [voucher, setVoucher] = useState({});

    // *Check lỗi
    const [errors, setErrors] = useState({});

    // * Hạn sử dụng
    const [hsd, setHsd] = useState(0);

    // * Reload
    const [load, setLoad] = useState(false);

    // * Hiển thị thông báo
    const [notificationStatus, setNotificationStatus] = useState('');
    const [closeNotification, setCloseNotification] = useState(true);
    const [notificationDelBook, setNotificationDelBook] = useState(false);

    // *Hàm close notification
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    const handleInputChange = async (e) => {
        const { id, value } = e.target;

        let newValue = value;
        let newErrors = { ...errors };

        if (id === 'giam_gia' || id === 'gia_ap_dung' || id === 'so_lan_dung') {
            newValue = value.replace(/[^0-9]/g, '');
        }

        // Check thuộc tính mã voucher
        if (id === 'ten_voucher') {
            newValue = value.replace(/[^A-Za-z0-9]/g, ''); // Chỉ cho phép chữ cái và số

            if (newValue.length > 21) {
                newValue = newValue.slice(0, 21).toUpperCase();
            }
            newValue = newValue.toUpperCase();
        }
        const storeID  = await StoreApi();
        // Cập nhật voucher
        setVoucher(prevVoucher => ({
            ...prevVoucher,
            ma_cua_hang: storeID,
            dieu_kien: 'Chỉ dùng cho Shop',
            [id]: newValue
        }));

        // Kiểm tra các trường hợp liên quan đến ngày bắt đầu và ngày hết hạn
        if (id === 'ngay_het_han') {
            const ngayBatDau = voucher.ngay_bat_dau;
            const ngayHetHan = new Date(value);

            // TH1: nếu 'ngay_bat_dau' đã có và 'ngay_het_han' <= 'ngay_bat_dau'
            if (ngayBatDau) {
                const ngayBatDauDate = new Date(ngayBatDau);
                if (ngayHetHan <= ngayBatDauDate) {
                    newErrors.ngay_het_han = 'Ngày hết hạn không được trước hoặc bằng ngày bắt đầu.';
                } else {
                    newErrors.ngay_het_han = ''; // Xóa lỗi nếu ngày hợp lệ
                }
            }

            // TH2: nếu 'ngay_bat_dau' chưa có mà nhập 'ngay_het_han' trước
            if (!ngayBatDau) {
                newErrors.ngay_het_han = 'Vui lòng nhập ngày bắt đầu trước khi nhập ngày hết hạn.';
            }
        }

        if (id === 'ngay_bat_dau') {
            const ngayHetHan = voucher.ngay_het_han;
            const ngayBatDauDate = new Date(value);
            const currentDate = new Date().getTime();

            // Nếu đã nhập 'ngay_het_han', kiểm tra nếu ngày hết hạn <= ngày bắt đầu
            if (ngayBatDauDate < currentDate) {
                newErrors.ngay_bat_dau = 'Ngày bắt đầu không được trước ngày hiện tại.';
            } else {
                if (ngayHetHan) {
                    const ngayHetHanDate = new Date(ngayHetHan);
                    if (ngayHetHanDate <= ngayBatDauDate) {
                        newErrors.ngay_het_han = 'Ngày hết hạn không được trước hoặc bằng ngày bắt đầu.';
                    } else {
                        newErrors.ngay_het_han = ''; // Xóa lỗi nếu hợp lệ
                    }
                }
            }
        }

        const ngayBatDau = id === 'ngay_bat_dau' ? newValue : voucher.ngay_bat_dau;
        const ngayHetHan = id === 'ngay_het_han' ? newValue : voucher.ngay_het_han;

        if (ngayBatDau && ngayHetHan) {
            const ngayBatDauDate = new Date(ngayBatDau);
            const ngayHetHanDate = new Date(ngayHetHan);

            // Tính số ngày giữa hai ngày
            const timeDifference = ngayHetHanDate - ngayBatDauDate; // Tính sự khác biệt tính bằng milliseconds
            const daysDifference = timeDifference / (1000 * 3600 * 24); // Chuyển đổi từ milliseconds sang ngày

            setHsd(daysDifference); // Đặt giá trị Hsd (hiển thị số ngày sử dụng lên giao diện)
        }


        // Cập nhật trạng thái lỗi
        setErrors(newErrors);
    };


    // * Bấm nút tạo mới
    const handleSubmitAdd = (e) => {
        e.preventDefault();

        const newErrors = {};

        // Kiểm tra các trường dữ liệu
        if (!voucher.ten_voucher) {
            newErrors.ten_voucher = true;
        }
        if (!voucher.giam_gia) {
            newErrors.giam_gia = true;
        }
        if (!voucher.ngay_bat_dau) {
            newErrors.ngay_bat_dau = true;
        }
        if (!voucher.ngay_het_han) {
            newErrors.ngay_het_han = true;
        }
        if (!voucher.gia_ap_dung) {
            newErrors.gia_ap_dung = true;
        }
        if (!voucher.so_lan_dung) {
            newErrors.so_lan_dung = true;
        }

        // Nếu có lỗi, cập nhật trạng thái errors
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            handleAddVoucher(voucher)
        }
    };
    const handleSubmitUpdate = (e) => {
        e.preventDefault();

        const newErrors = {};

        // Kiểm tra các trường dữ liệu
        if (!voucher.ten_voucher) {
            newErrors.ten_voucher = true;
        }
        if (!voucher.giam_gia) {
            newErrors.giam_gia = true;
        }
        if (!voucher.ngay_bat_dau) {
            newErrors.ngay_bat_dau = true;
        }
        if (!voucher.ngay_het_han) {
            newErrors.ngay_het_han = true;
        }
        if (!voucher.gia_ap_dung) {
            newErrors.gia_ap_dung = true;
        }
        if (!voucher.so_lan_dung) {
            newErrors.so_lan_dung = true;
        }

        // Nếu có lỗi, cập nhật trạng thái errors
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            handleUpdateVoucher(voucher)
        }
    };

    // * Hàm check khi ng dùng click vào mà ko nhập dữ liệu
    const handleInputBlur = (e) => {
        const { id, value } = e.target;

        let newErrors = { ...errors };

        if (id === 'ngay_bat_dau') {
            const ngayBatDau = voucher.ngay_bat_dau;
            if (!ngayBatDau) {
                newErrors.ngay_bat_dau = 'Thông tin không hợp lệ!';
            } else {
                newErrors.ngay_bat_dau = '';
            }
        }

        if (id === 'ngay_het_han') {
            const ngayBatDau = voucher.ngay_het_han;
            if (!ngayBatDau) {
                newErrors.ngay_het_han = 'Thông tin không hợp lệ!';
            } else {
                newErrors.ngay_het_han = '';
            }
        }

        setErrors(newErrors);
    };


    //* Hàm lấy ảnh voucher
    const handleImageVoucher = (trangthai) => {
        switch (trangthai) {
            case 0:
                return 'chuaapdung';
            case 1:
                return 'hethan';
            case 2:
            default:
                return 'conhan';
        }
    };

    // * Hàm đặt màu voucher
    const getStatusText = (statusInt, ngayKetThuc) => {
        const currentDate = new Date();
        const endDate = new Date(ngayKetThuc);

        switch (statusInt) {
            case 0:
                return 'Chưa áp dụng';
            case 1:
                return 'Hết hạn';
            case 2:
            default:
                const remainingDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
                return remainingDays > 0 ? `Còn ${remainingDays} ngày` : 'Hết hạn';
        }
    };

    // * Hàm đóng xem chi tiết
    const handleIconClick = () => {
        if (load) {
            window.location.reload();
        } else {
            onClose();
        }
    };

    //* xóa từng sản phẩm

    const handleShowDelBook = () => {
        setNotificationDelBook(true);
    }
    const handleCloseDelBook = () => {
        setNotificationDelBook(false);
    }
    // const handleApplyDelBook = async () => {

    //     try {
    //         const isDeleted = await handleDelete();
    //         if (isDeleted) {
    //             window.location.reload();
    //             setNotificationStatus('deleteIsSuccess');
    //             alert('Xóa thành công 2')
    //         } else {
    //             setNotificationStatus('deleteIsFail');
    //             alert('Xóa thất bại 2')
    //         }
    //     } catch (error) {
    //         setNotificationStatus('deleteIsFail');
    //     }
    // }
    // const handleDelete = (e) => {
    //     return deleteVoucherByID(voucherID)
    //         .then(data => {
    //             handleCloseDelBook();
    //             alert('Xóa thành công 1')
    //             return true;
    //         })
    //         .catch(error => {
    //             handleCloseDelBook();
    //             console.error('Error deleting data:', error);
    //             alert('Xóa thất bại 1')
    //             return false;
    //         });
    // }
    //* xóa từng sản phẩm

    const handleUpdateVoucher = (voucher) => {
        updateVoucherByID(voucherID, voucher)
            .then(data => {
                // setBookUpdate(data);
                // alert('Cập nhật sản phẩm thành công!');
                // setBook(data);
                setNotificationStatus('updateIsSuccess');
                setLoad(true);
            })
            .catch(error => {
                setNotificationStatus('updateIsFail');
                console.error('Error updating data:', error);
            });
    }

    const handleAddVoucher = (voucher) => {
        addVoucher(voucher)
            .then(data => {
                setVoucher(data);
                setNotificationStatus('addIsSuccess');
                window.location.reload();
            })
            .catch(error => {
                setNotificationStatus('addIsFail');
                console.error('Error fetching data:', error);
            });
    }

    const fetchData = async () => {
        try {
            const data = await getVouchersByCuaHangIdAndVoucherID(voucherID);
            setVoucher(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [voucherID]);

    return (
        <div>
            <div className="bg_black">
                <div className='voucher-form'>
                    <div className='voucher-form_info'>
                        <img src={`/images/voucher_${handleImageVoucher(voucher.trangThai)}.png`} alt='phiếu giảm giá' />

                        {keyForm === 'addVoucher' && (
                            <p className='voucher-form_info--date'>{hsd} NGÀY</p>
                        )}
                        {keyForm === 'detailVoucher' && (
                            <p className='voucher-form_info--date'>{getStatusText(voucher.trangThai, voucher.ngay_het_han)}</p>
                        )}

                        {keyForm === 'addVoucher' && (
                            <p className={`voucher-form_info--name text_conhan`}>{nameShop}</p>
                        )}
                        {keyForm === 'detailVoucher' && (
                            <p className={`voucher-form_info--name text_${handleImageVoucher(voucher.trangThai)}`}>{voucher.cua_hang?.ten_cua_hang || ''}</p>
                        )}

                        <p className='voucher-form_info--id'>{voucher.ten_voucher}</p>
                        <p className='voucher-form_info--if'>CHỈ DÙNG CHO SHOP</p>
                        <p className='voucher-form_info--if2'>{'Giá tối thiểu ' + voucher.gia_ap_dung}</p>
                        <h3 className='voucher-form_info--price'>
                            {voucher.giam_gia ? (voucher.giam_gia / 1000) + 'K' : ''}
                        </h3>

                        <FontAwesomeIcon onClick={handleIconClick} icon={faXmark} className={`faXmark btnOnClose bg_${handleImageVoucher(voucher.trangThai)}`}></FontAwesomeIcon>

                    </div>

                    <div className="voucher-info">
                        {/* form điền thông tin sách */}
                        <form className="voucher-info_form">
                            <div className="voucher-info_form--item">
                                <div style={{ width: '48%' }}>
                                    <label htmlFor="ten_voucher">Mã voucher</label>
                                    <input
                                        className={errors.ten_voucher ? 'bd_error' : ''}
                                        onChange={handleInputChange}
                                        onBlur={handleInputBlur}
                                        value={voucher.ten_voucher}
                                        id="ten_voucher" type="text"
                                        style={{ textTransform: 'uppercase' }} />
                                    {errors.ten_voucher && <span>Thông tin không hợp lệ!</span>}
                                </div>
                                <div style={{ width: '48%' }}>
                                    <label htmlFor="ngay_bat_dau">Ngày áp dụng</label>
                                    <input
                                        className={errors.ngay_bat_dau ? 'bd_error' : ''}
                                        onChange={handleInputChange}
                                        onBlur={handleInputBlur}
                                        value={voucher.ngay_bat_dau}
                                        id="ngay_bat_dau" type="date"
                                    />

                                    {errors.ngay_bat_dau && <span>{errors.ngay_bat_dau}</span>}
                                </div>
                            </div>
                            <div className="voucher-info_form--item">
                                <div style={{ width: '48%' }}>
                                    <label htmlFor="giam_gia">Số tiền giảm giá</label>
                                    <input
                                        className={errors.giam_gia ? 'bd_error' : ''}
                                        onChange={handleInputChange}
                                        onBlur={handleInputBlur}
                                        value={voucher.giam_gia}
                                        id="giam_gia" type="text"
                                    />
                                    {errors.giam_gia && <span>Thông tin không hợp lệ!</span>}
                                </div>
                                <div style={{ width: '48%' }}>
                                    <label htmlFor="ngay_het_han">Ngày hết hạn</label>
                                    <input
                                        className={errors.ngay_het_han ? 'bd_error' : ''}
                                        onChange={handleInputChange}
                                        onBlur={handleInputBlur}
                                        value={voucher.ngay_het_han}
                                        id="ngay_het_han" type="date"
                                    />
                                    {errors.ngay_het_han && <span style={{ bottom: '-40px' }}>{errors.ngay_het_han}</span>}
                                </div>
                            </div>

                            <div className="voucher-info_form--item item-update">
                                <div>
                                    <label htmlFor="gia_ap_dung">Giá áp dụng</label>
                                    <input
                                        className={errors.gia_ap_dung ? 'bd_error' : ''}
                                        onChange={handleInputChange}
                                        onBlur={handleInputBlur}
                                        value={voucher.gia_ap_dung}
                                        id="gia_ap_dung" type="text" />
                                    {errors.gia_ap_dung && <span>Thông tin không hợp lệ!</span>}
                                </div>
                                <div>
                                    {/* <label for="name">Tiền giảm</label> */}
                                    <input id="dieu_kien" type="text" value={`Chỉ dùng cho Shop`} disabled />
                                </div>
                                <div>
                                    <label htmlFor="so_lan_dung">Số lần sử dụng</label>
                                    <input
                                        className={errors.so_lan_dung ? 'bd_error' : ''}
                                        onChange={handleInputChange}
                                        onBlur={handleInputBlur}
                                        value={voucher.so_lan_dung}
                                        id="so_lan_dung" type="text" />
                                    {errors.so_lan_dung && <span>Thông tin không hợp lệ!</span>}
                                </div>
                            </div>



                            {/* bấm vào nút thêm sản phẩm */}
                            {keyForm === 'addVoucher' && (
                                <div className="voucher-info_btn">
                                    <button onClick={onClose}>Hủy</button>
                                    <button onClick={handleSubmitAdd}>Tạo Voucher</button>
                                </div>
                            )}
                            {/* xem chi tiết sản phẩm */}
                            {keyForm === 'detailVoucher' && (
                                <div className="voucher-info_btn">
                                    <button onClick={() => handleShowDelBook()}>Xóa</button>
                                    <button className={`bg_${handleImageVoucher(voucher.trangThai)}`}
                                        onClick={handleSubmitUpdate}>Cập nhật</button>
                                </div>
                            )}

                        </form>
                    </div>

                </div>



                {notificationStatus === 'updateIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title="Cập nhật"
                            description={`"Cập nhật voucher thành công."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'updateIsFail' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="error"
                            title="Cập nhật"
                            description={`"Cập nhật voucher thất bại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'addIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title="Thêm voucher"
                            description={`"Tạo voucher mới thành công."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'addIsFail' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="error"
                            title="Thêm voucher"
                            description={`"Tạo voucher thất bại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}

                {notificationStatus === 'deleteIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title="Xóa voucher"
                            description={`"Xóa Voucher thành công."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'deleteIsFail' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="error"
                            title="Xóa voucher"
                            description={`"Voucher đang được sử dụng - xóa thất bại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
            </div>

            {
                notificationDelBook && (
                    <Notification
                        title={'Xóa voucher'}
                        content1={`Bạn muốn xóa voucher: `}
                        // content2={` ${voucher.ten_voucher} ?`}
                        onClose={handleCloseDelBook}
                    // onApply={handleApplyDelBook}
                    />
                )
            }

        </div>
    );
};

export default VoucherForm;