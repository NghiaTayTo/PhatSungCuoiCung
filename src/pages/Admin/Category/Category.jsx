import React, { useEffect, useState } from 'react';
import ListCategory from '../../../utils/AdminList/ListCategory';

import { getCategory, searchCategoryByName, getCountAllCategory } from '../../../utils/API/CategoryAPI';
import Loading from '../../../utils/Order/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import CategoryForm from '../../../utils/FormVisible/CategoryForm';
import BoxThongKeBlack from '../Order/BoxThongKeBlack';

const Category = () => {

    const [isLoading, setIsLoading] = useState(true);

    const [categorys, setCategorys] = useState([]);
    // * Search By Name
    const [searchName, setSearchName] = useState("");

    const [count, setCount] = useState(0);

    const handleKeySearchByName = (e) => {
        setSearchName(e.target.value);
    }
    const handleSearchByName = () => {
        if (searchName !== null && searchName !== undefined && searchName !== "") {
            searchCategoryByName(searchName)
                .then(data => {
                    setCategorys(data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else {
            handleGetAllCategory();
        }
    };

    const handleGetAllCategory = async () => {
        try {
            const data = await getCategory();
            setCategorys(data);
        } catch (error) {
            console.log(error);

        }
    }

    // * trạng thái category
    const [categoryID, setCategoryID] = useState(0);
    const [key, setKey] = useState('');
    const [isDetailVisible, setDetailVisible] = useState(false);

    // ** Ẩn hiện form chi tiết sản phẩm
    const handleShowDetails = (voucherID, key) => {
        // setSelectedBook(book); // Lưu thông tin sách vào state
        setDetailVisible(true); // Hiển thị giao diện chi tiết
        setCategoryID(voucherID)
        setKey(key);
    };
    const handleCloseDetails = () => {
        setDetailVisible(false); // Đóng giao diện chi tiết
    };

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const data = await getCategory();
                setCategorys(data);

                const countAll = await getCountAllCategory();
                setCount(countAll);
            } catch (error) {
                console.error(error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="page scroll-container">
            <div className="container">
                {
                    isLoading ? (
                        <>
                            <Loading />
                        </>
                    ) : (
                        <>
                            <div className='admin-home'>
                                <BoxThongKeBlack action={handleGetAllCategory} title={'Thể loại sách'} value={count} image={'book.png'} cursor={'pointer'}/>
                            </div>

                            <div style={{ width: '1150px', display: 'flex', justifyContent: 'space-between' }}>
                                <div className="product-search_item">
                                    <label>Tên thể loại</label>
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

                                <button
                                    onClick={() => handleShowDetails(null, 'add')}
                                    className="product-search_btnadd">+ Thêm thể loại</button>

                            </div>

                            <ListCategory listCategory={categorys} />
                        </>
                    )
                }

                {
                    isDetailVisible && (
                        <CategoryForm
                            keyForm={key}
                            onClose={handleCloseDetails}
                            categoryID={categoryID}
                        />
                    )
                }

            </div>
        </div>
    );
};

export default Category;