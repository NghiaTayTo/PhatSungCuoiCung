import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeLowVision, faXmark } from "@fortawesome/free-solid-svg-icons";

import "./FormVisibleAll.css";

import NotificationUI from '../Notification/NotificationUI';
import Notification from '../Notification/Notification';

import { StoreApi } from '../../StoreId';
import { getSanPhamById, updateSanPham, addSanPham, deleteBook } from '../../utils/API/ProductAPI';
import { getCategory, getCategoryByID } from '../../utils/API/CategoryAPI';
// import axios from 'axios';

import { handleImageUpload } from '../../utils/Order/UploadImageFileOnCloud';
import { OverlayTrigger } from 'react-bootstrap';
import { renderTooltip } from '../Order/ToolTip';
import { getSOL, getSolanaPrice, getUSD_VND } from '../API/SolanaAPI';
import { getCuaHangByIdAdmin } from '../API/StoreAPI';
import SolanaForm from './SolanaForm';
import { faSquarespace } from '@fortawesome/free-brands-svg-icons';

const BookForm = ({ keyForm, onClose, bookID, statusText, statusInt }) => {

    const [storeID, setStoreID] = useState(0);
    // * Thông tin sách
    const [book, setBook] = useState({})
    // * Hình ảnh được chọn
    const [selectedImage, setSelectedImage] = useState(null);
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

    // *Hàm close notification
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    // * Hàm xử lý khi người dùng chọn ảnh
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Tạo URL tạm thời để hiển thị ảnh đã chọn
        setSelectedImage(URL.createObjectURL(file));

        const storeID = await StoreApi();

        try {
            // Tải ảnh lên Cloudinary
            const uploadedImageUrl = await handleImageUpload(file);

            console.log("Uploaded Image URL:", uploadedImageUrl);

            // Cập nhật thông tin sản phẩm với URL ảnh từ Cloudinary
            setBook(prevBook => ({
                ...prevBook,
                ma_cua_hang: storeID,
                anh_san_pham: uploadedImageUrl
            }));
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const [solPrice, setSolPrice] = useState(0);
    // const [usdToVndRate, setUsdToVndRate] = useState(null);

    const getSol = async (vndAmount) => {
        try {
            const sol = await getSOL();
            const usdToVndRate = await getUSD_VND();
            const solAmount = (vndAmount / (usdToVndRate * sol)).toFixed(6);
            setBook(prevBook => ({
                ...prevBook,
                gia_sol: solAmount
            }));
        } catch (e) {
            console.log(e);
        }
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        // Chỉ thay đổi giá trị nếu cần thiết
        let newValue = value;

        if (id === 'gia' || id === 'so_trang' || id === 'so_luong_hang') {
            newValue = value.replace(/[^0-9]/g, ''); // Giới hạn chỉ cho phép số
            if (id === 'gia') {
                getSol(newValue);
            }
        }

        if (keyForm === 'add-book') {
            setBook(prevBook => ({
                ...prevBook,
                doanh_thu: 0,
                da_ban: 0,
                diem_trung_binh: 0,
                ma_cua_hang: storeID,
                [id]: newValue
            }));
        }
        if (keyForm === 'detail-book') {
            setBook(prevBook => ({
                ...prevBook,
                ma_cua_hang: storeID,
                [id]: newValue
            }));
        }
    };


    //* Hàm xử lý khi chọn thể loại
    const handleSelectChange = async (e) => {
        const selectedValue = e.target.value;

        const storeID = await StoreApi();

        if (selectedValue && keyForm === 'add-book') {
            getCategoryByID(selectedValue)
                .then(data => {
                    if (data) {
                        setBook(prevBook => ({
                            ...prevBook,
                            ma_cua_hang: storeID,
                            the_loai: data
                        }));
                    } else {
                        alert('thể loại null')
                    }
                })
                .catch(error => {
                    console.error('Vui vậy thôi chứ bố dặn con này:', error);
                    throw error;
                });
        }

        if (selectedValue && keyForm === 'detail-book') {
            getCategoryByID(selectedValue)
                .then(data => {
                    setBook(prevBook => ({
                        ...prevBook,
                        the_loai: data
                    }));
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    throw error;
                });
        }
    };

    // * Bấm nút tạo mới
    const handleSubmitAdd = (e) => {
        // e.preventDefault();

        const newErrors = {};

        // Kiểm tra các trường dữ liệu
        if (!book.anh_san_pham) {
            newErrors.anh_san_pham = true;
        }
        if (!book.ten_san_pham) {
            newErrors.ten_san_pham = true;
        }
        if (!book.gia) {
            newErrors.gia = true;
        }
        if (!book.so_trang) {
            newErrors.so_trang = true;
        }
        if (!book.ngay_xuat_ban) {
            newErrors.ngay_xuat_ban = true;
        }
        if (!book.tac_gia) {
            newErrors.tac_gia = true;
        }
        if (!book.phien_ban) {
            newErrors.phien_ban = true;
        }
        if (!book.mo_ta) {
            newErrors.mo_ta = true;
        }
        if (!book.so_luong_hang) {
            newErrors.so_luong_hang = true;
        }
        if (!book.the_loai || !book.the_loai.ma_the_loai) {
            newErrors.the_loai = true;
        }

        // Nếu có lỗi, cập nhật trạng thái errors
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            handleAddBook(book)
        }
    };

    const handleSubmitUpdate = (e) => {
        // e.preventDefault();

        const newErrors = {};

        // Kiểm tra các trường dữ liệu
        if (!book.anh_san_pham) {
            newErrors.anh_san_pham = true;
        }
        if (!book.ten_san_pham) {
            newErrors.ten_san_pham = true;
        }
        if (!book.gia) {
            newErrors.gia = true;
        }
        if (!book.so_trang) {
            newErrors.so_trang = true;
        }
        if (!book.ngay_xuat_ban) {
            newErrors.ngay_xuat_ban = true;
        }
        if (!book.tac_gia) {
            newErrors.tac_gia = true;
        }
        if (!book.phien_ban) {
            newErrors.phien_ban = true;
        }
        if (!book.mo_ta) {
            newErrors.mo_ta = true;
        }
        if (!book.so_luong_hang) {
            newErrors.so_luong_hang = true;
        }
        if (!book.the_loai || !book.the_loai.ma_the_loai) {
            newErrors.the_loai = true;
        }

        // Nếu có lỗi, cập nhật trạng thái errors
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            handleUpdateBook(book)
        }
    };

    // * Hàm check khi ng dùng click vào mà ko nhập dữ liệu
    const handleInputBlur = (e) => {
        const { id, value } = e.target;

        // Kiểm tra nếu giá trị bị bỏ trống
        setErrors(prevErrors => ({
            ...prevErrors,
            [id]: value === ''  // true nếu không có dữ liệu
        }));
    };

    // * Hàm thêm sản phẩm mới
    const handleAddBook = (book) => {
        const newBook = {
            ...book,
            trang_thai_duyet: false,
            trang_thai_khoa: false
        };

        const fetchData = async () => {
            const response = await addSanPham(newBook);
            if (response) {
                setBook(response);
                setNotificationStatus('addBookIsSuccess');
                window.location.reload();
            } else {
                setNotificationStatus('addBookIsFail');
            }
        };

        fetchData();
    };

    const handleUpdateYeuCauMoKhoa = async () => {
        try {
            const bookData = {
                ...book,
                trang_thai_duyet: false,
                trang_thai_khoa: true,
            };
            const response = await updateSanPham(bookData);
            if (response) {
                window.location.reload();
                setNotificationStatus('moKhoaIsSuccess');
            }
        } catch (e) {
            console.log(e);
            setNotificationStatus('moKhoaIsFail');
        }
    }

    const handleUpdateHuyYeuCauMoKhoa = async () => {
        try {
            const bookData = {
                ...book,
                trang_thai_duyet: true,
                trang_thai_khoa: true,
            };
            const response = await updateSanPham(bookData);
            if (response) {
                window.location.reload();
                setNotificationStatus('huymoKhoaIsSuccess');
            }
        } catch (e) {
            console.log(e);
            setNotificationStatus('huymoKhoaIsFail');
        }
    }


    // * Hàm update sản phẩmm
    const handleUpdateBook = (book) => {
        const fetchData = async () => {
            const response = await updateSanPham(book);
            if (response) {
                setNotificationStatus('updateIsSuccess');
                setLoad(true);
            } else {
                setNotificationStatus('updateIsFail');
            }
        };

        fetchData();
    };

    const handleUpdateAnBook = (key) => {
        const fetchData = async () => {
            try {
                const an = book.an_san_pham;
                const bookData = {
                    ...book,
                    an_san_pham: !an,
                };
                const response = await updateSanPham(bookData);
                if (response) {
                    window.location.reload();
                    if (key === 'hien') {
                        setNotificationStatus('hienIsSuccess');
                    } else {
                        setNotificationStatus('anIsSuccess');
                    }
                }
            } catch (e) {
                console.log(e);
                if (key === 'hien') {
                    setNotificationStatus('hienIsFail');
                } else {
                    setNotificationStatus('anIsFail');
                }
            }
        };

        fetchData();
    }

    // * Hàm duyệt sản phẩm
    const handleSubmitTrangThai = (key) => {
        try {
            if (key === 'duyet') {
                handleUpdateTrangThaiSanPham('trang_thai_duyet', true, 'Duyệt');
            } else if (key === 'khoa') {
                handleUpdateTrangThaiSanPham('trang_thai_khoa', true, 'Khóa');
            } else if (key === 'mokhoa') {
                handleUpdateTrangThaiSanPham('trang_thai_khoa', false, 'Mở khóa');
            }
        } catch (error) {
            setNotificationStatus('duyetIsFail');
        }
    }

    const [textTrangThai, setTextTrangThai] = useState('');
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

    // * Hàm xóa sản phẩm
    const handleApplyDelBook = async () => {
        try {
            const isDeleted = await handleDelete();
            if (isDeleted) {
                window.location.reload();
                setNotificationStatus('deleteIsSuccess');
            }
        } catch (error) {
            setNotificationStatus('deleteIsFail');
        }
    }

    // * Hàm xóa sản phẩm
    const handleDelete = () => {
        return deleteBook(bookID)
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

    // * Hàm hiện thông báo xóa sản phẩm
    const handleShowDelBook = () => {
        setNotificationDelBook(true);
        setNameBook(book.ten_san_pham);
    }
    const handleCloseDelBook = () => {
        setNotificationDelBook(false);
        setNameBook('');
    }

    const [shop, setShop] = useState({});
    const [solForm, setSolForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storeID = await StoreApi();
                setStoreID(storeID);
                // Lấy danh sách category
                const categoryData = await getCategory();
                setCategory(categoryData);

                // Lấy thông tin sản phẩm theo ID
                if (keyForm === 'detail-book') {
                    const data = await getSanPhamById(bookID);
                    setBook(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();  // Thực thi hàm fetchData

    }, [bookID]);


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
            return 'yeucaumokhoa'
        }
    }

    const [showThongKe, setShowThongKe] = useState(false);

    const handleShowThongKe = () => {
        setShowThongKe(!showThongKe);
    }

    // * Hàm đóng xem chi tiết
    const handleIconClick = () => {
        if (load) {
            window.location.reload();
        } else {
            onClose();
        }
    };

    return (
        <div>
            <div className="bg_black">
                <div className="addnewbook" id='form-width'>
                    <div className="addnewbook-header">
                        {keyForm === 'add-book' && (
                            <h3>Thêm sách mới</h3>
                        )}
                        {/* xem chi tiết sản phẩm */}
                        {(keyForm === 'detail-book' || keyForm === 'admin') && (
                            <>
                                <div>
                                    <h3>{book.ten_san_pham}</h3>
                                    <span className={handleGetTrangThai(statusInt)}>{statusText}</span>
                                    {
                                        book.an_san_pham && <span className='ansach'>Sách đang ẩn</span>
                                    }

                                </div>
                            </>
                        )}

                        {/* Sách bán chạy */}
                        {keyForm === 'best-selling' && (
                            <div>
                                <h3>{book.ten_san_pham}</h3>
                            </div>
                        )}
                        <div>
                            {
                                keyForm === 'detail-book' && statusInt !== 1 && (
                                    <OverlayTrigger
                                        placement="left"  // top, right, bottom, left)
                                        overlay={(props) => renderTooltip(props, 'Thống kê sản phẩm', 'custom-tooltip')}
                                    >
                                        <FontAwesomeIcon onClick={handleShowThongKe} className="faXmark" icon={faSquarespace}></FontAwesomeIcon>
                                    </OverlayTrigger>
                                )
                            }
                            <FontAwesomeIcon onClick={handleIconClick} className="faXmark" icon={faXmark}></FontAwesomeIcon>
                        </div>

                    </div>
                    {/* form điền thông tin sách */}
                    <div className="addnewbook-form">
                        <div className="addnewbook-form_img">
                            <img src={`${book.anh_san_pham}`} />
                            {keyForm === 'add-book' && (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*" // Chỉ cho phép chọn các tập tin ảnh
                                        onChange={handleImageChange} // Xử lý khi chọn ảnh
                                        id="fileInput"
                                        style={{ cursor: 'pointer', display: 'none' }} // Đổi con trỏ thành kiểu click
                                    />
                                    <label htmlFor="fileInput" className="custom-file-input">
                                        + Chọn ảnh
                                    </label>
                                    {/* Có thể tùy chỉnh thêm CSS để hiển thị khác */}
                                    {selectedImage === null ? <span>Ảnh không được để trống!</span> : ''}
                                </div>
                            )}
                            {keyForm === 'detail-book' && statusInt !== 0 && (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        id="fileInput"
                                        style={{ cursor: 'pointer', display: 'none' }} // Đổi con trỏ thành kiểu click
                                    />
                                    <label htmlFor="fileInput" className="custom-file-input">
                                        + Thay ảnh
                                    </label>
                                    {/* Có thể tùy chỉnh thêm CSS để hiển thị khác */}
                                </div>
                            )}

                            <div></div>

                        </div>

                        <div className="addnewbook-form_info">
                            <div>
                                <label htmlFor="ten_san_pham">Tên sách</label>
                                <input
                                    className={errors.ten_san_pham ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="ten_san_pham"
                                    type="text"
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    value={book.ten_san_pham}
                                    disabled={statusInt === 0}
                                />
                                {/* Hiển thị thông báo lỗi nếu có lỗi */}
                                {errors.ten_san_pham && <span>Thông tin không hợp lệ!</span>}
                            </div>
                            <div>
                                <label for="name">Tác giả</label>
                                <input
                                    className={errors.tac_gia ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="tac_gia" type="text"
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    value={book.tac_gia}
                                    disabled={statusInt === 0}
                                />
                                {errors.tac_gia && <span>Thông tin không hợp lệ!</span>}
                            </div>
                            <div>
                                <label for="name">Thể loại</label>
                                {/* <input className={errors.ten_san_pham ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'} id="name" type="text" onChange={handleInputChange} onBlur={handleInputBlur} value={book.theLoai ? book.theLoai.tenTheLoai : 'Không có thể loại'} /> */}
                                <select
                                    id="the_loai"
                                    className={`form-select btnCheckBorder-default ${errors.the_loai ? 'btnCheckBorder-fail' : ''}`}
                                    aria-label="Danh sách danh mục sản phẩm"
                                    onChange={handleSelectChange}
                                    onBlur={handleInputBlur}
                                    value={book.the_loai?.ma_the_loai || ''}
                                    disabled={statusInt === 0}
                                >
                                    <option value="">Chọn thể loại</option>  {/* Tùy chọn mặc định */}
                                    {category.map((cat, index) => (
                                        <option key={index} value={cat.ma_the_loai}>
                                            {cat.ten_the_loai}
                                        </option>
                                    ))}
                                </select>
                                {errors.the_loai && <span>Vui lòng chọn thể loại hợp lệ!</span>}
                            </div>
                            <div>
                                <label for="name">Mã ISBN
                                    {keyForm === 'add-book' && (
                                        <span style={{ color: 'gray', top: '2px', right: '103px' }}>( không bắt buộc )</span>
                                    )}

                                </label>
                                <input
                                    className='btnCheckBorder-default'
                                    id="ma_isbn"
                                    type="text"
                                    onChange={handleInputChange}
                                    value={book.ma_isbn}
                                    disabled={statusInt === 0}
                                />
                            </div>
                            <div>
                                <label for="name">Số lượng sách bán ra</label>
                                <input
                                    className={errors.so_luong_hang ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="so_luong_hang"
                                    type="text"
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    value={book.so_luong_hang}
                                    disabled={statusInt === 0}
                                />
                                {errors.so_luong_hang && <span>Thông tin không hợp lệ!</span>}
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
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    value={book.ngay_xuat_ban}
                                    disabled={statusInt === 0}
                                />
                                {errors.ngay_xuat_ban && <span>Thông tin không hợp lệ!</span>}
                            </div>
                            <div>
                                <label for="name">Số trang</label>
                                <input
                                    className={errors.so_trang ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="so_trang"
                                    type="text"
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    value={book.so_trang}
                                    disabled={statusInt === 0}
                                />
                                {errors.so_trang && <span>Thông tin không hợp lệ!</span>}
                            </div>
                            <div>
                                <label for="name">Giá (VNĐ)</label>
                                <input
                                    className={errors.gia ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="gia"
                                    type="text"
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    value={book.gia}
                                    disabled={statusInt === 0}
                                />
                                {errors.gia && <span>Thông tin không hợp lệ!</span>}
                            </div>
                            <div>
                                <label for="name">Giá (SOlANA - SOL)</label>
                                <input
                                    className={errors.gia_sol ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="gia_sol"
                                    type="text"
                                    // onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    value={book.gia_sol}
                                    disabled={true}
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
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    value={book.phien_ban}
                                    disabled={statusInt === 0}
                                />
                                {errors.phien_ban && <span>Thông tin không hợp lệ!</span>}
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
                                <label for="name">Tóm tắt nội dung sách
                                    {keyForm === 'add-book' && keyForm === 'detail-book' && (
                                        <span>( thông tin này nhằm mô tả chi tiết sản phẩm của bạn )</span>
                                    )}

                                </label>
                                <textarea
                                    className={errors.mo_ta ? 'btnCheckBorder-fail' : 'btnCheckBorder-default'}
                                    id="mo_ta"
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    value={book.mo_ta}
                                    type="text"
                                    disabled={statusInt === 0}
                                    placeholder="VD: tóm tắt ngắn gọn nội dung, gây tò mò cho người mua..." />

                                {errors.mo_ta && <span style={{ display: 'block', color: 'red', fontSize: '1.2rem' }}>Thông tin không hợp lệ!</span>}
                            </div>
                        </div>

                        {/* bấm vào nút thêm sản phẩm */}
                        {keyForm === 'add-book' && (
                            <div className="addnewbook-form_btn">
                                <button className='xoasanpham_btn' onClick={onClose}>Hủy</button>
                                <button className='capnhatsanpham' onClick={handleSubmitAdd}>Tạo sản phẩm</button>
                            </div>
                        )}

                        {keyForm === 'detail-book' && statusInt === 1 && (
                            <div className="addnewbook-form_btn">
                                <button onClick={() => handleShowDelBook()} className='xoasanpham_btn'>Hủy Và Xóa Sản Phẩm</button>
                                <button className='capnhatsanpham' onClick={handleSubmitUpdate}>Cập nhật sản phẩm</button>
                            </div>
                        )}

                        {/* sản phẩm chờ duyệt */}
                        {keyForm === 'detail-book' && (statusInt === 3 || statusInt === 4) && (
                            <div className="addnewbook-form_btn">
                                {
                                    book.an_san_pham === true ? (
                                        <button className='btn_an_sp' onClick={() => handleUpdateAnBook('hien')}>
                                            <FontAwesomeIcon className='ansanpham_icon' icon={faEye}></FontAwesomeIcon>
                                            <p>Hiện sản phẩm</p>
                                        </button>
                                    ) : (
                                        <OverlayTrigger
                                            placement="left"  // top, right, bottom, left)
                                            overlay={(props) => renderTooltip(props, 'Khi ẩn, người dùng sẽ không tìm thấy sản phẩm của bạn', 'custom-tooltip')}
                                        >
                                            <button className='btn_an_sp' onClick={() => handleUpdateAnBook('an')}>
                                                <FontAwesomeIcon className='ansanpham_icon' icon={faEyeLowVision}></FontAwesomeIcon>
                                                <p>Ẩn sản phẩm</p>
                                            </button>
                                        </OverlayTrigger>
                                    )
                                }
                                {
                                    book.da_ban <= 0 && (
                                        <button className='xoasanpham_btn' onClick={() => handleShowDelBook()}>Xóa Sản Phẩm</button>
                                    )
                                }
                                <button className='capnhatsanpham' onClick={handleSubmitUpdate}>Cập nhật sản phẩm</button>
                            </div>
                        )}
                        {/* sản phẩm bị khóa */}
                        {keyForm === 'detail-book' && statusInt === 2 && (
                            <div className="addnewbook-form_btn">
                                <button className='xoasanpham_btn' onClick={() => handleShowDelBook()} >Xóa Sản Phẩm</button>
                                <button className='yeucaumokhoa_btn' onClick={handleUpdateYeuCauMoKhoa}>Gửi Yêu Cầu Mở Khóa</button>
                            </div>
                        )}
                        {/* sản phẩm bị khóa */}
                        {keyForm === 'detail-book' && statusInt === 5 && (
                            <div className="addnewbook-form_btn">
                                {
                                     book.da_ban <= 0 && (
                                        <button className='xoasanpham_btn' onClick={() => handleShowDelBook()}>Xóa Sản Phẩm</button>
                                    )
                                }
                                <button className='huyyeucaumokhoa_btn' onClick={handleUpdateHuyYeuCauMoKhoa}>Hủy yêu cầu mở khóa</button>
                            </div>
                        )}


                        {/* {keyForm === 'admin' && statusInt === 3 && (
                            <div className="addnewbook-form_btn">
                                <button>Hủy duyệt</button>
                                <button onClick={() => handleSubmitTrangThai('duyet')}>Duyệt sản phẩm</button>
                            </div>
                        )}
                        {keyForm === 'admin' && statusInt === 0 && (
                            <div className="addnewbook-form_btn">
                                <button onClick={() => handleShowDelBook()}>Yêu cầu xóa sản phẩm</button>
                                <button onClick={handleSubmitUpdate}>Mở khóa sản phẩm</button>
                            </div>
                        )} */}

                        {/* 
                        {keyForm === 'add-book' && (
                            <div className="addnewbook-form_note">
                                <p>Lưu ý: Sản phẩm mới cần qua kiểm duyệt của quản lý (1 - 2 ngày)
                                    trước khi đăng bán để đảm bảo chất lượng.</p>
                                <p>Xin cảm ơn sự thông cảm và hợp tác của bạn!</p>
                            </div>
                        )} */}

                        {
                            showThongKe && (
                                <div className='show-thong-ke'>
                                    <p>Đã bán: <span>20</span></p>
                                    <p>Còn hàng: <span>20</span></p>
                                    <ul>
                                        <p>Lượt đánh giá: <span>21</span></p>
                                        <li>5 sao: </li>
                                        <li>4 sao: </li>
                                        <li>3 sao: </li>
                                        <li>2 sao: </li>
                                        <li>1 sao: </li>
                                    </ul>
                                    <p>Điểm sản phẩm: <span>5</span> / 5</p>
                                    <ul>
                                        <p>Doanh thu theo phương thức thanh toán: </p>
                                        <li>Thanh toán qua ví: <span>292.000</span>đ</li>
                                        <li>Thanh toán bằng SOLANA: <span>17.32</span>đ</li>
                                        <li>Thanh toán online VNPay: <span>542.500</span>đ</li>
                                    </ul>
                                    <p>Tổng doanh thu: <span>20.000.000 đ</span> - <span>17.32 SOL</span></p>
                                </div>
                            )
                        }

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

                {notificationStatus === 'anIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title={'Ẩn sản phẩm'}
                            description={`"Thành công."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'anIsFail' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="error"
                            title={'Ẩn sản phẩm'}
                            description={`"Thất bại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'hienIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title={'Hiện sản phẩm'}
                            description={`"Thành công."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'hienIsFail' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="error"
                            title={'Hiện sản phẩm'}
                            description={`"Thất bại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'moKhoaIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title={'Gửi yêu cầu mở khóa'}
                            description={`"Thành công."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'moKhoaIsFail' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="error"
                            title={'Gửi yêu cầu mở khóa'}
                            description={`"Thất bại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'huymoKhoaIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title={'Gửi yêu cầu hủy mở khóa'}
                            description={`"Thành công."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'huymoKhoaIsFail' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="error"
                            title={'Gửi yêu cầu hủy mở khóa'}
                            description={`"Thất bại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
            </div>

            {
                notificationDelBook && (
                    <Notification
                        title={'Xóa sản phẩm'}
                        content1={`Bạn muốn xóa sách: `}
                        content2={`${nameBook}?`}
                        onClose={handleCloseDelBook}
                        onApply={handleApplyDelBook} />
                )
            }

        </div>
    );
};

export default BookForm;