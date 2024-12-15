import React, { useEffect, useState } from 'react';
import styles from './HomeUser.module.css';
import { getAllBookUser } from '../../utils/API/ProductAPI';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import FooterUser from '../Component/FooterUser';
import HeaderUser from '../Component/HeaderUser';
import axios from 'axios';

const HomeUser = () => {
    const [products, setProducts] = useState([]); // Danh sách sản phẩm
    const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm
    const [isSearching, setIsSearching] = useState(false); // Trạng thái đang tìm kiếm
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [user, setUser] = useState(null); // Thông tin người dùng
    const productsPerPage = 20; // Số sản phẩm mỗi trang

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const ma_the_loai = searchParams.get('ma_the_loai'); // Mã thể loại từ query params
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query'); // Từ khóa tìm kiếm từ query params

    // Fetch sản phẩm theo mã thể loại hoặc tìm kiếm
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (query) {
                    // Fetch sản phẩm theo từ khóa tìm kiếm
                    const response = await axios.get(
                        `http://localhost:8080/api/v1/sanpham/${encodeURIComponent(query)}`
                    );
                    setSearchResults(response.data);
                    setIsSearching(true);
                } else if (ma_the_loai) {
                    // Fetch sản phẩm theo mã thể loại
                    const response = await axios.get(
                        `http://localhost:8080/api/v1/sanpham/00000-1000000/orderBy-no%20sort/theloai?ma_the_loai=${ma_the_loai}`
                    );
                    setProducts(response.data);
                    setIsSearching(false);
                } else {
                    // Fetch toàn bộ sản phẩm nếu không có query và ma_the_loai
                    const data = await getAllBookUser();
                    setProducts(data);
                    setIsSearching(false);
                }
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error);
            }
        };

        fetchProducts();
    }, [query, ma_the_loai]);

    // Hàm xử lý khi có kết quả tìm kiếm từ HeaderUser
    const handleSearchResults = (results) => {
        setSearchResults(results);
        setIsSearching(results.length > 0);
        setCurrentPage(1); // Quay về trang đầu khi có kết quả tìm kiếm mới
    };

    // Hàm chuyển hướng đến chi tiết sản phẩm
    const handleProductClick = (id) => {
        navigate(`/ProductDetail/${id}`);
    };

    // Lấy các sản phẩm cho trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const displayedProducts = (isSearching ? searchResults : products).slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    // Xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Tính số trang dựa trên số lượng sản phẩm
    const totalPages = Math.ceil(((isSearching ? searchResults : products) || []).length / productsPerPage);

    return (
        <div className={styles.parent}>
            <HeaderUser user={user} logout={() => setUser(null)} onSearchResults={handleSearchResults} />

            <section className={styles.section}>
                {displayedProducts.length > 0 ? (
                    displayedProducts.map((product, index) => (
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
                                    {product.gia ? product.gia.toLocaleString() : 0} VND
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.noResults}>Không tìm thấy sản phẩm phù hợp.</p>
                )}
            </section>

            {/* Điều hướng phân trang */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}

            <FooterUser />
        </div>
    );
};

export default HomeUser;
