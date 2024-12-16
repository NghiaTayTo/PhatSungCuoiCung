import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllBook, getProductByIdStore, getProductByMaSPUser } from '../../utils/API/ProductAPI';
import HeaderUser from '../Component/HeaderUser';
import FooterUser from '../Component/FooterUser';
import styles from './ProductDetail.css';
import axios from 'axios';
import { getPhanHoiDanhGiaByMaDanhGia, getPhanHoiDanhGiaByMaDanhGiaUser } from '../../utils/API/PhanHoiDanhGiaAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faComments, faPlus, faStar, faStore, faWindowMinimize } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../utils/Order/Loading';
import { countCommentByBookID, getDiemTrungBinhByMaSanPham, searchCommentByBookIDAndRating } from '../../utils/API/DanhGiaAPI';
import { faFacebook, faFacebookMessenger, faPinterest } from '@fortawesome/free-brands-svg-icons';
import { getSumLuotBanByMaCuaHang } from '../../utils/API/OrderDetailsAPI';
import { getVouchersByCuaHangIdDetailsUser } from '../../utils/API/VoucherAPI';

import { NotificationContainer, NotificationManager } from 'react-notifications';

import Pagination from '../../utils/Pagination/Pagination';

import StarRating from '../../utils/Order/StarRating';

