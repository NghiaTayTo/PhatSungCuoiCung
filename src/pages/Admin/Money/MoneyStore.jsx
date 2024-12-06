import React, { useEffect, useState } from 'react';
import Loading from '../../../utils/Order/Loading';
import BoxThongKeBlue from '../Order/BoxThongKeBlue';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { getBookByDoanhThuAdmin } from '../../../utils/API/StoreAPI';
import ListMoneyStore from '../ListData/ListMoneyStore';
import { getRevenueAdmin } from '../../../utils/API/AdminAPI';

const MoneyStore = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [listStore, setListStore] = useState([]);
    const [doanhthusan, setDoanhThuSan] = useState({});

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const doanhthusan = await getRevenueAdmin();
                setDoanhThuSan(doanhthusan);
                const data = await getBookByDoanhThuAdmin();
                setListStore(data);
            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        }
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
                                    title={'Doanh thu cửa hàng'}
                                    value={doanhthusan.doanh_thu_cua_hang ? doanhthusan.doanh_thu_cua_hang.toLocaleString('vi-VN') : 0}
                                    image={'requisition.png'}
                                    cursor={'pointer'} />
                            </div>

                            <div className="product-search_item">
                                <label>Tên cửa hàng</label>
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

                            <ListMoneyStore
                                storeList={listStore}
                            />

                        </>
                    )
                }

            </div>
        </div>
    );
};

export default MoneyStore;