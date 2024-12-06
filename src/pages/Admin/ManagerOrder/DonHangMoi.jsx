import React, { useEffect, useState } from 'react';
import Loading from '../../../utils/Order/Loading';
import BoxThongKeBlue from '../Order/BoxThongKeBlue';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ListOrder from '../../../utils/ManageListUI/ListOrder';
import { getAllOrderDetailsByStatus } from '../../../utils/API/OrderDetailsAPI';
import ListOrderAdmin from '../ListData/ListOrderAdmin';

const DonHangMoi = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try{
                const data = await getAllOrderDetailsByStatus(11);
                setOrderList(data);
            }catch(e){
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
                                <BoxThongKeBlue
                                    // action={handleGetAllCategory} 
                                    title={'Đơn hàng mới'}
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

                            <ListOrderAdmin listOrders={orderList}
                            status={'xacnhan'}
                            statusHeader={'Đơn hàng mới'}
                            keyForm={'admin'}
                            />

                        </>
                    )}
            </div>
        </div>
    );
};

export default DonHangMoi;