import React, { useEffect, useState } from 'react';

import './Statistical.css'

import ApexChartTop from '../../chart/ApexChartTop';
import ListBestSelling from '../../utils/ManageListUI/ListBestSelling';

import { getBookBySale } from '../../utils/API/ProductAPI';
import Loading from '../../utils/Order/Loading';

const BestSellingProducts = () => {

    // * Lưu danh sách bán chạy
    const [bookList, setBookList] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const data = await getBookBySale();
                setBookList(data);

            } catch (err) {
                console.log('Lỗi khi load sản phẩm bán chạy: ' + err);
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
                            {
                                bookList.length > 0 ? (
                                    <>
                                        <ApexChartTop />
                                        <ListBestSelling listBookBestSelling={bookList} />
                                    </>
                                ) : (
                                    <div className='notification-notstore'>
                                        <img className='storenotbook' src={`/images/storenotbook.png`} alt="Hãy tạo sản phẩm đầu tiên của bạn." />
                                        <h3>Cửa hàng chưa có sản phẩm. Hãy tạo ngay sản phẩm đầu tiên của bạn.</h3>
                                    </div>
                                )
                            }
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default BestSellingProducts;