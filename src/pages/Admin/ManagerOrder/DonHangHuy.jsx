import React, { useEffect, useState } from 'react';
import Loading from '../../../utils/Order/Loading';
import BoxThongKeBlue from '../Order/BoxThongKeBlue';
import BoxThongKeBlack from '../Order/BoxThongKeBlack';
import ListOrder from '../../../utils/ManageListUI/ListOrder';
import { getAllOrderDetailsByStatus } from '../../../utils/API/OrderDetailsAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ListOrderAdmin from '../ListData/ListOrderAdmin';

const DonHangHuy = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [orderList, setOrderList] = useState([]);

    const [countAll, setCountAll] = useState(0);
    const [khachHangHuy, setKhachHangHuy] = useState(0);
    const [cuaHangHuy, setCuaHangHuy] = useState(0);

    const [title, setTitle] = useState('Danh sách đơn do khách hàng hủy');

    const handleGetDonHangHuyByTrangThai14 = () => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const data = await getAllOrderDetailsByStatus(14);
                setOrderList(data);
                setTitle(`Danh sách đơn do KHÁCH HÀNG HỦY`);
            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        };
        fetchData();
    }
    const handleGetDonHangHuyByTrangThai16 = () => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const data = await getAllOrderDetailsByStatus(16);
                setOrderList(data);
                setTitle(`Danh sách đơn do CỬA HÀNG HỦY`);
            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        };
        fetchData();
    }

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const data = await getAllOrderDetailsByStatus(14);
                setOrderList(data);

                const count2 = await getAllOrderDetailsByStatus(14);
                setKhachHangHuy(count2.length);
                const count3 = await getAllOrderDetailsByStatus(16);
                setCuaHangHuy(count3.length);
                setCountAll(count2.length + count3.length);

            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [])

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
                                <BoxThongKeBlack
                                    // action={handleGetAllCategory} 
                                    title={'Đơn hàng hủy'}
                                    value={countAll}
                                    image={'delete.png'}
                                    cursor={'default'} />
                                <BoxThongKeBlue
                                    action={handleGetDonHangHuyByTrangThai14}
                                    title={'Khách hàng hủy'}
                                    value={khachHangHuy}
                                    image={'deleteuser.png'}
                                    cursor={'pointer'} />
                                <BoxThongKeBlue
                                    action={handleGetDonHangHuyByTrangThai16}
                                    title={'Cửa hàng hủy'}
                                    value={cuaHangHuy}
                                    image={'deleteseller.png'}
                                    cursor={'pointer'} />
                            </div>

                            <div className="product-search_item">
                                <label>Mã hóa đơn</label>
                                <div
                                    style={{ width: "350px" }}
                                    className="product-search_item__flex"
                                >
                                    <input
                                        type="text"
                                        class="form-control"
                                    // value={searchName}
                                    // onChange={handleKeySearchByName}
                                    />
                                    <button
                                        className="product-search_item__btn"
                                    // onClick={handleSearchByName}
                                    >
                                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                                    </button>
                                </div>
                            </div>

                            <ListOrderAdmin
                                listOrders={orderList}
                                status={'huydon'}
                                statusHeader={'Đơn hủy'}
                                title={title}
                                keyForm={'admin'}
                            />
                        </>
                    )}
            </div>
        </div>
    );
};

export default DonHangHuy;