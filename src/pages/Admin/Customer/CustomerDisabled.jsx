import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import BoxThongKeBlack from '../Order/BoxThongKeBlack';
import Loading from '../../../utils/Order/Loading';
import { getCustomerYeuCauMoKhoa } from '../../../utils/API/CustomerAPI';
import ListCustomer from '../ListData/ListCustomer';

const CustomerDisabled = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [listCustomer, setListCustomer] = useState([]);

    const handleGetYeuCauMoKhoa = async () => {
        setIsLoading(true);
        try {
            const data = await getCustomerYeuCauMoKhoa();
            setListCustomer(data);
        } catch (e) {
            console.log(e);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const data = await getCustomerYeuCauMoKhoa();
                setListCustomer(data);
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
                            <div className='admin-home'>
                                <BoxThongKeBlack
                                    action={handleGetYeuCauMoKhoa}
                                    title={'Yêu cầu mở khóa'}
                                    value={listCustomer.length}
                                    image={'people.png'}
                                    cursor={'pointer'} />
                            </div>
                            <div className="product-search_item">
                                <label style={{ fontWeight: '600' }}>Tên thể loại</label>
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

                            <ListCustomer CustomerList={listCustomer} trangThaiTK={'yeucau'}/>
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default CustomerDisabled;