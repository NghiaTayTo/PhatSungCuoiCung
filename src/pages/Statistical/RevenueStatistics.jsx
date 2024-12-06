import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faC, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-regular-svg-icons';

import "./Statistical.css";
import ApexChartRevenue from '../../chart/ApexChartRevenue';

import CashOutForm from '../../utils/CashOutForm/CashOutForm';
import ListDoanhThu from '../../utils/ManageListUI/ListDoanhThu';

import { getBookByDoanhThu } from '../../utils/API/ProductAPI';
import Loading from '../../utils/Order/Loading';
import { getCuaHangById } from "../../utils/API/StoreAPI";

const RevenueStatistics = () => {

    // * Lưu danh sách bán chạy
    const [bookList, setBookList] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [shop, setShop] = useState({});

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const data = await getBookByDoanhThu();
                setBookList(data);

                const store = await getCuaHangById();
                setShop(store);

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
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                {/* tổng quan */}
                                                <div className="productbtn-list">
                                                    <button className="productbtn-item btn1 btn-update">
                                                        <p>Doanh thu ước tính hôm nay</p>
                                                        <h1>
                                                            {0} <span>VNĐ</span>
                                                        </h1>
                                                        <p>120 đơn hàng</p>
                                                    </button>
                                                    <button className="productbtn-item btn2 btn-update">
                                                        <p>Tổng doanh thu cửa hàng</p>
                                                        <h1>
                                                            {shop.doanh_thu ? shop.doanh_thu.toLocaleString('vi-VN') : 0} <span>VNĐ</span>
                                                        </h1>
                                                        <p>Sunrise2.vn - 108 days</p>
                                                    </button>
                                                </div>
                                                {/* sản phẩm có doanh thu cao nhất */}
                                                <div className="product-revenue">
                                                    {/* <div className="product-revenue-item">
<div className="product-revenue-book">
<img src="/images/sach.jpg" alt="book"/>
<div className="product-revenue-book_name">
<h5>Sách hướng dẫn trở thành Pro Trader</h5>
<p>Bán chạy nhất</p>
</div>
</div>
<div className="product-revenue-info">
<div className="product-revenue-info_col1">
<span>Số lượt bán</span>
<p>21.279</p>
</div>
<div className="product-revenue-info_col2">
<span>Doanh thu</span>
<p>102.023.000 VNĐ</p>
</div>
</div>
</div>
<div className="product-revenue-item">
<div className="product-revenue-book">
<img src="/images/sach.jpg" alt="book"/>
<div className="product-revenue-book_name">
<h5>Sách hướng dẫn trở thành Pro Trader</h5>
<p>Bán chạy nhất</p>
</div>
</div>
<div className="product-revenue-info">
<div className="product-revenue-info_col1">
<span>Số lượt bán</span>
<p>21.279</p>
</div>
<div className="product-revenue-info_col2">
<span>Doanh thu</span>
<p>102.023.000 VNĐ</p>
</div>
</div>
</div>
<div className="product-revenue-item">
<div className="product-revenue-book">
<img src="/images/sach.jpg" alt="book"/>
<div className="product-revenue-book_name">
<h5>Sách hướng dẫn trở thành Pro Trader</h5>
<p>Bán chạy nhất</p>
</div>
</div>
<div className="product-revenue-info">
<div className="product-revenue-info_col1">
<span>Số lượt bán</span>
<p>21.279</p>
</div>
<div className="product-revenue-info_col2">
<span>Doanh thu</span>
<p>102.023.000 VNĐ</p>
</div>
</div>
</div> */}


                                                    <ListDoanhThu listBookDoanhThu={bookList} />
                                                </div>
                                            </div>
                                            <div>
                                                <CashOutForm />
                                                <div className="payment-method">
                                                    <h4>Doanh thu theo phương thức thanh toán</h4>
                                                    <div>
                                                        <FontAwesomeIcon className="icon-payment" icon={faDollarSign}></FontAwesomeIcon>
                                                        <p>Thanh toán khi nhận hàng</p>
                                                    </div>
                                                    <h3>999.999.999 <span>VNĐ</span></h3>
                                                    <div>
                                                        <FontAwesomeIcon className="icon-payment" icon={faCreditCard}></FontAwesomeIcon>
                                                        <p>Thanh toán online</p>
                                                    </div>
                                                    <h3>999.999.999 <span>VNĐ</span></h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '20px' }}>
                                            <ApexChartRevenue />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className='notification-notstore'>
                                            <img className='storenotbook' src={`/images/storenotbook.png`} alt="Hãy tạo sản phẩm đầu tiên của bạn." />
                                            <h3>Cửa hàng chưa có sản phẩm. Hãy tạo ngay sản phẩm đầu tiên của bạn.</h3>
                                        </div>
                                    </>
                                )
                            }
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default RevenueStatistics;
