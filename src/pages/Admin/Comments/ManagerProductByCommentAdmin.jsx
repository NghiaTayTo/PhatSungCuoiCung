import React, { useEffect, useState } from 'react';


// import ListProductByComment from "../../../utils/ManageListUI/ListProductByComment";

// import { getListCommentByBookID } from "../../../utils/API/DanhGiaAPI";
import { getSanPhamOrderByComment } from "../../../utils/API/ProductAPI";
import Loading from '../../../utils/Order/Loading';
import ListProductByCommentAdmin from '../ListData/ListProductByCommentAdmin';

const ManagerProductByCommentAdmin = () => {
    const [isLoading, setIsLoading] = useState(true);

    // * lưu comments
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const listProduct = await getSanPhamOrderByComment();
                setProducts(listProduct);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setIsLoading(false);
        }

        fetchData();

    }, []);

    return (
        <div className="page scroll-container">
            <div className="container">

                {
                    isLoading === true ? (
                        <Loading />
                    ) : (
                        <>
                            <div className="productbtn-list">
                                <button className="productbtn-item btn1 no-hover btn2" style={{ width: '230px' }}>
                                    <p>Điểm cửa hàng</p>
                                    <h1>4.5 / 5</h1>
                                </button>
                                {/* <button className="productbtn-item btn1 no-hover btn1" style={{ width: '175px' }}>
                                    <p>Đánh giá 5 sao</p>
                                    <h1>12</h1>
                                </button>
                                <button className="productbtn-item btn1 no-hover btn1" style={{ width: '175px' }}>
                                    <p>Đánh giá 4 sao</p>
                                    <h1>12</h1>
                                </button>
                                <button className="productbtn-item btn1 no-hover btn1" style={{ width: '175px' }}>
                                    <p>Đánh giá 3 sao</p>
                                    <h1>12</h1>
                                </button>
                                <button className="productbtn-item btn1 no-hover btn1" style={{ width: '175px' }}>
                                    <p>Đánh giá 2 sao</p>
                                    <h1>12</h1>
                                </button>
                                <button className="productbtn-item btn1 no-hover btn1" style={{ width: '175px' }}>
                                    <p>Đánh giá 1 sao</p>
                                    <h1>12</h1>
                                </button> */}
                            </div>

                            {/* Add your code here */}
                                <div>

                                </div>
                            <ListProductByCommentAdmin listBooks={products} />
                        </>
                    )}

            </div>
        </div>
    );
};

export default ManagerProductByCommentAdmin;