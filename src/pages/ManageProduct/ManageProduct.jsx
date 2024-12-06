import React, { useEffect, useState } from "react";

import { getBookByHidden, getNumberOfBookByHidden, getSanPhamByCuaHangId, searchProductsByCategoryID, searchSanPhamByName, getNumberOfBookByYeuCauMoKhoa } from '../../utils/API/ProductAPI';
import { getCategory } from '../../utils/API/CategoryAPI';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./ManageProduct.css";
import Loading from '../../utils/Order/Loading';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import ListProduct from "../../utils/ManageListUI/ListProduct";
import BookForm from "../../utils/FormVisible/BookForm";

import {
    getCountBooksAll,
    getNumberOfBookByClock,
    getNumberOfBookByInStock,
    getNumberOfBookByOutOfStock,
    getNumberOfBookByBrowse,
    searchBookByStatus
} from "../../utils/API/ProductAPI";

const ManageProduct = () => {


    // *Lấy số lượng sản phẩm
    const [productCount, setProductCount] = useState(0);

    // * KeySearch
    const [searchKey, setSearchKey] = useState("");

    // *Form xem chi tiết, thêm sách mới
    const [isAddBookVisible, setAddBookVisible] = useState(false);
    // *Lấy tất cả sản phẩm thuộc cửa hàng
    const [products, setProducts] = useState([]);
    // * Thể loại
    const [category, setCategory] = useState([]);

    // * Search By Name
    const [searchName, setSearchName] = useState("");

    const handleVisibleForm = () => {
        setAddBookVisible(true);
    }

    const handleHiddenForm = () => {
        setAddBookVisible(false);
    }

    //* Tìm kiếm sản phẩm theo thể loại
    const handleSelectChange = (e) => {
        setSearchName("");
        if (e.target.value >= 0) {
            searchProductsByCategoryID(Number(e.target.value))
                .then(data => {
                    setProducts(data);
                    if (data.length <= 0) {
                        setSearchKey("searchIsNull");
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else {
            getProductsAllByStoreID();
        }
    }

    // * Tìm kiếm sản phẩm theo tên
    const handleKeySearchByName = (e) => {
        setSearchName(e.target.value);
    }
    const handleSearchByName = () => {
        if (searchName !== null && searchName !== undefined && searchName !== "") {
            searchSanPhamByName(searchName)
                .then(data => {
                    setProducts(data);
                })
                .catch(error => {
                    setSearchKey("searchIsNull");
                    console.error('Error fetching data:', error);
                });
        } else {
            getProductsAllByStoreID();
        }
    };


    // * Hàm tìm kiếm sản phẩm theo mã trạng thái
    const handleSearchByStatus = (statusInt) => {
        setSearchName("");
        searchBookByStatus(statusInt)
            .then(data => {
                setProducts(data)
                if (data.length <= 0) {
                    setSearchKey("searchIsNull")
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // * hàm lấy sản phẩm đang ẩn
    const handleSearchBookHidden = async () => {
        try {
            const data = await getBookByHidden();
            setProducts(data);
        } catch (e) {
            console.log(e);
        }
    }

    // * Hàm lấy ra tất cả sản phẩm
    const getProductsAllByStoreID = () => {
        setSearchName("");
        getSanPhamByCuaHangId()
            .then(data => {
                // console.log(data);
                setProducts(data);

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const [clock, setClock] = useState();
    const [inStock, setInStock] = useState();
    const [outOfStock, setOutOfStock] = useState();
    const [browse, setBrowse] = useState();
    const [an, setAn] = useState();
    const [yeucaumokhoa, setyeucaumokhoa] = useState();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const productsAll = await getSanPhamByCuaHangId();
                setProducts(productsAll);

                const categoryData = await getCategory();
                setCategory(categoryData);

                const countBooks = await getCountBooksAll();
                setProductCount(countBooks);

                const countClock = await getNumberOfBookByClock();
                setClock(countClock);

                const countInStock = await getNumberOfBookByInStock();
                setInStock(countInStock);

                const countOutOfStock = await getNumberOfBookByOutOfStock();
                setOutOfStock(countOutOfStock);

                const countBrose = await getNumberOfBookByBrowse();
                setBrowse(countBrose);

                const countAn = await getNumberOfBookByHidden();
                setAn(countAn);

                const datayeucau = await getNumberOfBookByYeuCauMoKhoa();
                setyeucaumokhoa(datayeucau);

                // await new Promise((resolve) => setTimeout(resolve, 10000));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setIsLoading(false);
        };

        fetchData();

    }, [])

    return (
        <div className="page scroll-container">
            <div className="container">
                {
                    isLoading === true ? (
                        <>
                            <Loading />
                        </>

                    ) : (
                        <>
                            <div className="productbtn-list">
                                <button className="productbtn-item btn1" onClick={() => getProductsAllByStoreID()}>
                                    <p>Tổng sản phẩm</p>
                                    <h1>{productCount}</h1>
                                </button>
                                <button className="productbtn-item btn2" onClick={() => handleSearchByStatus(2)}>
                                    <p>Sách bị khóa</p>
                                    <h1>{clock}</h1>
                                </button>
                                <button className="productbtn-item btn3" onClick={() => handleSearchByStatus(1)}>
                                    <p>Sách chờ duyệt</p>
                                    <h1>{browse}</h1>
                                </button>
                                <button className="productbtn-item btn4" onClick={() => handleSearchByStatus(3)}>
                                    <p>Sách còn hàng</p>
                                    <h1>{inStock}</h1>
                                </button>
                                <button className="productbtn-item btn5" onClick={() => handleSearchByStatus(4)}>
                                    <p>Sách hết hàng</p>
                                    <h1>{outOfStock}</h1>
                                </button>
                                <button className="productbtn-item btn1" onClick={() => handleSearchBookHidden()}>
                                    <p>Sách đang ẩn</p>
                                    <h1>{an}</h1>
                                </button>
                                <button className="productbtn-item btn1" onClick={() => handleSearchByStatus(5)}>
                                    <p>Yêu cầu mở khóa</p>
                                    <h1>{yeucaumokhoa}</h1>
                                </button>
                            </div>

                            <div className="product-search_list">
                                <div className="product-search_item">
                                    <label>Thể loại sách</label>
                                    <div className="product-search_item__flex">
                                        <select
                                            className="form-select"
                                            aria-label="Danh sách danh mục sản phẩm"
                                            onChange={handleSelectChange}
                                        >
                                            <option value={-1}>-- Tất cả --</option>
                                            {category.map((cat, index) => (
                                                <option key={index} value={cat.ma_the_loai}>
                                                    {cat.ten_the_loai}
                                                </option>
                                            ))}
                                        </select>
                                        {/* <button>
                                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                            </button> */}
                                    </div>
                                </div>
                                {/* <div className="product-search_item">
                        <label>Tên tác giả</label>
                        <div className="product-search_item__flex">
                            <input type="text" class="form-control" />
                            <button className="product-search_item__btn">
                                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                            </button>
                        </div>
                    </div> */}
                                <div className="product-search_item">
                                    <label>Tên sách</label>
                                    <div
                                        style={{ width: "350px" }}
                                        className="product-search_item__flex"
                                    >
                                        <input
                                            type="text"
                                            class="form-control"
                                            value={searchName}
                                            onChange={handleKeySearchByName}
                                        />
                                        <button
                                            className="product-search_item__btn"
                                            onClick={handleSearchByName}
                                        >
                                            <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={handleVisibleForm} className="product-search_btnadd" style={{ marginLeft: '414px' }}>+ Thêm sản phẩm</button>
                                </div>
                            </div>

                            <ListProduct
                                listBooks={products}
                                keySearch={searchKey}
                                searchName={searchName}
                                isLoading={isLoading}>
                            </ListProduct>

                            {/* Thông tin sách */}
                            {
                                isAddBookVisible && (
                                    <BookForm keyForm={'add-book'} onClose={handleHiddenForm} />
                                )
                            }
                        </>
                    )
                }

            </div>
        </div>
    );
};

export default ManageProduct;
