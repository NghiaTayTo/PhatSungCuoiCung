import React, { useEffect, useState } from 'react';
import BoxThongKeBlack from '../Order/BoxThongKeBlack';
import { getProductViPham } from '../../../utils/API/ProductAPI';
import Loading from '../../../utils/Order/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ListManagerBookAdmin from '../ListData/ListManagerBookAdmin';

const BookInfringed = () => {

    const [listBooks, setListBooks] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const fecthData = async () => {
            try {
                const data = await getProductViPham();
                setListBooks(data);
            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        }
        fecthData();
    }, []);

    return (
        <div className="page scroll-container">
            <div className="container">
                {
                    isLoading ? (
                        <Loading />
                    ) : (
                        <>
                            <div className='admin-home'>
                                <BoxThongKeBlack title={'Sách vi phạm'} value={listBooks.length} image={'books.png'} cursor={'pointer'} />
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

                            <ListManagerBookAdmin listBooks={listBooks} trangThaiSach={'vipham'} />
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default BookInfringed;