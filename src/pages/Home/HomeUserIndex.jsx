import React, { useEffect, useState } from 'react';
import styles from './HomeUserIndex.module.css';
import { getAllBook } from '../../utils/API/ProductAPI'; // API để lấy sản phẩm
import { useNavigate } from 'react-router-dom';
import FooterUser from '../Component/FooterUser';
import HeaderUser from '../Component/HeaderUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faBook } from '@fortawesome/free-solid-svg-icons';
import ImageCarousel from './ImageCarousel';

const HomeUserIndex = () => {
    const [products, setProducts] = useState([]); // Toàn bộ sản phẩm
    const [featuredProducts, setFeaturedProducts] = useState([]); // Sản phẩm nổi bật
    const [newProducts, setNewProducts] = useState([]); // Sản phẩm mới
    const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm
    const [isSearching, setIsSearching] = useState(false); // Trạng thái đang tìm kiếm
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const productsPerPage = 10; // Số sản phẩm hiển thị trên mỗi trang
    const navigate = useNavigate();

    // Lấy danh sách sản phẩm khi load trang
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllBook(21); // Lấy toàn bộ sản phẩm từ API
                setProducts(data);
                // Lấy ngẫu nhiên sản phẩm cho từng danh mục
                setFeaturedProducts(data.sort(() => 0.5 - Math.random()).slice(0, 8));
                setNewProducts(data.sort(() => 0.5 - Math.random()).slice(0, 8));
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


    return (
        <div className={styles.parent}>
            <HeaderUser
                onSearchResults={handleSearchResults} // Truyền callback xử lý kết quả tìm kiếm
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
                <h2>{isSearching ? 'Kết Quả Tìm Kiếm' : 'Sách Hay'}</h2>
                <div className={styles.productGrid}>
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
                </div>
                <button onClick={handleViewMore} className={styles.viewMoreButton}>
                    Xem Thêm
                </button>

                <div className={styles.pagination}>
                  

                    {/* Các nút trang */}
                    {getPaginationButtons(currentPage, totalPages).map((button, index) =>
                        button === '...' ? (
                            <span key={index} className={styles.ellipsis}>...</span>
                        ) : (
                            <button
                                key={button}
                                className={`${styles.pageButton} ${currentPage === button ? styles.activePage : ''}`}
                                onClick={() => handlePageChange(button)}
                                style={{marginLeft: ' 10px'}}
                            >
                                {button}
                            </button>
                        )
                    )}

                  
                </div>

            </section>

            <FooterUser />
        </div>
    );
};

export default HomeUserIndex;