import React, { useEffect, useState } from 'react';
import { getCategory } from '../../../utils/API/CategoryAPI';
import { getBookByMaSP, getSanPhamById, updateSanPham } from '../../../utils/API/ProductAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NotificationUI from '../../../utils/Notification/NotificationUI';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const BookFormAdmin = ({ onClose, bookID, statusText, statusInt, trangThaiSach }) => {

    // * Thông tin sách
    const [book, setBook] = useState({})
    // * Thể loại
    const [category, setCategory] = useState([]);

    // * Hiện thông báo xóa sản phẩm
    const [notificationDelBook, setNotificationDelBook] = useState(false); // Trạng thái hiển thị thông báo của del từng sản phẩm
    const [nameBook, setNameBook] = useState(book.ten_san_pham); // Trạng thái hiển thị thông báo của del từng sản phẩm

    // *Check form
    const [errors, setErrors] = useState({});

    // * Hiển thị thông báo
    const [notificationStatus, setNotificationStatus] = useState('');
    const [closeNotification, setCloseNotification] = useState(true);

    // * Reload
    const [load, setLoad] = useState(false);

    const [textTrangThai, setTextTrangThai] = useState('')

    // *Hàm close notification
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    
    // * Hàm hiện thông báo xóa sản phẩm
    const handleShowDelBook = () => {
        setNotificationDelBook(true);
        setNameBook(book.ten_san_pham);
    }
    const handleCloseDelBook = () => {
        setNotificationDelBook(false);
        setNameBook('');
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy danh sách category
                const categoryData = await getCategory();
                setCategory(categoryData);

                // Lấy thông tin sản phẩm theo ID
                const data = await getBookByMaSP(bookID);
                setBook(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();  // Thực thi hàm fetchData

    }, [bookID]);


    const handleGetTrangThai = (trangThaiInt) => {
        if (trangThaiInt === 0) {
            return 'khoa';
        } else if (trangThaiInt === 1) {
            return 'conhang';
        } else if (trangThaiInt === 2) {
            return 'hethang';
        } else {
            return 'dangyeucau'
        }
    }

    // * Hàm đóng xem chi tiết
    const handleIconClick = () => {
        if (load) {
            window.location.reload();
        } else {
            onClose();
        }
    };

    // * Hàm duyệt sản phẩm
    const handleSubmitTrangThai = (key) => {
        try {
            if (key === 'duyet') {
                handleUpdateTrangThaiSanPham('trang_thai_duyet', true, 'Duyệt');
            } else if (key === 'khoa') {
                handleUpdateTrangThaiSanPham('trang_thai_khoa', true, 'Khóa');
            } else if (key === 'mokhoa') {
                handleUpdateTrangThaiSanPham('trang_thai_khoa', false, 'Mở khóa');
            }else if (key === 'huyyeucaumokhoa') {
                handleUpdateTrangThaiSanPham('trang_thai_duyet', true, 'Mở khóa');
            }
        } catch (error) {
            setNotificationStatus('duyetIsFail');
        }
    }

    const handleUpdateTrangThaiSanPham = async (name, value, code) => {
        try {
            const sanPham = {
                ...book,
                [name]: value
            }
            const isUpdated = await updateSanPham(sanPham);
            setTextTrangThai(`${code} sản phẩm`);

            if (isUpdated) {
                window.location.reload();
                setNotificationStatus('updateIsSuccess');
                setCloseNotification(true);
            } else {
                setNotificationStatus('updateIsFail');
                setCloseNotification(true);
            }
        } catch (error) {
            setNotificationStatus('updateIsFail');
            setCloseNotification(true);
        }
    }

    const handleXacNhanYeuCauMoKhoa = async () => {
        try {
            const sanPham = {
                ...book,
                trang_thai_duyet: true,
                trang_thai_khoa: false
            }
            const code = 'Mở khóa';
            const isUpdated = await updateSanPham(sanPham);
            setTextTrangThai(`${code} sản phẩm`);

            if (isUpdated) {
                window.location.reload();
                setNotificationStatus('updateIsSuccess');
                setCloseNotification(true);
            } else {
                setNotificationStatus('updateIsFail');
                setCloseNotification(true);
            }
        } catch (error) {
            setNotificationStatus('updateIsFail');
            setCloseNotification(true);
        }
    }

    return (
        <div>
            <div className="bg_black">
                <div className="addnewbook">
                    <div className="addnewbook-header">
                        <div>
                            <h3>{book.ten_san_pham}</h3>
                            <span className={handleGetTrangThai(statusInt)}>{statusText}</span>
                        </div>
                        <FontAwesomeIcon onClick={handleIconClick} style={{ cursor: 'pointer' }} className="faXmark" icon={faXmark}></FontAwesomeIcon>
                    </div>
                    {/* form điền thông tin sách */}
                    <div className="addnewbook-form">
                        <div className="addnewbook-form_img">
                            <img src={`${book.anh_san_pham}`} />
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="fileInput"
                                    style={{ cursor: 'pointer', display: 'none' }} // Đổi con trỏ thành kiểu click
                                />
                            </div>
                        </div>
                        <div className="addnewbook-form_info">
                            <div>
                                <label htmlFor="ten_san_pham">Tên sách</label>
                                <input
                                    className={errors.ten_san_pham ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="ten_san_pham"
                                    type="text"
                                    value={book.ten_san_pham}
                                    disabled
                                />
                            </div>
                            <div>
                                <label for="name">Tác giả</label>
                                <input
                                    className={errors.tac_gia ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="tac_gia" type="text"
                                    value={book.tac_gia}
                                    disabled
                                />
                            </div>
                            <div>
                                <label for="name">Thể loại</label>
                                <input
                                    className={errors.the_loai ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="the_loai" type="text"
                                    value={book.the_loai?.ten_the_loai}
                                    disabled
                                />
                            </div>
                            <div>
                                <label for="name">Mã ISBN
                                    <span style={{ color: 'gray', top: '2px', right: '103px' }}>( không bắt buộc )</span>
                                </label>
                                <input
                                    className='btnCheckBorder-default'
                                    id="ma_isbn"
                                    type="text"
                                    value={book.ma_isbn}
                                    disabled
                                />
                            </div>
                            <div>
                                <label for="name">Số lượng sách bán ra</label>
                                <input
                                    className={errors.so_luong_hang ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="so_luong_hang"
                                    type="text"
                                    value={book.so_luong_hang}
                                />
                            </div>
                        </div>
                        <div className="addnewbook-form_info">
                            <div>
                                <label for="name">Năm xuất bản
                                </label>
                                <input
                                    className={errors.ngay_xuat_ban ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="ngay_xuat_ban"
                                    type="date"
                                    value={book.ngay_xuat_ban}
                                    disabled
                                />
                            </div>
                            <div>
                                <label for="name">Số trang</label>
                                <input
                                    className={errors.so_trang ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="so_trang"
                                    type="text"
                                    value={book.so_trang}
                                    disabled
                                />
                            </div>
                            <div>
                                <label for="name">Giá</label>
                                <input
                                    className={errors.gia ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="gia"
                                    type="text"
                                    value={book.gia}
                                    disabled
                                />
                            </div>
                            <div>
                                <label for="name">Ngôn ngữ</label>
                                <input
                                    className='btnCheckBorder-default'
                                    id="ngon_ngu"
                                    type="text"
                                    value={'Tiếng việt'}
                                    disabled />
                            </div>
                            <div>
                                <label for="name">Phiên bản</label>
                                <input
                                    className={errors.phien_ban ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="phien_ban"
                                    type="text"
                                    value={book.phien_ban}
                                    disabled
                                />
                            </div>
                        </div>
                        {/* <div className="addnewbook-form_longinp1">
                            <div>
                                <label for="name">Hình thức
                                    {keyForm === 'add-book' && keyForm === 'detail-book' && (
                                        <span>( thông tin này nhằm mô tả chi tiết sản phẩm của bạn )</span>
                                    )}

                                </label>
                                <input className={errors.ten_san_pham ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'} id="name" type="text" placeholder="VD: chất liệu của sách, kích thước, độ dày trang sách,v.v..." />
                            </div>
                        </div> */}
                        <div className="addnewbook-form_longinp2">
                            <div>
                                <label for="name">Tóm tắt nội dung sách</label>
                                <textarea
                                    className={errors.mo_ta ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="mo_ta"
                                    value={book.mo_ta}
                                    type="text"
                                    disabled
                                    placeholder="VD: tóm tắt ngắn gọn nội dung, gây tò mò cho người mua..." />
                            </div>
                        </div>

                        {/* bấm vào nút thêm sản phẩm */}
                        {trangThaiSach === 'new_book' && (
                            <div className="addnewbook-form_btn">
                                <button onClick={onClose}>Hủy yêu cầu</button>
                                <button onClick={() => handleSubmitTrangThai('duyet')}>Duyệt sản phẩm</button>
                            </div>
                        )}
                        {trangThaiSach === 'vipham' && (
                            <div className="addnewbook-form_btn">
                                <button onClick={onClose}>Thoát</button>
                                <button onClick={() => handleSubmitTrangThai('khoa')}>Khóa sản phẩm</button>
                            </div>
                        )}
                        {/* xem chi tiết sản phẩm */}
                        {trangThaiSach === 'book_disabled' && (
                            <div className="addnewbook-form_btn">
                                <button onClick={() => handleShowDelBook()}>Thoát</button>
                                <button onClick={() => handleSubmitTrangThai('mokhoa')}>Mở khóa sách</button>
                            </div>
                        )}
                        {trangThaiSach === 'yeucaumokhoa' && (
                            <div className="addnewbook-form_btn">
                                <button onClick={() => handleSubmitTrangThai('huyyeucaumokhoa')}>Hủy yêu cầu</button>
                                <button onClick={handleXacNhanYeuCauMoKhoa}>Xác nhận yêu cầu</button>
                            </div>
                        )}
                        
                        {trangThaiSach === 'for_sale' && (
                            <div className="addnewbook-form_btn">
                                <button style={{marginLeft: '295px'}} onClick={onClose}>Thoát</button>
                            </div>
                        )}
                    </div>
                </div>
                {notificationStatus === 'updateIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title="Cập nhật"
                            description={`"Cập nhật sách thành công."`}
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
                            description={`"Cập nhật sách thất bại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'addBookIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title="Thêm sách"
                            description={`"Tạo sách mới thành công."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'addBookIsFail' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="error"
                            title="Thêm sách"
                            description={`"Tạo sách mới thất bại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
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
                {notificationStatus === 'updateIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title={textTrangThai}
                            description={`"Thành công."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'updateIsFail' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="error"
                            title={textTrangThai}
                            description={`"Thất bại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
            </div>

        </div>
    );
};

export default BookFormAdmin;