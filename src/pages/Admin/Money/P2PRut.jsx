import React, { useEffect, useState } from 'react';
import Loading from '../../../utils/Order/Loading';
import BoxThongKeBlue from '../Order/BoxThongKeBlue';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { getBookByDoanhThuAdmin } from '../../../utils/API/StoreAPI';
import ListMoneyAdmin from '../ListData/ListMoneyAdmin';
import { getGiaoDichNapTien, getRevenueAdmin } from '../../../utils/API/AdminAPI';
import ListP2P from '../ListData/ListP2P';
import BoxThongKeBlack from '../Order/BoxThongKeBlack';
import { getAllGiaoDichAdmin } from '../../../utils/API/GiaoDichAPI';

const P2PRut = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [listGiaoDich, setListGiaoDich] = useState([]);
    const [tongRut, setTongRut] = useState({});

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const tongRut = await getRevenueAdmin();
                setTongRut(tongRut);

                const giaoDichRut = await getAllGiaoDichAdmin();
                setListGiaoDich(giaoDichRut);
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
                                    title={'Tổng tiền rút'}
                                    value={tongRut.tong_tien_rut ? tongRut.tong_tien_rut.toLocaleString('vi-VN') : 0}
                                    image={'electronic-payment.png'}
                                    cursor={'default'} />
                                <BoxThongKeBlack
                                    // action={handleGetAllCategory} 
                                    title={'Tổng giao dịch rút'}
                                    value={listGiaoDich ? listGiaoDich.length.toLocaleString('vi-VN') : 0}
                                    image={'electronic-payment.png'}
                                    cursor={'default'} />
                            </div>

                            <div className="product-search_item">
                                <label>Mã ví</label>
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

                            <ListP2P
                                p2pList={listGiaoDich}
                                typeTranSaction={'rut'}
                            />

                        </>
                    )
                }

            </div>
        </div>
    );
};

export default P2PRut;