const ProductDetail = () => {
    const { id } = useParams(); // Lấy id sản phẩm từ URL
    const [product, setProduct] = useState(null); // Chi tiết sản phẩm
    const [reviews, setReviews] = useState([]); // Đánh giá sản phẩm
    const [storeInfo, setStoreInfo] = useState(null); // Thông tin cửa hàng
    const [randomProducts, setRandomProducts] = useState([]); // Sản phẩm ngẫu nhiên
    const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm
    const [reportMenuVisible, setReportMenuVisible] = useState(false);
    const [responseSeller, setResponseSeller] = useState([])
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(null);
    
    // * Phân trang
    const [pagination, setPagination] = useState();
    // * Trang hiện tại
    // const [currentPage, setCurrentPage] = useState(1);
    // * Mỗi trang 10 sản phẩm
    const [selectedValue, setSelectedValue] = useState(5);
    const navigate = useNavigate();
    // phan trang cho danh gia
    const [currentPage, setCurrentPage] = useState(1);

    // Tính toán chỉ số của đánh giá đầu tiên và cuối cùng trên trang hiện tại
    // *Trang được chọn
    const indexOfLastItem = currentPage * selectedValue;
    const indexOfFirstItem = indexOfLastItem - selectedValue;

    const [listVoucher, setListVoucher] = useState([]);

    const [feedbacks, setFeedbacks] = useState({});
    const [countDanhGia, setCountDanhGia] = useState(0);
    const [diemTrungBinh, setDiemTrungBinh] = useState(0);
    const [soLuongSanPham, setSoLuongSanPham] = useState(0);
    const [luotBan, setLuotBan] = useState(0);

    const [lendthReview, setLengthReview] = useState(0);

    const [fiveStar, setFiveStar] = useState(0);
    const [fourStar, setFourStar] = useState(0);
    const [threeStar, setThreeStar] = useState(0);
    const [twoStar, setTwoStar] = useState(0);
    const [oneStar, setOneStar] = useState(0);

    const [rating, setRating] = useState('')

    const [selectedButton, setSelectedButton] = useState('all');

    const [currentProducts, setCurrentProducts] = useState([]);
    const [userID, setUserID] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };


    // Lấy chi tiết sản phẩm
    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (storedUser) {
            setUserID(storedUser.id_tai_khoan);
        }
        const fetchProductData = async () => {
            try {
                const productData = await getProductByMaSPUser(id); // API lấy chi tiết sản phẩm
                setProduct(productData);
                const idStore = productData.ma_cua_hang;


                const count = await countCommentByBookID(id);
                setCountDanhGia(count);

                const diemTrungBinh = await getDiemTrungBinhByMaSanPham(id);
                const floorDiem = Math.floor(diemTrungBinh, 2);
                setDiemTrungBinh(floorDiem);

                // Lấy thông tin cửa hàng từ API
                const storeResponse = await axios.get(
                    `http://localhost:8080/api/v1/cuahang/info/${idStore}`
                );
                setStoreInfo(storeResponse.data);

                const sanpham = await getProductByIdStore(idStore);
                if (sanpham) {
                    setSoLuongSanPham(sanpham.length);
                }

                const luotban = await getSumLuotBanByMaCuaHang(idStore);
                if (luotban) {
                    setLuotBan(luotban);
                }

                const vouchers = await getVouchersByCuaHangIdDetailsUser(idStore);
                setListVoucher(vouchers);

                // Lấy danh sách đánh giá sản phẩm
                const reviewsResponse = await axios.get(
                    `http://localhost:8080/api/v1/danhgia/ma_san_pham-${id}`
                );
                setReviews(reviewsResponse.data);
                const listComments = reviewsResponse.data;

                const listData = Array.isArray(listComments)
                    ? listComments.slice(indexOfFirstItem, indexOfLastItem)
                    : [];
                setCurrentProducts(listData);


                // * Set số sao
                const fiveStarData = listComments.filter(comment => comment.diem_danh_gia === 5).length;
                setFiveStar(fiveStarData);

                const fourStarData = listComments.filter(comment => comment.diem_danh_gia === 4).length;
                setFourStar(fourStarData);

                const threeStarData = listComments.filter(comment => comment.diem_danh_gia === 3).length;
                setThreeStar(threeStarData);

                const twoStarData = listComments.filter(comment => comment.diem_danh_gia === 2).length;
                setTwoStar(twoStarData);

                const oneStarData = listComments.filter(comment => comment.diem_danh_gia === 1).length;
                setOneStar(oneStarData);
                // * set số page
                const totalProducts = listComments.length;
                setPagination(Math.ceil(totalProducts / selectedValue));
                setLengthReview(totalProducts);
                const newFeedbacks = {};
                for (let comment of listComments) {
                    try {
                        const feedback = await getPhanHoiDanhGiaByMaDanhGiaUser(idStore, comment.ma_danh_gia);
                        if (feedback) {
                            newFeedbacks[comment.ma_danh_gia] = feedback; // Gắn phản hồi vào `newFeedbacks`
                        }
                    } catch (error) {
                        console.error('Error fetching feedback:', error);
                    }
                }
                setFeedbacks(newFeedbacks);


                // Lấy danh sách sản phẩm ngẫu nhiên
                const allProducts = await getAllBook();
                setRandomProducts(getRandomProducts(allProducts, 5));
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            }
            const storedUser = JSON.parse(sessionStorage.getItem('user'));
            if (storedUser) {
                setUser(storedUser);
            }
        };

        fetchProductData();
    }, [id]);


    // const currentProducts = Array.isArray(reviews)
    //     ? reviews.slice(indexOfFirstItem, indexOfLastItem)
    //     : [];

    // Hàm random sản phẩm
    const getRandomProducts = (arr, num) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    };

    // Điều hướng đến chi tiết sản phẩm
    const handleProductClick = (productId) => {
        navigate(`/ProductDetail/${productId}`);
        window.scrollTo(0, 0);
    };

    const [hienalert, setHienalert] = useState(false);
    // Hàm thêm vào giỏ hàng
    const addToCart = () => {
        const user = JSON.parse(sessionStorage.getItem('user')); // lấy thông tin người dùng từ session
        if (!user) {
            if (!hienalert) { // Chỉ hiển thị thông báo nếu chưa hiển thị lần nào
                NotificationManager.warning('Vui lòng đăng nhập để mua sản phẩm', 'Chưa đăng nhập');
                setHienalert(true); // Đánh dấu đã hiển thị thông báo

                setTimeout(() => {
                    navigate("/login");
                    setHienalert(false); // Reset trạng thái để thông báo lại khi cần
                }, 3000);
            }
            return;
        }

        const cartKey = `cart_${user.id_tai_khoan}`;
        const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];

        // Tìm sản phẩm đã có trong giỏ
        const existingProduct = currentCart.find((item) => item.ma_san_pham === product.ma_san_pham);
        if (existingProduct) {
            if (existingProduct.so_luong + quantity > product.con_hang) {
                // alert(`Không thể thêm quá số lượng có sẵn (${product.con_hang})`);
                NotificationManager.warning(`Không thể thêm quá ${product.con_hang} sản phẩm có sẵn`, 'Thêm vào giỏ hàng');
                return;
            }
            existingProduct.so_luong += quantity; // Cập nhật số lượng
        } else {
            if (quantity > product.con_hang) {
                // alert(`Số lượng không hợp lệ. Chỉ còn ${product.con_hang} sản phẩm.`);
                NotificationManager.warning(`Số lượng không hợp lệ. Chỉ còn ${product.con_hang} sản phẩm`, 'Thêm vào giỏ hàng');
                return;
            }
            currentCart.push({ ...product, so_luong: quantity });
        }

        // Lưu vào localStorage
        localStorage.setItem(cartKey, JSON.stringify(currentCart));
        setCart(currentCart); // Đồng bộ trạng thái giỏ hàng
        NotificationManager.success('Thành công', 'Thêm sản phẩm vào giỏ hàng');
        // navigate('/shopping'); // Điều hướng tới giỏ hàng nếu cần
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };


    const [hasNotified, setHasNotified] = useState(false);
    // Hàm "Mua ngay"
    const buyNow = () => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            if (!hasNotified) { // Chỉ hiển thị thông báo nếu chưa hiển thị lần nào
                NotificationManager.warning('Vui lòng đăng nhập để mua sản phẩm', 'Chưa đăng nhập');
                setHasNotified(true); // Đánh dấu đã hiển thị thông báo

                setTimeout(() => {
                    navigate("/login");
                    setHasNotified(false); // Reset trạng thái để thông báo lại khi cần
                }, 3000);
            }
            return;
        }

        sessionStorage.setItem('checkoutItem', JSON.stringify({ ...product, so_luong: quantity }));
        navigate("/checkout");
    };
    const formatMoney = (amount) => {
        if (amount >= 1000) {
            return `${(amount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
        }
        return amount.toString();
    };

    const hienthi = currentProducts.map((review, index) => {
        const feedback = feedbacks[review.ma_danh_gia];
        return (
            <>
                {
                    feedback && (
                        <div className='review-border'>
                            <div className="review" key={index}>
                                {
                                    review.anh_dai_dien ? (
                                        <img src={review.anh_dai_dien} />
                                    ) : (
                                        <img src='/images/avt_default.png' />
                                    )
                                }

                                <div>
                                    <p className="review-user">{review.tai_khoan_danh_gia?.ho_ten || 'Ẩn danh'}</p>
                                    <StarRating rating={review.diem_danh_gia} />
                                    <p className="review-date">{review.ngay_danh_gia} <span>|</span> Số lượng: {review.don_hang_chi_tiet?.so_luong}</p>
                                    <p className="review-content">{review.noi_dung_danh_gia}</p>
                                </div>

                            </div>
                            <div className='review-store-comment'>
                                {
                                    feedback.cua_hang?.anh_dai_dien ? (
                                        <img src={feedback.cua_hang?.anh_dai_dien} />
                                    ) : (
                                        <img src='/images/avt_default.png' />
                                    )
                                }
                                <div className='review-store-comment-info'>
                                    <p className="review-user">{feedback.cua_hang?.ten_cua_hang}</p>
                                    <p className="review-date">{feedback.ngay_phan_hoi}</p>
                                    <p className="review-content" style={{ marginBottom: '25px' }}>{feedback.noi_dung_phan_hoi}</p>
                                </div>

                            </div>
                        </div>
                    )
                }

                {
                    !feedback && (
                        <div className='review-border'>
                            <div className="review" key={index}>
                                {
                                    review.anh_dai_dien ? (
                                        <img src={review.anh_dai_dien} />
                                    ) : (
                                        <img src='/images/avt_default.png' />
                                    )
                                }

                                <div>
                                    <p className="review-user">{review.tai_khoan_danh_gia?.ho_ten || 'Ẩn danh'}</p>
                                    <StarRating rating={review.diem_danh_gia} />
                                    <p className="review-date">{review.ngay_danh_gia} <span>|</span> Số lượng: {review.don_hang_chi_tiet?.so_luong}</p>
                                    <p className="review-content">{review.noi_dung_danh_gia}</p>
                                </div>
                            </div>
                        </div>
                    )
                }
            </>
        )
    })

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }
    const fetchAllRatingData = async () => {
        try {
            const reviewsResponse = await axios.get(
                `http://localhost:8080/api/v1/danhgia/ma_san_pham-${id}`
            );
            const data = reviewsResponse.data;
            const listData = Array.isArray(data)
                ? data.slice(indexOfFirstItem, indexOfLastItem)
                : [];
            setReviews(data);
            setCurrentProducts(listData);
            const totalProducts = data.length;
            setPagination(Math.ceil(totalProducts / selectedValue));

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const fetchDataByRating = async (starNumber) => {
        try {
            const listComment = await searchCommentByBookIDAndRating(id, starNumber);
            const listData = Array.isArray(listComment)
                ? listComment.slice(indexOfFirstItem, indexOfLastItem)
                : [];
            setReviews(listComment);
            setCurrentProducts(listData);
            const totalProducts = listComment.length;
            setPagination(Math.ceil(totalProducts / selectedValue));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleButtonClick = (buttonId) => {
        setSelectedButton(buttonId); // Cập nhật trạng thái với button được chọn

        if (buttonId === 'all') {
            fetchAllRatingData();
            setRating('all')
        } else if (buttonId === '5star') {
            fetchDataByRating(5);
            setRating('5 sao')
        } else if (buttonId === '4star') {
            fetchDataByRating(4);
            setRating('4 sao')
        } else if (buttonId === '3star') {
            fetchDataByRating(3);
            setRating('3 sao')
        } else if (buttonId === '2star') {
            fetchDataByRating(2);
            setRating('2 sao')
        } else {
            fetchDataByRating(1);
            setRating('1 sao')
        }
    };

    const handleSaveVoucher = async (voucher) => {
        try {
            const payload = {
                id_voucher: voucher.id_voucher, // ID của voucher
                id_tai_khoan: user.id_tai_khoan, // ID tài khoản người dùng, thay bằng giá trị thực tế
            };

            const response = await axios.post(`http://localhost:8080/api/v1/save-voucher`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Voucher saved successfully:', response.data);
            NotificationManager.success('Thành công', 'Lưu Voucher');
        } catch (error) {
            console.error('Error saving voucher:', error);
            NotificationManager.error('Thất bại', 'Lưu Voucher');
        }
    };

    const voucherRows = listVoucher.map((voucher, index) => {
        return (
            <div key={index} className="list-voucher-item">
                <div className="list-voucher-item-info">
                    <div className="list-voucher-item-info-info">
                        <p>{voucher.ten_voucher}</p>
                        <p>Giảm {formatMoney(voucher.giam_gia)}</p>
                        <p>Đơn tối thiểu {formatMoney(voucher.gia_ap_dung)}</p>
                        <p>Số lần dùng: {voucher.so_lan_dung}</p>
                        <p>HSD: {voucher.ngay_het_han}</p>
                    </div>
                    <div className="list-voucher-item-info-button">
                        <button style={{ marginTop: '35px' }} onClick={() => handleSaveVoucher(voucher)}>LƯU</button>
                    </div>
                </div>
            </div>
        );
    })


    if (!product || !storeInfo) return <Loading />;

    return (
        <div className={styles.parent}>
            <HeaderUser fixed={false} onSearchResults={handleSearchResults} />

            <section className="product-detail">
                {/* Thông tin chính của sản phẩm */}
                <div className="product-main-info">
                    <img src={product.anh_san_pham} alt={product.ten_san_pham} className="product-imageCart" />
                    <div className="product-info">
                        <h1>{product.ten_san_pham}</h1>
                        <div className='prodcut-abc'>
                            <div className='prodcut-abc-star'>
                                <p>{diemTrungBinh}</p>
                                <FontAwesomeIcon className='star-icon' icon={faStar}></FontAwesomeIcon>
                            </div>
                            <div className='prodcut-abc-star'>
                                <p>{countDanhGia.toLocaleString()}</p>
                                <span>Đánh giá</span>
                            </div>
                            <div className='prodcut-abc-star2'>
                                <p>{product.da_ban}</p>
                                <span>Đã bán</span>
                            </div>
                        </div>
                        <p className="product-author"><span>Tác giả:</span>{product.tac_gia || "N/A"} </p>
                        <p className="product-categoryy"><span>Thể loại:</span>{product.the_loai?.ten_the_loai || "N/A"} </p>

                        <div className='product-sol-img'>
                            <p className="product-priceD">{product.gia.toLocaleString()} đ</p>
                            <span></span>
                            <img src='/images/solana.png' alt='solana icon' />
                            <p>{product.gia_sol || 0} SOL</p>
                        </div>

                        {
                            product.con_hang > 0 ? (
                                <p className="product-status">Tình trạng: <span>Còn hàng</span></p>
                            ) : (
                                <p className="product-status">Tình trạng: <span className='product-hethang'>Hết hàng</span></p>
                            )
                        }


                        <div className="quantity-control">
                            <label>Số lượng:</label>
                            <div className="quantityWrapper">
                                <button
                                    className="quantityBtn"
                                    onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                                >
                                    <FontAwesomeIcon className='truhang' icon={faWindowMinimize}></FontAwesomeIcon>
                                </button>
                                <input
                                    value={quantity}
                                    min="1"
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="quantityInput"
                                    readOnly
                                />
                                <button
                                    className="quantityBtn"
                                    onClick={() => setQuantity((prev) => (prev < product.con_hang ? prev + 1 : prev))}
                                >
                                    <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                </button>
                                <p className="product-conhang">{product.con_hang?.toLocaleString()} sản phẩm có sẵn</p>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <div style={{ marginTop: '20px' }}>
                                <button style={{ marginRight: '20px' }} className="add-to-cart-btn" onClick={addToCart}>
                                    <FontAwesomeIcon className="add-to-cart-btn-icon" icon={faCartPlus}></FontAwesomeIcon>
                                    Thêm vào giỏ hàng</button>
                                {
                                    user === null && (
                                        <button
                                            onClick={buyNow}
                                            className="buy-now-btn">MUA NGAY
                                        </button>
                                    )
                                }
                                {
                                    user?.trang_thai_tk === false && <button onClick={buyNow} className="buy-now-btn">MUA NGAY</button>
                                }

                            </div>
                        </div>

                        <div className='product-share'>
                            <p>Chia sẻ:</p>
                            <FontAwesomeIcon className='product-share-icon1 icon-internet' icon={faFacebookMessenger} />
                            <FontAwesomeIcon className='product-share-icon2 icon-internet' icon={faFacebook} />
                            <FontAwesomeIcon className='product-share-icon3 icon-internet' icon={faPinterest} />
                        </div>

                        <div className='product-khuyenmai'>
                            <strong>Thông tin & Khuyến mãi</strong>
                            <ul>
                                <li>Đổi trả hàng trong vòng 7 ngày</li>
                                <li>Sản phẩm như hình, chất lượng đặt lên hàng đầu</li>
                                <li>Tư vấn, hỗ trợ khách hàng nhanh chóng</li>
                                <li>Phí ship toàn quốc chỉ <span>25,000đ</span></li>
                            </ul>
                        </div>

                    </div>
                </div>


                {/* Thông tin cửa hàng */}
                <div
                    className="store-info"
                    style={{ cursor: 'pointer' }} // Thêm hiệu ứng con trỏ
                >
                    <div className="store-info-shop">
                        <img
                            src={storeInfo.anh_dai_dien}
                            alt={`Ảnh đại diện của ${storeInfo.ten_cua_hang}`}
                            className="store-avatar"
                        />
                        <div className="store-info-shop-chat">
                            <p className="store-name">{storeInfo.ten_cua_hang}</p>
                            <p className="store-phone">{storeInfo.so_dien_thoai}</p>
                            <div className="store-info-shop-chat-button">
                                <button>
                                    <FontAwesomeIcon className='store-info-shop-chat-button-icon' icon={faComments} />
                                    Chat Ngay</button>
                                <button
                                    onClick={() => navigate(`/PageSeller/${storeInfo.ma_cua_hang}`)}
                                ><FontAwesomeIcon className='store-info-shop-chat-button-icon' icon={faStore} />Xem Shop</button>
                            </div>
                        </div>
                        <div className='store-info-shop-info'>
                            <div className='store-info-shop-info-info'>
                                <div><p>Điểm cửa hàng: </p><span>{storeInfo.diem_cua_hang}</span></div>
                                <div><p>Đã bán: </p><span>{luotBan}</span></div>
                            </div>
                            <div className='store-info-shop-info-info'>
                                <div><p>Sản phẩm: </p><span>{soLuongSanPham}</span></div>
                                <div><p>Tỉ lệ phản hồi: </p><span>100%</span></div>
                            </div>
                            <div className='store-info-shop-info-info'>
                                <div><p>Lượt báo cáo: </p><span>{storeInfo.luot_bao_cao}</span></div>
                                <div> <p>Thời gian phản hồi: </p><span>trong vài giờ</span></div>
                            </div>
                        </div>
                    </div>
                    {/* <div>

                        <p className="store-address">{storeInfo.dia_chi_cua_hang}</p>
                    </div> */}
                </div>

                <div className='info-and-voucher'>

                    {/* Thông tin chi tiết */}
                    <div className="product-details-section">
                        <h3>CHI TIẾT SẢN PHẨM</h3>
                        <table className="product-details-table">
                            <tbody>
                                <tr><td>Tác giả:</td><td>{product.tac_gia || "Không xác định"}</td></tr>
                                <tr><td>Thể loại:</td><td>{product.the_loai?.ten_the_loai || "Không xác định"}</td></tr>
                                <tr><td>Số sản phẩm còn lại:</td><td>{product.con_hang || "Không xác định"}</td></tr>
                                <tr><td>Phiên bản:</td><td>{product.phien_ban || "Không xác định"}</td></tr>
                                <tr><td>Ngày xuất bản:</td><td>{product.ngay_xuat_ban || "Không xác định"}</td></tr>
                                <tr><td>Mã ISBN:</td><td>{product.ma_isbn || "Không xác định"}</td></tr>
                                <tr><td>Số trang:</td><td>{product.so_trang || "Không xác định"}</td></tr>
                                {/* <tr><td>Trọng lượng:</td><td>{product.trong_luong || "Không xác định"} gram</td></tr> */}
                            </tbody>
                        </table>
                        <h3>MÔ TẢ NỘI DUNG SÁCH</h3>
                        <div className="product-details-mota">
                            <h4>{product.ten_san_pham}</h4>
                            <p>{product.mo_ta}</p>
                        </div>
                    </div>

                    <div className='voucher-store'>
                        <p className='list-voucher-title'>Mã giảm giá của Shop</p>
                        <div className="list-voucher">
                            {
                                listVoucher.length > 0 ? (
                                    <>{voucherRows}</>
                                ) : (
                                    <p>Cửa hàng chưa có voucher.</p>
                                )
                            }

                        </div>
                    </div>

                </div>


                {/* Đánh giá sản phẩm */}
                <div className="product-reviews">
                    <div className='product-reviews-box'>

                        <div className='product-reviews-list'>
                            <p className="product-reviews-title">ĐÁNH GIÁ SẢN PHẨM ({lendthReview})</p>
                            {reviews.length > 0 ? (
                                <>
                                    {hienthi}
                                    < Pagination totalPages={pagination} onPageChange={handlePageChange}></Pagination>
                                </>
                            ) : (
                                <p style={{ fontSize: '16px' }}>Sản phẩm chưa có đánh giá.</p>
                            )}
                        </div>
                        <div className='product-reviews-list2'>
                            <p>4.9 <span>trên 5</span></p>
                            <button
                                id={selectedButton === 'all' ? 'search-comment-choose' : undefined}
                                onClick={() => handleButtonClick('all')}
                            >Tất cả ({lendthReview})</button>
                            <button
                                id={selectedButton === '5star' ? 'search-comment-choose' : undefined}
                                onClick={() => handleButtonClick('5star')}
                            >5 Sao ({fiveStar})</button>
                            <button
                                id={selectedButton === '4star' ? 'search-comment-choose' : undefined}
                                onClick={() => handleButtonClick('4star')}
                            >4 Sao ({fourStar})</button>
                            <button
                                id={selectedButton === '3star' ? 'search-comment-choose' : undefined}
                                onClick={() => handleButtonClick('3star')}
                            >3 Sao ({threeStar})</button>
                            <button
                                id={selectedButton === '2star' ? 'search-comment-choose' : undefined}
                                onClick={() => handleButtonClick('2star')}
                            >2 Sao ({twoStar})</button>
                            <button
                                id={selectedButton === '1star' ? 'search-comment-choose' : undefined}
                                onClick={() => handleButtonClick('1star')}
                            >1 Sao ({oneStar})</button>
                        </div>
                    </div>
                </div>

                {/* Sản phẩm liên quan */}
                <div className="related-products">
                    <h3>SẢN PHẨM CÙNG LOẠI</h3>
                    <div className="related-products-carousel">
                        {randomProducts.map((relatedProduct) => (
                            <div
                                key={relatedProduct.ma_san_pham}
                                className="related-product-card"
                                onClick={() => handleProductClick(relatedProduct.ma_san_pham)}
                            >
                                <div className="product-image-placeholder">
                                    <img
                                        src={relatedProduct.anh_san_pham}
                                        alt={relatedProduct.ten_san_pham}
                                        className="product-image"
                                    />
                                </div>
                                <p className="related-product-name">{relatedProduct.ten_san_pham}</p>
                                <p className="related-product-price">{relatedProduct.gia.toLocaleString()} đ</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <NotificationContainer />


            <FooterUser />
        </div>
    );
};

export default ProductDetail;