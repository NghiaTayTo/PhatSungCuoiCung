import React, { useEffect, useState } from 'react';
import styles from './HomeUser.module.css';
import stylesIndex from './HomeUserIndex.module.css';
import { filterProduct, getAllBook, getProductsByNameCategory } from '../../utils/API/ProductAPI';
import { getAllBookUser } from '../../utils/API/ProductAPI';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import FooterUser from '../Component/FooterUser';
import HeaderUser from '../Component/HeaderUser';
import axios from 'axios';
import Loading from '../../utils/Order/Loading';
import { getCategory } from '../../utils/API/CategoryAPI';

const HomeUser = () => {
    const [products, setProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [categorys, setCategorys] = useState([]);
    const [user, setUser] = useState(null);

    // * useState tìm kiếm
    const [nameCategory, setNameCategory] = useState('');
    const [priceText, setPriceText] = useState('');
    const [titleSearch, setTitleSearch] = useState('');
    const [min, setMin] = useState('');
    const [max, setMax] = useState('');
    const [idCategory, setIdCategory] = useState('');

    const productsPerPage = 20; // Số sản phẩm mỗi trang

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const ma_the_loai = searchParams.get('ma_the_loai'); // Mã thể loại từ query params
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query'); // Từ khóa tìm kiếm từ query params
    // const ma_the_loai = searchParams.get('ma_the_loai');
    const ten_the_loai = searchParams.get('ten_the_loai');

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
                } else if (ten_the_loai) {
                    const response = await getProductsByNameCategory(ten_the_loai);
                    setProducts(response);
                    setNameCategory(ten_the_loai);
                } else {
                    // Fetch toàn bộ sản phẩm nếu không có ma_the_loai
                    const data = await getAllBookUser();
                    setProducts(data);
                    setIsSearching(false);
                }

                const categoryData = await getCategory();
                setCategorys(categoryData);
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

    // * Hàm chọn thể loại
    const handleClickCategory = async (category) => {
        const id = category.ma_the_loai;
        const name = category.ten_the_loai;

        setIdCategory(id);
        setNameCategory(name);

        try {
            const data = await filterProduct(min, max, 'no sort', id);
            setProducts(data);
        } catch (e) {
            console.log(e);
        }
    }

    // * Hàm chọn giá tiền
    const handleClickPrice = async (text, priceStart, priceEnd) => {
        setMin(priceStart);
        setMax(priceEnd);
        setPriceText(text);
        try {
            const data = await filterProduct(priceStart, priceEnd, 'no sort', idCategory);
            setProducts(data);
        } catch (e) {
            console.log(e);
        }
    }

    const titleSearchFunction = () => {
        if (nameCategory !== '' && priceText !== '') {
            return `${nameCategory} - ${priceText}`
        } else if (nameCategory !== '' && priceText === '') {
            return `${nameCategory}`
        } else if (nameCategory === '' && priceText !== '') {
            return `${priceText}`
        }
    }

    const categoryRows = categorys.map((category, index) => {
        return (
            <li key={index}
                onClick={() => handleClickCategory(category)}
            >{category.ten_the_loai}</li>
        )
    })

    const productRows = products.map((product, index) => (
        <div
            key={index}
            className={`${stylesIndex.listBookBannerProductItem} ${styles.heightItem}`}
            onClick={() => handleProductClick(product.ma_san_pham)}
        >
            <img src={product.anh_san_pham}
                alt={product.ten_san_pham} />
            <p className={stylesIndex.productName}>{product.ten_san_pham}</p>
            <p className={styles.nameTacGia}>{product.tac_gia}</p>
            <div className={stylesIndex.price}>
                <p className={stylesIndex.productPrice}>
                    ₫{product.gia ? product.gia.toLocaleString('vi-VN') : 0}
                </p>
                <div className={stylesIndex.listCategoryHayItemSol}>
                    <img src='./images/solana.png' alt='solana icon' />
                    <p>{product.gia_sol || 0}</p>
                </div>
            </div>

            <div className={stylesIndex.formHover}>
                <div className={stylesIndex.formHoverInfo}>
                    <h5>{product.ten_san_pham}</h5>
                    <p className={stylesIndex.tg}>{product.tac_gia}</p>
                    <p className={stylesIndex.mt}>{product.mo_ta}</p>
                    <div className={stylesIndex.positionOk}>
                        <span>Xem thêm</span>
                        <div className={stylesIndex.money}>
                            <p className={stylesIndex.productPrice}>
                                {product.gia ? product.gia.toLocaleString('vi-VN') : 0}đ
                            </p>
                            <div className={stylesIndex.listCategoryHayItemSol}>
                                <img src='./images/solana.png' alt='solana icon' />
                                <p>{product.gia_sol || 0}</p>
                            </div>
                        </div>
                        <button className={stylesIndex.addCart}>THÊM VÀO GIỎ HÀNG</button>
                        <button className={stylesIndex.muangay}>MUA NGAY</button>
                    </div>
                </div>
            </div>
        </div>
    ))

    if (!products || !categorys) return <Loading />;

    return (
        <div className={styles.parent}>
            <HeaderUser user={user} logout={() => setUser(null)} onSearchResults={handleSearchResults} />

            <section className={styles.section}>
                <div className={styles.searchBarCategory}>
                    <div className={styles.searchBarCategoryList}>
                        <h3>Thể loại</h3>
                        <ul>
                            {
                                categoryRows
                            }
                        </ul>
                    </div>

                    <div className={styles.searchBarCategoryPrice}>
                        <h3>Theo giá</h3>
                        <ul>
                            <li
                                onClick={() => handleClickPrice('Giá nhỏ hơn 50.000đ', 0, 50000)}
                            >Giá nhỏ hơn 50.000đ</li>
                            <li
                                onClick={() => handleClickPrice('Giá từ 50.000 - 100.000đ', 50000, 100000)}
                            >Giá từ 50.000 - 100.000đ</li>
                            <li
                                onClick={() => handleClickPrice('Giá từ 100.000 - 200.000đ', 100000, 200000)}
                            >Giá từ 100.000 - 200.000đ</li>
                            <li
                                onClick={() => handleClickPrice('Giá từ 200.000 - 300.000đ', 200000, 300000)}
                            >Giá từ 200.000 - 300.000đ</li>
                            <li
                                onClick={() => handleClickPrice('Giá từ 300.000 - 400.000đ', 300000, 400000)}
                            >Giá từ 300.000 - 400.000đ</li>
                            <li
                                onClick={() => handleClickPrice('Giá từ 400.000 - 500.000đ', 400000, 500000)}
                            >Giá từ 400.000 - 500.000đ</li>
                            <li
                                onClick={() => handleClickPrice('Giá từ 500.000 - 1.000.000đ', 500000, 1000000)}
                            >Giá từ 500.000 - 1.000.000đ</li>
                            <li
                                onClick={() => handleClickPrice('Giá lớn hơn 1.000.000đ', 1000000, 999999999)}
                            >Giá lớn hơn 1.000.000đ</li>
                        </ul>
                    </div>
                </div>
                {/* Hiển thị sản phẩm dựa trên kết quả tìm kiếm hoặc danh sách gốc */}
                <div className={styles.sectionProductListForm}>
                    <div className={styles.sectionProductListHeaderText}>
                        <h3>{titleSearchFunction()}</h3>
                        <div>
                            Sản phẩm ( {products.length} )
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
                        </div>
                    </div>
                    <div className={styles.sectionProductList}>
                        {products.length <= 0 ? (
                            <h1>Không tìm thấy sản phẩm mong muốn.</h1>
                        ) : (
                            <>
                                {productRows}
                            </>
                        )}
                    </div>
                </div>

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
