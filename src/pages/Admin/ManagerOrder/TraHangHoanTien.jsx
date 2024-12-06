import React, { useEffect, useState } from 'react';
import Loading from '../../../utils/Order/Loading';
import BoxThongKeBlue from '../Order/BoxThongKeBlue';
import { getAllOrderDetailsByStatus } from '../../../utils/API/OrderDetailsAPI';
import BoxThongKeBlack from '../Order/BoxThongKeBlack';
import ListOrder from '../../../utils/ManageListUI/ListOrder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ListOrderAdmin from '../ListData/ListOrderAdmin';

const TraHangHoanTien = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const data = await getAllOrderDetailsByStatus(15);
                setOrderList(data);
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
                                    title={'Yêu cầu trả hàng'}
                                    value={orderList.length} 
                                    image={'requisition.png'} 
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
                                status={'trahang'}
                                statusHeader={'Trả hàng'}
                                keyForm={'admin'}
                            />
                        </>
                    )}
            </div>
        </div>
    );
};

export default TraHangHoanTien;