import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllBook, getProductByMaSPUser } from '../../utils/API/ProductAPI';
import HeaderUser from '../Component/HeaderUser';
import FooterUser from '../Component/FooterUser';
import styles from './ProductDetail.css';
import axios from 'axios';
import { getPhanHoiDanhGiaByMaDanhGia } from '../../utils/API/PhanHoiDanhGiaAPI';

const ProductDetail = () => {
    const { id } = useParams(); // Lấy id sản phẩm từ URL
    const [product, setProduct] = useState(null); // Chi tiết sản phẩm
    const [reviews, setReviews] = useState([]); // Đánh giá sản phẩm
    const [storeInfo, setStoreInfo] = useState(null); // Thông tin cửa hàng
    const [randomProducts, setRandomProducts] = useState([]); // Sản phẩm ngẫu nhiên
    const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm
    const [reportMenuVisible, setReportMenuVisible] = useState(false);
    const [responseSeller, setResponseSeller] = useState([])
    const navigate = useNavigate();

    // phan trang cho danh gia
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const reviewsPerPage = 5; // Số đánh giá mỗi trang

    // Tính toán chỉ số của đánh giá đầu tiên và cuối cùng trên trang hiện tại
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

    // Lọc ra đánh giá hiển thị trên trang hiện tại
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    // Tổng số trang
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    // Chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [feedbacks, setFeedbacks] = useState({});

    // Lấy chi tiết sản phẩm
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const productData = await getProductByMaSPUser(id); // API lấy chi tiết sản phẩm
                setProduct(productData);

                // Lấy thông tin cửa hàng từ API
                const storeResponse = await axios.get(
                    `http://localhost:8080/api/v1/cuahang/info/${productData.ma_cua_hang}`
                );
                setStoreInfo(storeResponse.data);

                // Lấy danh sách đánh giá sản phẩm
                const reviewsResponse = await axios.get(
                    `http://localhost:8080/api/v1/danhgia/ma_san_pham-${id}`
                );
                setReviews(reviewsResponse.data);

                // Lấy danh sách sản phẩm ngẫu nhiên
                const allProducts = await getAllBook();
                setRandomProducts(getRandomProducts(allProducts, 5));
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            }
        };

        fetchProductData();
    }, [id]);

    useEffect(() => {
        // Hàm lấy phản hồi cho từng đánh giá trong reviews
        const fetchFeedbacks = async () => {
            const newFeedbacks = {};
            for (let comment of reviews) {
                try {
                    const feedback = await getPhanHoiDanhGiaByMaDanhGia(comment.ma_danh_gia);
                    if (feedback) {
                        newFeedbacks[comment.ma_danh_gia] = feedback; // Gắn phản hồi vào `newFeedbacks`
                    }
                } catch (error) {
                    console.error('Error fetching feedback:', error);
                }
            }
            setFeedbacks(newFeedbacks); // Cập nhật state với tất cả các phản hồi

        };

        fetchFeedbacks();

    }, [reviews]);

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

    // Hàm thêm vào giỏ hàng
    const addToCart = () => {
        const user = JSON.parse(sessionStorage.getItem('user')); // Lấy thông tin người dùng từ session
        if (!user) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
            navigate("/login");
            return;
        }

        const cartKey = `cart_${user.id_tai_khoan}`;
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

        const existingProduct = cart.find((item) => item.ma_san_pham === product.ma_san_pham);
        if (existingProduct) {
            existingProduct.so_luong += quantity;
        } else {
            cart.push({ ...product, so_luong: quantity });
        }

        localStorage.setItem(cartKey, JSON.stringify(cart));
        alert("Sản phẩm đã được thêm vào giỏ hàng");
        window.location.reload();

    };

    // Hàm "Mua ngay"
    const buyNow = () => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            alert("Vui lòng đăng nhập để mua sản phẩm");
            navigate("/login");
            return;
        }

        sessionStorage.setItem('checkoutItem', JSON.stringify({ ...product, so_luong: quantity }));
        navigate("/checkout");
    };
    const handleReport = () => {
        alert('Redirect to report form');
        navigate('/report');
    };

    // Điều hướng đến cửa hàng
    const handleStoreClick = () => {
        if (storeInfo?.ma_cua_hang) {
            navigate(`/cuahang/${storeInfo.ma_cua_hang}`);
        }
    };

    if (!product || !storeInfo) return <p>Loading...</p>;
    console.log(reviews)

    return (
        <div className={styles.parent}>
            <HeaderUser />

            <section className="product-detail">
                {/* Thông tin chính của sản phẩm */}
                <div className="product-main-info">
                    <img src={product.anh_san_pham} alt={product.ten_san_pham} className="product-imageCart" />
                    <div className="product-info">
                        <h1>{product.ten_san_pham}</h1>
                        <p className="product-author"><span>Tác giả:</span>{product.tac_gia || "N/A"} </p>
                        <p className="product-categoryy"><span>Thể loại:</span>{product.the_loai?.ten_the_loai || "N/A"} </p>
                        <p className="product-priceD">{product.gia.toLocaleString()} đ</p>
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
                                    -
                                </button>
                                <input

                                    value={quantity}
                                    min="1"
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="quantityInput"
                                />
                                <button
                                    className="quantityBtn"
                                    onClick={() => setQuantity((prev) => (prev < product.con_hang ? prev + 1 : prev))}
                                >
                                    +
                                </button>
                                <p className="product-conhang">{product.con_hang?.toLocaleString()} sản phẩm có sẵn</p>
                            </div>
                        </div>
                        <div className="action-buttons">
                            <div style={{ marginTop: '20px' }}>
                                <button style={{ marginRight: '20px' }} className="add-to-cart-btn" onClick={addToCart}>THÊM VÀO GIỎ HÀNG</button>
                                <button onClick={buyNow} className="buy-now-btn">MUA NGAY</button>
                            </div>
                            <div
                                className={`${styles.reportMenu} ${reportMenuVisible ? styles.visible : ''
                                    }`}
                            >
                                <button onClick={handleReport}>
                                    Báo cáo sản phẩm
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="product-details-section">
                    <h3>THÔNG TIN CHI TIẾT</h3>
                    <table className="product-details-table">
                        <tbody>
                            <tr><td>Nhà xuất bản:</td><td>{product.nha_xuat_ban || "N/A"}</td></tr>
                            <tr><td>Ngày xuất bản:</td><td>{product.ngay_xuat_ban || "N/A"}</td></tr>
                            <tr><td>Kích thước:</td><td>{product.kich_thuoc || "N/A"}</td></tr>
                            <tr><td>Số trang:</td><td>{product.so_trang || "N/A"}</td></tr>
                            <tr><td>Trọng lượng:</td><td>{product.trong_luong || "N/A"} gram</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 style={{ marginTop: '20px', fontSize: '20px', color: 'blueviolet' }}>Cửa hàng bán sản phẩm</h3>
                {/* Thông tin cửa hàng */}
                <div
                    className="store-info"
                    onClick={() => navigate(`/PageSeller/${storeInfo.ma_cua_hang}`)}
                    style={{ cursor: 'pointer' }} // Thêm hiệu ứng con trỏ
                >
                    <div>
                        <img
                            src={storeInfo.anh_dai_dien}
                            alt={`Ảnh đại diện của ${storeInfo.ten_cua_hang}`}
                            className="store-avatar"
                            style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }}
                        />
                    </div>
                    <div>
                        <p className="store-name">{storeInfo.ten_cua_hang}</p>
                        <p className="store-address">{storeInfo.dia_chi_cua_hang}</p>
                    </div>
                </div>


                {/* Đánh giá sản phẩm */}
                <div className="product-reviews">
                    <h3>ĐÁNH GIÁ SẢN PHẨM</h3>
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => {
                            const feedback = feedbacks[review.ma_danh_gia];
                            {
                                feedback && (
                                    <>
                                        <div className="review" key={index}>
                                            <p className="review-user">Người dùng: {review.tai_khoan_danh_gia?.ho_ten || 'Ẩn danh'}</p>
                                            <p className="review-rating">Điểm: {review.diem_danh_gia}/5</p>
                                            <p className="review-content">{review.noi_dung_danh_gia}</p>
                                        </div>
                                        <div>
                                            <p>{feedback.noi_dung_phan_hoi}</p>
                                        </div>
                                    </>
                                )
                            }

                            {
                                !feedback && (
                                    <div className="review" key={index}>
                                        <p className="review-user">Người dùng: {review.tai_khoan_danh_gia?.ho_ten || 'Ẩn danh'}</p>
                                        <p className="review-rating">Điểm: {review.diem_danh_gia}/5</p>
                                        <p className="review-content">{review.noi_dung_danh_gia}</p>
                                    </div>
                                )
                            }

                        })
                    ) : (
                        <p style={{ fontSize: '16px' }}>Chưa có đánh giá nào.</p>
                    )}
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

            <FooterUser />
        </div>
    );
};

export default ProductDetail;