import React, { useEffect, useState } from 'react';

import './Statistical.css'
import '../ManageProduct/ManageProduct.css';

import ApexChartOrder from '../../chart/ApexChartOrder';
import ListOrderStatistics from '../../utils/ManageListUI/ListOrderStatistics';

import { countOrderDetailsByStatus, getOrderDetail } from '../../utils/API/OrderDetailsAPI';
import Loading from '../../utils/Order/Loading';

const OrderStatistics = () => {

    const donhangmoi = 11;
    const donhangkhachhuy = 14;
    const dangvanchuyen = 12;
    const danggiao = 13;
    const trahang = 17;

    const [orderDetails, setOrderDetails] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [orderNew, setOrderNew] = useState(0)
    const [orderCancel, setOrderCancel] = useState(0)
    const [orderDangVanChuyen, setOrderDangVanChuyen] = useState(0)
    const [orderDaGiao, setOrderDaGiao] = useState(0)
    const [orderTraHang, setOrderTraHang] = useState(0)

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const listOrderAll = await getOrderDetail();
                setOrderDetails(listOrderAll);

                const data1 = await countOrderDetailsByStatus(donhangmoi);
                setOrderNew(data1);
                const data2 = await countOrderDetailsByStatus(donhangkhachhuy);
                setOrderCancel(data2);
                const data3 = await countOrderDetailsByStatus(dangvanchuyen);
                setOrderDangVanChuyen(data3);
                const data4 = await countOrderDetailsByStatus(danggiao);
                setOrderDaGiao(data4);
                const data5 = await countOrderDetailsByStatus(trahang);
                setOrderTraHang(data5);
            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        }

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
                                orderDetails.length > 0 ? (
                                    <>
                                        <h3>Thống kê đơn hàng mới</h3>
                                        <ApexChartOrder />
                                        <div style={{ textAlign: 'center' }} className="productbtn-list">
                                            <button className="productbtn-item btn1" >
                                                <p>Đơn hàng mới</p>
                                                <h1>{orderNew}</h1>
                                            </button>
                                            <button className="productbtn-item btn2" >
                                                <p>Đơn hàng hủy</p>
                                                <h1>{orderCancel}</h1>
                                            </button>
                                            <button className="productbtn-item btn3" >
                                                <p>Đang vận chuyển</p>
                                                <h1>{orderDangVanChuyen}</h1>
                                            </button>
                                            <button className="productbtn-item btn4" >
                                                <p>Đã giao hàng</p>
                                                <h1>{orderDaGiao}</h1>
                                            </button>
                                            <button className="productbtn-item btn5" >
                                                <p>Trả hàng / Hoàn tiền</p>
                                                <h1>{orderTraHang}</h1>
                                            </button>
                                        </div>
                                        <ListOrderStatistics listOrders={orderDetails} />
                                    </>
                                ) : (
                                    <div className='notification-notstore'>
                                        <img className='notvoucher' src={`/images/storenoorder.png`} alt="Cửa hàng chưa có đơn đặt hàng." />
                                        <h3>Cửa hàng chưa có đơn đặt hàng.</h3>
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

export default OrderStatistics;