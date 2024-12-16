import React, { useEffect, useState } from 'react';
import styles from './HomeUserIndex.module.css';
import { getAllBookUser, getProductsByDaBanDesc, getProductsByNameCategory } from '../../utils/API/ProductAPI'; // API để lấy sản phẩm
import { useNavigate } from 'react-router-dom';
import FooterUser from '../Component/FooterUser';
import HeaderUser from '../Component/HeaderUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faBook } from '@fortawesome/free-solid-svg-icons';
import ImageCarousel from './ImageCarousel';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeUserIndex = () => {
    const [products, setProducts] = useState([]); // Toàn bộ sản phẩm
    const [featuredProducts, setFeaturedProducts] = useState([]); // Sản phẩm nổi bật
    const [newProducts, setNewProducts] = useState([]); // Sản phẩm mới
    const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm
    const [isSearching, setIsSearching] = useState(false); // Trạng thái đang tìm kiếm
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const productsPerPage = 10; // Số sản phẩm hiển thị trên mỗi trang
    const navigate = useNavigate();

    const [vanHoc, setVanHoc] = useState([]);
    const [lichSu, setLichSu] = useState([]);
    const [truyenTranh, setTruyenTranh] = useState([]);
    const [banChays, setBanChays] = useState([]);

    const [hoveredProduct, setHoveredProduct] = useState({});

    // Lấy danh sách sản phẩm khi load trang
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllBookUser(); // Lấy toàn bộ sản phẩm từ API
                setProducts(data);
                // Lấy ngẫu nhiên sản phẩm cho từng danh mục
                setFeaturedProducts(data.sort(() => 0.5 - Math.random()).slice(0, 8));
                setNewProducts(data.sort(() => 0.5 - Math.random()).slice(0, 8));

                const vanHocData = await getProductsByNameCategory('văn học');
                setVanHoc(vanHocData);
                const lichSuData = await getProductsByNameCategory('lịch sử');
                setLichSu(lichSuData);
                const truyenTranhData = await getProductsByNameCategory('truyện tranh');
                setTruyenTranh(truyenTranhData);

                const banChayData = await getProductsByDaBanDesc();
                setBanChays(banChayData);
                const firstProduct = banChayData[0];
                console.log('firstProduct: ', firstProduct);

                setHoveredProduct(firstProduct);

            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error);
            }
        };
        fetchProducts();
    }, []);

    // Xử lý khi có kết quả tìm kiếm
    const handleSearchResults = (results) => {
        setSearchResults(results); // Cập nhật kết quả tìm kiếm
        setIsSearching(results.length > 0); // Đặt trạng thái đang tìm kiếm
        setCurrentPage(1); // Quay về trang đầu tiên khi tìm kiếm
    };

    // Chuyển hướng đến chi tiết sản phẩm
    const handleProductClick = (id) => {
        navigate(`/ProductDetail/${id}`);
    };

    // Chuyển hướng đến danh mục với mã thể loại
    const handleCategoryClick = (maTheLoai) => {
        navigate(`/HomeUser?ma_the_loai=${maTheLoai}`);
    };

    const handleNameCategoryClick = () => {
        navigate(`/HomeUser`);
    };

    // Tính toán sản phẩm hiển thị cho trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = (
        isSearching ? searchResults : products || []
    ).slice(indexOfFirstProduct, indexOfLastProduct);

    // Tính tổng số trang
    const totalPages = Math.ceil(((isSearching ? searchResults : products) || []).length / productsPerPage);

    // Xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleViewMore = () => {
        navigate('/HomeUser');
    };
    const getPaginationButtons = (currentPage, totalPages) => {
        const buttons = [];

        const range = (start, end) => {
            const result = [];
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
            return result;
        };

        // Nếu tổng số trang nhỏ hơn hoặc bằng 7, hiển thị tất cả các trang
        if (totalPages <= 7) {
            return range(1, totalPages);
        }

        // Luôn luôn hiển thị trang đầu tiên
        buttons.push(1);

        // Thêm dấu "..." nếu currentPage cách trang đầu quá xa


        // Thêm các trang lân cận với currentPage (2 trang trước và sau)
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) {
            if (!buttons.includes(i)) {
                buttons.push(i);
            }
        }

        // Thêm dấu "..." nếu currentPage cách trang cuối quá xa


        // Luôn luôn hiển thị trang cuối
        if (!buttons.includes(totalPages)) {
            buttons.push(totalPages);
        }

        return buttons;
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 5,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const [activeIndex1, setActiveIndex1] = useState(null);
    const categories1 = [
        "Sách bán chạy",
        "Sách - truyện tranh",
        "Sách lịch sử"
    ];
    const handleItemClick = (index) => {
        setActiveIndex1(index); // Cập nhật trạng thái khi nhấn
    };


    const handleMouseEnter = (product) => {
        setHoveredProduct(product);
    };

    const [quantity, setQuantity] = useState(1);

    //* Hàm thêm vào giỏ hàng
    const addToCart = (product) => {
        const user = JSON.parse(sessionStorage.getItem('user')); // Lấy thông tin người dùng từ session
        if (!user) {
            // NotificationManager.warning('Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng!', 'Cảnh báo');
            alert('Vui lòng đăng nhập trước khi thêm vào giỏ hàng');
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

    //* Hàm "Mua ngay"
    const buyNow = (product) => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            alert("Vui lòng đăng nhập để mua sản phẩm");
            navigate("/login");
            return;
        }

        sessionStorage.setItem('checkoutItem', JSON.stringify({ ...product, so_luong: quantity }));
        navigate("/checkout");
    };

    return (
        <div className={styles.parent}>
            <HeaderUser
                onSearchResults={handleSearchResults} // Truyền callback xử lý kết quả tìm kiếm
                fixed={true}
            />

            {/* Banner */}
            <section className={styles.bannerSection}>
                <div className={styles.menuBar}>
                    <ul>
                        <li onClick={() => handleCategoryClick(1)}>
                            <FontAwesomeIcon icon={faBook} style={{ marginRight: '7px' }} />
                            Văn học
                            <FontAwesomeIcon icon={faAngleRight} className={styles.arrowR} />
                        </li>
                        <li onClick={() => handleCategoryClick(2)}>
                            <FontAwesomeIcon icon={faBook} style={{ marginRight: '7px' }} />
                            Kinh tế
                            <FontAwesomeIcon icon={faAngleRight} className={styles.arrowR} />
                        </li>
                        <li onClick={() => handleCategoryClick(3)}>
                            <FontAwesomeIcon icon={faBook} style={{ marginRight: '7px' }} />
                            Kỹ năng sống
                            <FontAwesomeIcon icon={faAngleRight} className={styles.arrowR} />
                        </li>
                        <li onClick={() => handleCategoryClick(4)}>
                            <FontAwesomeIcon icon={faBook} style={{ marginRight: '7px' }} />
                            Tâm lý - giới tính
                            <FontAwesomeIcon icon={faAngleRight} className={styles.arrowR} />
                        </li>
                        <li onClick={() => handleCategoryClick(5)}>
                            <FontAwesomeIcon icon={faBook} style={{ marginRight: '7px' }} />
                            Sách - Truyện tranh
                            <FontAwesomeIcon icon={faAngleRight} className={styles.arrowR} />
                        </li>
                        <li onClick={() => handleCategoryClick(6)}>
                            <FontAwesomeIcon icon={faBook} style={{ marginRight: '7px' }} />
                            Giáo dục - lịch sử
                            <FontAwesomeIcon icon={faAngleRight} className={styles.arrowR} />
                        </li>
                    </ul>
                </div>
                <div className={styles.bannerMain}>
                    <ImageCarousel />
                </div>
            </section>

            {/* Hiển thị sản phẩm */}
            <section className={styles.section}>
                {/* <h2>{isSearching ? 'Kết Quả Tìm Kiếm' : 'Sách Hay'}</h2> */}
                <div className={styles.bannerImgList}>
                    <img className={styles.bannerImg} src="/images/banner_1.jpg" alt="Banner" />
                    <img className={styles.bannerImg} src="/images/banner_2.jpg" alt="Banner" />
                    <img className={styles.bannerImg} src="/images/banner_3.jpg" alt="Banner" />
                </div>

                <div className={styles.listBook}>
                    <div className={styles.listBookHeader}>
                        <h3>SÁCH MỚI</h3>
                        <div className={styles.listBookOption}>
                            <ul>
                                {categories1.map((category, index) => (
                                    <li
                                        key={index}
                                        className={index === activeIndex1 ? styles.li_active : ""}
                                        onClick={() => handleItemClick(index)}
                                    >
                                        {category}
                                    </li>
                                ))}
                                <p>Xem thêm <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                                </p>
                            </ul>
                        </div>
                    </div>

                    <Slider {...settings}
                        className={styles.sliderCss}
                    >
                        {currentProducts.map((product, index) => (
                            <div
                                className={styles.productCard}
                                key={index}
                                onClick={() => handleProductClick(product.ma_san_pham)}
                            >
                                <div className={styles.imageContainer}>
                                    <img
                                        className={styles.productImage}
                                        src={product.anh_san_pham}
                                        alt={product.ten_san_pham}
                                    />
                                </div>

                                <div className={styles.productInfo}>
                                    <p className={styles.productName}>{product.ten_san_pham}</p>
                                    <p className={styles.tacGia}>{product.tac_gia}</p>
                                    <div className={styles.price}>
                                        <p className={styles.productPrice}>
                                            {product.gia ? product.gia.toLocaleString('vi-VN') : 0}đ
                                        </p>
                                        <div className={styles.listCategoryHayItemSol}>
                                            <img src='./images/solana.png' alt='solana icon' />
                                            <p>{product.gia_sol || 0} SOL</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </Slider>

                </div>

                <div className={styles.listBookBanner}>
                    <div className={styles.listBookHeader}>
                        <h3>TÁC PHẨM VĂN HỌC</h3>
                        <div className={styles.listBookOption}>
                            <ul>
                                <p onClick={() => handleNameCategoryClick()}>Xem thêm <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                                </p>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.listBookBannerBox}>
                        <img className={styles.listBookBannerBoxImg} src='/images/banner_vanhoc.jpg' alt='Banner' />
                        <div className={styles.listBookBannerProduct}>
                            {vanHoc.slice(0, 8).map((product, index) => (
                                <div
                                    key={index}
                                    className={styles.listBookBannerProductItem}
                                    onClick={() => handleProductClick(product.ma_san_pham)}
                                >
                                    <img src={product.anh_san_pham}
                                        alt={product.ten_san_pham} />
                                    <p className={styles.productName}>{product.ten_san_pham}</p>
                                    <div className={styles.price}>
                                        <p className={styles.productPrice}>
                                            {product.gia ? product.gia.toLocaleString('vi-VN') : 0}đ
                                        </p>
                                        <div className={styles.listCategoryHayItemSol}>
                                            <img src='./images/solana.png' alt='solana icon' />
                                            <p>{product.gia_sol || 0} SOL</p>
                                        </div>
                                    </div>

                                    <div className={styles.formHover}>
                                        <div className={styles.formHoverInfo}>
                                            <h5>{product.ten_san_pham}</h5>
                                            <p className={styles.tg}>{product.tac_gia}</p>
                                            <p className={styles.mt}>{product.mo_ta}</p>
                                            <div className={styles.positionOk}>
                                                <span onClick={() => handleNameCategoryClick()}>Xem thêm</span>
                                                <div className={styles.money}>
                                                    <p className={styles.productPrice}>
                                                        {product.gia ? product.gia.toLocaleString('vi-VN') : 0}đ
                                                    </p>
                                                    <div className={styles.listCategoryHayItemSol}>
                                                        <img src='./images/solana.png' alt='solana icon' />
                                                        <p>{product.gia_sol || 0} SOL</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        addToCart(product);
                                                    }}
                                                    className={styles.addCart}
                                                >
                                                    THÊM VÀO GIỎ HÀNG
                                                </button>
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        buyNow(product);
                                                    }}
                                                    className={styles.muangay}>MUA NGAY
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.bangXepHang}>
                    <div className={styles.bangXepHangHeader}>
                        <img src='/images/banner_vote_06_2020.png' />
                        <h3>Bảng xếp hạng sách bán chạy</h3>
                    </div>
                    <div className={styles.categoryXepHang}>
                        <ul>
                            <li className={styles.categoryXepHang_active}>Văn học</li>
                            <li>Kinh tế</li>
                            <li>Lịch sử</li>
                            <li>Tâm lý - kỹ năng sống</li>
                            <li>Thiếu nhi</li>
                            <li>Sách học ngoại ngữ</li>
                            <li>Anime - truyện tranh</li>
                        </ul>
                    </div>
                    <div className={styles.bangXepHangContent}>
                        <div className={styles.bangXepHangProduct}>
                            {banChays.slice(0, 5).map((product, index) => (
                                <div key={index}
                                    className={styles.bangXepHangProductItem}
                                    onMouseEnter={() => handleMouseEnter(product)}
                                    onClick={() => handleProductClick(product.ma_san_pham)}
                                >
                                    <h3 className={styles.xepHang}>0{index + 1}</h3>
                                    <img src={product.anh_san_pham}
                                        alt={product.ten_san_pham} />
                                    <div>
                                        <p className={styles.productNameXepHang}>{product.ten_san_pham}</p>
                                        <p className={styles.tacGiaXepHang}>{product.tac_gia}</p>
                                        <div className={styles.price}>
                                            <p className={styles.productPrice}>
                                                {product.gia ? product.gia.toLocaleString('vi-VN') : 0}đ
                                            </p>
                                            <div className={styles.listCategoryHayItemSol}>
                                                <img src='./images/solana.png' alt='solana icon' />
                                                <p>{product.gia_sol || 0} SOL</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.bangXepHangProductInfo}>

                            <div className={styles.bangXepHangProductInfoImage}>
                                <img src={hoveredProduct.anh_san_pham} alt={hoveredProduct.ten_san_pham} />
                            </div>
                            <div className={styles.bangXepHangProductInfoText}>
                                <h4>{hoveredProduct.ten_san_pham}</h4>
                                <p>Tác giả: {hoveredProduct.tac_gia}</p>
                                <p>Thể loại: {hoveredProduct.the_loai?.ten_the_loai}</p>
                                <div className={styles.price}>
                                    <p className={styles.productPrice}>
                                        ₫{hoveredProduct.gia?.toLocaleString('vi-VN') || 0}
                                    </p>
                                    <div className={styles.listCategoryHayItemSol}>
                                        <img src='./images/solana.png' alt='solana icon' />
                                        <p>{hoveredProduct.gia_sol || 0}</p>
                                    </div>
                                </div>
                                <strong>{hoveredProduct.ten_san_pham} ( {hoveredProduct.phien_ban} )</strong>
                                <p>{hoveredProduct.mo_ta}</p>
                                <div className={styles.formHoverInfo}>
                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            addToCart(hoveredProduct);
                                        }}
                                        className={styles.addCart}
                                    >
                                        THÊM VÀO GIỎ HÀNG
                                    </button>
                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            buyNow(hoveredProduct);
                                        }}
                                        className={styles.muangay}>MUA NGAY
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className={styles.listBookBanner}>
                    <div className={styles.listBookHeader}>
                        <h3>SÁCH LỊCH SỬ</h3>
                        <div className={styles.listBookOption}>
                            <ul>
                                <p onClick={() => handleNameCategoryClick()}>Xem thêm <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                                </p>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.listBookBannerBox}>
                        <img className={styles.listBookBannerBoxImg2} src='/images/banner_lichsu.jpg' alt='Banner' />
                        <div className={styles.listBookBannerProduct}>
                            {lichSu.slice(0, 8).map((product, index) => (
                                <div
                                    key={index}
                                    className={styles.listBookBannerProductItem}
                                    onClick={() => handleProductClick(product.ma_san_pham)}
                                >
                                    <img src={product.anh_san_pham}
                                        alt={product.ten_san_pham} />
                                    <p className={styles.productName}>{product.ten_san_pham}</p>
                                    <div className={styles.price}>
                                        <p className={styles.productPrice}>
                                            {product.gia ? product.gia.toLocaleString('vi-VN') : 0}đ
                                        </p>
                                        <div className={styles.listCategoryHayItemSol}>
                                            <img src='./images/solana.png' alt='solana icon' />
                                            <p>{product.gia_sol || 0} SOL</p>
                                        </div>
                                    </div>

                                    <div className={styles.formHover}>
                                        <div className={styles.formHoverInfo}>
                                            <h5>{product.ten_san_pham}</h5>
                                            <p className={styles.tg}>{product.tac_gia}</p>
                                            <p className={styles.mt}>{product.mo_ta}</p>
                                            <div className={styles.positionOk}>
                                                <span onClick={() => handleNameCategoryClick()}>Xem thêm</span>
                                                <div className={styles.money}>
                                                    <p className={styles.productPrice}>
                                                        {product.gia ? product.gia.toLocaleString('vi-VN') : 0}đ
                                                    </p>
                                                    <div className={styles.listCategoryHayItemSol}>
                                                        <img src='./images/solana.png' alt='solana icon' />
                                                        <p>{product.gia_sol || 0} SOL</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        addToCart(product);
                                                    }}
                                                    className={styles.addCart}
                                                >
                                                    THÊM VÀO GIỎ HÀNG
                                                </button>
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        buyNow(product);
                                                    }}
                                                    className={styles.muangay}>MUA NGAY
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.listBookBanner}>
                    <div className={styles.listBookHeader}>
                        <h3>TRUYỆN TRANH - ANIME</h3>
                        <div className={styles.listBookOption}>
                            <ul>
                                <p onClick={() => handleNameCategoryClick()}>Xem thêm <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                                </p>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.listBookBannerBox}>
                        <img className={styles.listBookBannerBoxImg2} src='/images/banner_truyentranh.jpg' alt='Banner' />
                        <div className={styles.listBookBannerProduct}>
                            {currentProducts.slice(0, 8).map((product, index) => (
                                <div
                                    onClick={() => handleProductClick(product.ma_san_pham)}
                                    key={index} className={styles.listBookBannerProductItem}>
                                    <img src={product.anh_san_pham}
                                        alt={product.ten_san_pham} />
                                    <p className={styles.productName}>{product.ten_san_pham}</p>
                                    <div className={styles.price}>
                                        <p className={styles.productPrice}>
                                            {product.gia ? product.gia.toLocaleString('vi-VN') : 0}đ
                                        </p>
                                        <div className={styles.listCategoryHayItemSol}>
                                            <img src='./images/solana.png' alt='solana icon' />
                                            <p>{product.gia_sol || 0} SOL</p>
                                        </div>
                                    </div>

                                    <div className={styles.formHover}>
                                        <div className={styles.formHoverInfo}>
                                            <h5>{product.ten_san_pham}</h5>
                                            <p className={styles.tg}>{product.tac_gia}</p>
                                            <p className={styles.mt}>{product.mo_ta}</p>
                                            <div className={styles.positionOk}>
                                                <span onClick={() => handleNameCategoryClick()}>Xem thêm</span>
                                                <div className={styles.money}>
                                                    <p className={styles.productPrice}>
                                                        {product.gia ? product.gia.toLocaleString('vi-VN') : 0}đ
                                                    </p>
                                                    <div className={styles.listCategoryHayItemSol}>
                                                        <img src='./images/solana.png' alt='solana icon' />
                                                        <p>{product.gia_sol || 0} SOL</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        addToCart(product);
                                                    }}
                                                    className={styles.addCart}
                                                >
                                                    THÊM VÀO GIỎ HÀNG
                                                </button>
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        buyNow(product);
                                                    }}
                                                    className={styles.muangay}>MUA NGAY
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>




                {/* <div className={styles.productGrid}>
                    {currentProducts.map((product, index) => (
                        <div
                            className={styles.productCard}
                            key={index}
                            onClick={() => handleProductClick(product.ma_san_pham)}
                        >
                            <div className={styles.imageContainer}>
                                <img
                                    className={styles.productImage}
                                    src={product.anh_san_pham}
                                    alt={product.ten_san_pham}
                                />
                            </div>
                            <div className={styles.productInfo}>
                                <p className={styles.productName}>{product.ten_san_pham}</p>
                                <p className={styles.productPrice}>
                                    {product.gia ? product.gia.toLocaleString('vi-VN') : 0} đ
                                </p>
                            </div>
                        </div>
                    ))}
                </div> */}

                {/* <button onClick={handleViewMore} className={styles.viewMoreButton}>
                    Xem Thêm
                </button> */}

                {/* <div className={styles.pagination}>
                    {getPaginationButtons(currentPage, totalPages).map((button, index) =>
                        button === '...' ? (
                            <span key={index} className={styles.ellipsis}>...</span>
                        ) : (
                            <button
                                key={button}
                                className={`${styles.pageButton} ${currentPage === button ? styles.activePage : ''}`}
                                onClick={() => handlePageChange(button)}
                                style={{ marginLeft: ' 10px' }}
                            >
                                {button}
                            </button>
                        )
                    )}
                </div> */}

                <NotificationContainer />

            </section>

            <FooterUser />
        </div>
    );
};

export default HomeUserIndex;