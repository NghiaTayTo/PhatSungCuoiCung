import React, { useEffect, useState } from 'react';
import Loading from '../../../utils/Order/Loading';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCuaHangByIdAdmin } from '../../../utils/API/StoreAPI';
import { getSanPhamByCuaHangIdAdmin, getSanPhamOrderByCommentByStoreID } from '../../../utils/API/ProductAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';

import './StoreManagerAdmin.css';
import ListProductByStore from '../ListData/ListProductByStore';
import ListProductByComment from '../../../utils/ManageListUI/ListProductByComment';
import ListProductByCommentAdmin from '../ListData/ListProductByCommentAdmin';
import ListProductByPhiDichVuAdmin from '../ListData/ListProductByPhiDichVuAdmin';
const ManagerStoreDetailsDichVu = () => {
    const location = useLocation();
    // const storeID = location.state?.storeID;
    // const form = location.state?.form;

    const {storeID, form} = location.state;

    const [isLoading, setIsLoading] = useState(false);

    // * Store chi tiết
    const [store, setStore] = useState({});
    // * list sản phẩm thuộc cửa hàng
    const [listProduct, setListProduct] = useState([]);

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1); 
    };

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const dataStore = await getCuaHangByIdAdmin(storeID);
                setStore(dataStore);

                // const dataProducts = await getSanPhamByCuaHangIdAdmin(storeID);
                // setListProduct(dataProducts);

                const listProduct = await getSanPhamOrderByCommentByStoreID(storeID);
                setListProduct(listProduct);
            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        };
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

                            <div className='admin-store-details'>

                                <div onClick={handleBackClick} className='icon-back-admin'>
                                <FontAwesomeIcon  icon={faArrowLeftLong} />
                                </div>
                                
                                <div className='admin-store-details_img1'>
                                    <img src='/images/bia3.jpg' alt='ảnh bìa' />
                                </div>

                                <div className='admin-store-details_img2'>
                                    <img src='/images/avt3.jpg' alt='ảnh đại diện' />
                                </div>

                                <div className='store-form-info store-form-info_update'>
                                    <h1 style={{ marginTop: '-10px' }}>{store.ten_cua_hang}</h1>
                                    <p style={{ marginTop: '10px' }}>Email: {store.email}</p>
                                    <p>Số điện thoại: {store.so_dien_thoai}</p>
                                    <p>Địa chỉ: {store.dia_chi_cua_hang}</p>
                                    <p>Sản phẩm: 100</p>
                                    <p>Điểm cửa hàng: 4.5 / 5</p>
                                    <p>Lượt bán: 1.234</p>
                                    <p className='diemvipham-antoan'>Điểm vi phạm: 0 - An toàn</p>
                                </div>
                                <div className='store-form-info store-form-info_update2'>
                                    <h2 style={{ marginTop: '-5px' }}> - Tài khoản đăng ký:</h2>
                                    <p style={{ marginTop: '10px' }}>Họ và tên: {store.tai_khoan?.ho_ten}</p>
                                    <p>Email: {store.tai_khoan?.email}</p>
                                    <p>Số điện thoại: {store.tai_khoan?.so_dt}</p>
                                    <p>Ngày tạo: {store.tai_khoan?.ngay_tao}</p>
                                </div>

                            </div>

                            <ListProductByPhiDichVuAdmin listBooks={listProduct} form={form} />
                        </>)
                }
            </div>
        </div>
    );
};

export default ManagerStoreDetailsDichVu;