import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import BoxThongKeBlue from '../Order/BoxThongKeBlue';
import Loading from '../../../utils/Order/Loading';
import BoxThongKeBlack from '../Order/BoxThongKeBlack';
import ListBaoCaoDefault from '../ListData/ListBaoCaoDefault';
import { getBaoCaoCuaHangByDuyetAdmin, getBaoCaoCuaHangByTrangThaiAdmin, getCountBaoCaoCuaHangAdmin } from '../../../utils/API/BaoCaoAPI';

const BaoCaoDanhGia = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [title, setTitle] = useState('Báo cáo mới');

    const [listBaoCao, setListBaoCao] = useState([]);

    // * đếm
    const [all, setAll] = useState(0);
    const [newL, setNewL] = useState(0);
    const [huy, setHuy] = useState(0);
    const [duyet, setDuyet] = useState(0);

    // * mới - đã hủy
    const handleNew = async () => {
        setIsLoading(true);
            setTitle('Báo cáo mới');
        try {
            const data = await getBaoCaoCuaHangByTrangThaiAdmin(1);
            setListBaoCao(data);
        }catch (e) {
            console.log(e);
        }
        setIsLoading(false);
    }
    // * đã hủy
    const handleHuy = async () => {
        setIsLoading(true);
            setTitle('Báo cáo không hợp lệ');
        try {
            const data = await getBaoCaoCuaHangByTrangThaiAdmin(3);
            setListBaoCao(data);
        }catch (e) {
            console.log(e);
        }
        setIsLoading(false);
    }
    // * đã hủy
    const handleDuyet = async () => {
        setIsLoading(true);
            setTitle('Báo cáo đã duyệt');
        try {
            const data = await getBaoCaoCuaHangByDuyetAdmin();
            setListBaoCao(data);
        }catch (e) {
            console.log(e);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getBaoCaoCuaHangByTrangThaiAdmin(1);
                setListBaoCao(data);
                setNewL(data.length)

                const dataAll = await getCountBaoCaoCuaHangAdmin();
                setAll(dataAll);

                const dataHuy = await getBaoCaoCuaHangByTrangThaiAdmin(3);
                setHuy(dataHuy.length);

                const dataDuyet = await getBaoCaoCuaHangByDuyetAdmin();
                setDuyet(dataDuyet.length);
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
                                    // action={handleGetListGiaoDich}
                                    title={'Tổng số báo cáo'}
                                    value={all}
                                    image={'report.png'}
                                    cursor={'default'} />
                                <BoxThongKeBlack
                                    action={handleNew}
                                    title={'Báo cáo mới'}
                                    value={newL}
                                    image={'health-check.png'}
                                    cursor={'pointer'} />
                                <BoxThongKeBlue
                                    action={handleDuyet}
                                    title={'Báo cáo đã duyệt'}
                                    value={duyet}
                                    image={'petition.png'}
                                    cursor={'pointer'} />
                                <BoxThongKeBlack
                                    action={handleHuy}
                                    title={'Báo cáo đã hủy'}
                                    value={huy}
                                    image={'report-issue.png'}
                                    cursor={'pointer'} />
                            </div>

                            <div className="product-search_item">
                                <label>Mã báo cáo</label>
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

                            <ListBaoCaoDefault
                                listBaoCaos={listBaoCao}
                                title={title}
                            />

                        </>
                    )}
            </div>
        </div>
    );
};

export default BaoCaoDanhGia;