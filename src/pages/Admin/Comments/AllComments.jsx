import React, { useEffect, useState } from 'react';
import Loading from '../../../utils/Order/Loading';
import BoxThongKeBlack from '../Order/BoxThongKeBlack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { getAllStoreAdmin } from '../../../utils/API/StoreAPI';
import ListStoreSeller from '../ListData/ListStoreSeller';

const AllComments = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [storeLists, setStoreLists] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try{
                const data = await getAllStoreAdmin();
                setStoreLists(data);
            }catch(e){
                console.log(e);
                
            }
            setIsLoading(false);
        };
        fetchData();
        
    },[]);

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
                                title={'Cửa hàng'} 
                                // value={count} 
                                image={'book.png'} 
                                cursor={'pointer'} />
                            </div>

                            <div style={{ width: '1150px', display: 'flex', justifyContent: 'space-between' }}>
                                <div className="product-search_item">
                                    <label style={{fontWeight: '600'}}>Tên cửa hàng</label>
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
                            </div>

                            <ListStoreSeller storeList={storeLists} form={'comment'}/>
                        </>
                    )}
            </div>
        </div>
    );
};

export default AllComments;