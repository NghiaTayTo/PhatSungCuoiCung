import React, { useEffect, useState } from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";


import "../ManageProduct/ManageProduct.css";
import "./ManagerOrder.css";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Loading from '../../utils/Order/Loading';

import ListOrder from "../../utils/ManageListUI/ListOrder";

import {
    getOrderDetailsByTrangThai,
    calculateNewOrderRevenue,
    countOrderDetailsByStatus,
    searchOrderDetailsByDateCreated,
    searchOrderDetailsByOrderID,
} from "../../utils/API/OrderDetailsAPI";

const ManagerOrder = () => {

    // * Trả hàng - Hoàn tiền
    const maTrangThai = 15;
    const maTrangThai2 = 17; // xác nhận trả hàng
    const maTrangThai3 = 18; // hủy yêu cầu trả hàng

    const [listOrder, setListOrder] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    // * Số lượng đơn hàng chi tiết
    const [orderDetailsCount, setOrderDetailsCount] = useState(0)
    const [orderDetailsCount2, setOrderDetailsCount2] = useState(0)
    const [orderDetailsCount3, setOrderDetailsCount3] = useState(0)
    // * doanh thu tạm tính
    const [totalRevenue, setTotalRevenue] = useState(0);
    // * lưu thông tin tìm kiếm theo mã
    const [searchOrderID, setSearchOrderID] = useState('');
    // * lưu thông tin tìm kiếm theo ngày tạo
    const [searchDateCreated, setSearchDateCreated] = useState('');
    const [keySearch, setKeySearch] = useState(false);
    // * Tiêu đề
    const [title, setTitle] = useState('');

    const handleChangeInputOrderID = (e) => {
        // const maHoaDonChiTiet = e.target.value.replace(/[^0-9]/g, '');
        setSearchOrderID(e.target.value)
        console.log(e.target.value);
    }

    const handleChangeInputCreateDate = (e) => {
        setSearchDateCreated(e.target.value)
    }

    // * Tìm kiếm theo ID
    const handleSearchOrderID = async () => {
        setKeySearch(true);
        try {
            const listOrderData = await searchOrderDetailsByOrderID(maTrangThai, searchOrderID);
            setListOrder(listOrderData);
        } catch (err) {
            console.log("L��i khi tìm kiếm theo mã đơn hàng" + err);
        }
    }

    // * Tìm kiếm theo ngày tạo
    const handleSearchByDateCreated = async () => {
        setKeySearch(true);
        try {
            const listOrderData = await searchOrderDetailsByDateCreated(maTrangThai, searchDateCreated);
            setListOrder(listOrderData);
        } catch (err) {
            console.log("L��i khi tìm kiếm theo ngày tạo đơn hàng" + err);
        }
    }

    // * Hàm list order theo xác nhận trả hàng
    const handleSearchTraHang = (matt, title) => {
        setIsLoading(true);
        const fetchOrderData = async () => {
            try {
                const listOrderData = await getOrderDetailsByTrangThai(matt);
                setListOrder(listOrderData);

                const revenueData = await calculateNewOrderRevenue(matt);
                setTotalRevenue(revenueData);

                setTitle(title);
            } catch (err) {
                console.log("Lỗi khi load order mới" + err);
            }
            setIsLoading(false);
        }
        fetchOrderData();
    }

    useEffect(() => {
        setIsLoading(true);
        const fetchOrderData = async () => {
            try {
                const listOrderData = await getOrderDetailsByTrangThai(maTrangThai);
                setListOrder(listOrderData);

                const revenueData = await calculateNewOrderRevenue(maTrangThai);
                setTotalRevenue(revenueData);

                const countOrderDetailsByStatusData = await countOrderDetailsByStatus(maTrangThai);
                setOrderDetailsCount(countOrderDetailsByStatusData);

                const countOrderDetailsByStatusData2 = await countOrderDetailsByStatus(maTrangThai2);
                setOrderDetailsCount2(countOrderDetailsByStatusData2);

                const countOrderDetailsByStatusData3 = await countOrderDetailsByStatus(maTrangThai3);
                setOrderDetailsCount3(countOrderDetailsByStatusData3);

                setTitle('Yêu cfầu Trả hàng - Hoàn tiền');

            } catch (err) {
                console.log("Lỗi khi load order mới" + err);
            }
            setIsLoading(false);
        }

        fetchOrderData();
    }, []);


    return (
        <div className="page scroll-container">
            <div className="container">

                {
                    isLoading === true ? <Loading />
                        : (
                            <>

                                <div className="productbtn-list productbtn-list-flex">
                                    <div>
                                        <button onClick={() => handleSearchTraHang(maTrangThai, 'Yêu cầu Trả hàng - Hoàn tiền')} className="productbtn-item btn1">
                                            <p>Yêu cầu trả hàng</p>
                                            <h1>{orderDetailsCount}</h1>
                                        </button>
                                        <button onClick={() => handleSearchTraHang(maTrangThai2, 'Xác nhận Trả hàng - Hoàn tiền')} className="productbtn-item btn1">
                                            <p>Đã trả hàng</p>
                                            <h1>{orderDetailsCount2}</h1>
                                        </button>
                                        <button onClick={() => handleSearchTraHang(maTrangThai3, 'Hủy yêu cầu Trả hàng - Hoàn tiền')} className="productbtn-item btn1">
                                            <p>Hủy trả hàng</p>
                                            <h1>{orderDetailsCount3}</h1>
                                        </button>
                                    </div>
                                    <div>
                                        <button className="productbtn-item btn2 no-hover productbtn-item_update">
                                            <p>Doanh thu ước tính</p>
                                            <h1>{totalRevenue ? totalRevenue.toLocaleString('vi-VN') : 0}<span> VNĐ</span></h1>
                                        </button>
                                    </div>

                                </div>
                                {/* 3 thanh tìm kiếm */}
                                <div className="product-search_list">
                                    <div className="product-search_item">
                                        <label>Mã đơn hàng</label>
                                        <div className="product-search_item__flex">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={searchOrderID}
                                                onChange={handleChangeInputOrderID} />
                                            <button onClick={handleSearchOrderID} className="product-search_item__btn">
                                                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="product-search_item">
                                        <label>Ngày đặt hàng</label>
                                        <div className="product-search_item__flex">
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={searchDateCreated}
                                                onChange={handleChangeInputCreateDate}
                                            />
                                            <button onClick={handleSearchByDateCreated} className="product-search_item__btn">
                                                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                                            </button>
                                        </div>
                                    </div>
                                    {/* <div className="product-search_item">
                                        <label>Tên sách</label>
                                        <div
                                            style={{ width: "350px" }}
                                            className="product-search_item__flex"
                                        >
                                            <input
                                                type="text"
                                                className="form-control"
                                            />
                                            <button className="product-search_item__btn">
                                                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                                            </button>
                                        </div>
                                    </div> */}
                                </div>

                                <ListOrder listOrders={listOrder} keySearch={keySearch} status='trahang' statusHeader={'Trả hàng - Hoàn tiền'} 
                                title={title} keyForm={'seller'}/>
                            </>
                        )
                }

            </div>
        </div>
    );
};

export default ManagerOrder;