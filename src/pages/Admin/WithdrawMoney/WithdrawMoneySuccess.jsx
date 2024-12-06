import React, { useEffect, useState } from 'react';
import Loading from '../../../utils/Order/Loading';
import BoxThongKeBlue from '../Order/BoxThongKeBlue';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { getAllGiaoDichByTrangThaiAdmin } from '../../../utils/API/GiaoDichAPI';
import ListWithdrawMoney from '../ListData/ListWithdrawMoney';

const WithdrawMoneySuccess = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [listGiaoDich, setListGiaoDich] = useState([]);

    const handleGetListGiaoDich = async () => {
        setIsLoading(true);
        try {
            const data = await getAllGiaoDichByTrangThaiAdmin(1);
            setListGiaoDich(data);
        } catch (e) {
            console.log(e);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const data = await getAllGiaoDichByTrangThaiAdmin(1);
                setListGiaoDich(data);
            } catch (err) {
                console.log(err);
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
                                    action={handleGetListGiaoDich} 
                                    title={'Đã chuyển tiền'}
                                    value={listGiaoDich.length} 
                                    image={'cash-flow.png'}
                                    cursor={'pointer'} />
                            </div>

                            <div className="product-search_item">
                                <label>Mã giao dịch</label>
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

                            <ListWithdrawMoney listGiaoDich={listGiaoDich}></ListWithdrawMoney>

                        </>
                    )}
            </div>
        </div>
    );
};

export default WithdrawMoneySuccess;