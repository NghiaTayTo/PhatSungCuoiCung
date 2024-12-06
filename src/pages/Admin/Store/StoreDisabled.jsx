import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import BoxThongKeBlue from '../Order/BoxThongKeBlue';
import Loading from '../../../utils/Order/Loading';
import ListStoreSeller from '../ListData/ListStoreSeller';
import { getCuaHangChoDuyet, getCuaHangKhoaAdmin } from '../../../utils/API/StoreAPI';

const StoreDisabled = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState([]);

    useEffect(() => {   
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const data = await getCuaHangKhoaAdmin();
                setData(data);
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
                    isLoading ? (
                        <>
                            <Loading />
                        </>
                    ) : (
                        <>
                            <div className='admin-home'>
                                <BoxThongKeBlue
                                    // action={handleGetAllCategory} 
                                    title={'Cửa hàng bị khóa'}
                                    value={data.length} 
                                    image={'ecommerce.png'}
                                    cursor={'pointer'} />
                            </div>
                            <div className="product-search_item">
                                <label style={{ fontWeight: '600' }}>Tên cửa hàng</label>
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

{/* 2 - cửa hàng bị khóa */}
                            <ListStoreSeller storeList={data} keyForm={2}/>
                            
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default StoreDisabled;