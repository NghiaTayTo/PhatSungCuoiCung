import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "../ManageProduct/ManageProduct.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import ListVoucher from '../../utils/ManageListUI/ListVoucher';
import VoucherForm from '../../utils/FormVisible/VoucherForm';
import Loading from '../../utils/Order/Loading';

import { getCuaHangById } from "../../utils/API/StoreAPI";
import {
    getVouchersByCuaHangId,
    searchVouchersByStatus,
    getCountVoucherByStore,
    getCountVoucherByStatus,
    searchVouchersByName,
    searchVouchersByPrice
} from "../../utils/API/VoucherAPI";

const ManagerVoucher = () => {
    const [isLoading, setIsLoading] = useState(true);

    // *Hàm lấy ra tất cả vouchers
    const [vouchers, setVouchers] = useState([]);
    // *Lấy thông tin cửa hàng
    const [shop, setShop] = useState({});
    // * Số lượng voucher theo shop
    const [vouchersCount, setVouchersCount] = useState([]);
    // *Đếm số lượng voucher theo trạng thái
    const [chuaApDung, setChuaApDung] = useState(0);
    const [conHan, setConHan] = useState(0);
    const [hetHan, setHetHan] = useState(0);

    const [isAddVoucherForm, setIsAddVoucherForm] = useState(false);

    // *Hiện, ẩn form tạo voucher mới
    const handleShowAddVoucherForm = () => {
        setIsAddVoucherForm(!isAddVoucherForm);
    };
    const handleCloseAddVoucherForm = () => {
        setIsAddVoucherForm(false);
    };

    // * Hàm tìm kiếm tất cả sản phẩm của cửa hàng
    const handleSeachVouchersAll = () => {
        getVouchersByCuaHangId()
            .then(data => {
                setVouchers(data);
                if (data.length <= 0) {
                    setSearchKey("searchIsNull")
                }
            })
            .catch(error => {
                setSearchKey("searchIsNull")
                console.error('Error fetching count vouchers:', error);
                throw error;
            });
    }

    // * Hàm tìm kiếm sản phẩm theo trạng thái
    const [searchKey, setSearchKey] = useState("");
    const handleSearchVoucherByStatus = (status) => {
        searchVouchersByStatus(status)
            .then(data => {
                setVouchers(data);
                if (data.length <= 0) {
                    setSearchKey("searchIsNull")
                }
            })
            .catch(error => {
                setSearchKey("searchIsNull")
                console.error('Error fetching count vouchers:', error);
                throw error;
            });
    }

    // * Hàm tìm kiếm sản phẩm theo tên
    const [searchName, setSearchName] = useState("");
    const handleChangeVoucherName = (e) => {
        setSearchName(e.target.value);
    }
    const handleSearchVoucherByName = (searchName) => {
        searchVouchersByName(searchName)
            .then(data => {
                setVouchers(data);
                if (data.length <= 0) {
                    setSearchKey("searchIsNull")
                }
            })
            .catch(error => {
                setSearchKey("searchIsNull")
                console.error('Error fetching count vouchers:', error);
                throw error;
            });
    }

    // * Hàm tìm kiếm sản phẩm theo giá giảm
    const [saleOff, setSaleOff] = useState();
    const handleChangeVoucherSaleOff = (e) => {
        let newValue = e.target.value.replace(/[^0-9]/g, '');
        setSaleOff(newValue);
    }
    const handleSearchVoucherBySaleOff = (saleOff) => {
        searchVouchersByPrice(saleOff)
            .then(data => {
                setVouchers(data);
                if (data.length <= 0) {
                    setSearchKey("searchIsNull")
                }
            })
            .catch(error => {
                setSearchKey("searchIsNull")
                console.error('Error fetching count vouchers:', error);
                throw error;
            });
    }

    // * Hàm focus và thẻ input
    const handleFocusInput = () => {
        setSearchName("");
        setSaleOff("");
    }

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const listVouchers = await getVouchersByCuaHangId();
                setVouchers(listVouchers);

                const store = await getCuaHangById();
                setShop(store);

                const countVoucherByStore = await getCountVoucherByStore();
                setVouchersCount(countVoucherByStore);

                const [chuaApDungCount, hetHanCount, conHanCount] = await Promise.all([
                    getCountVoucherByStatus(0),
                    getCountVoucherByStatus(1),
                    getCountVoucherByStatus(2),
                ]);
                setChuaApDung(chuaApDungCount);
                setHetHan(hetHanCount);
                setConHan(conHanCount);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setIsLoading(false);
        }
        fetchData();
    }, [])

    return (
        <div className="page scroll-container">
            <div className="container">

                {
                    isLoading === true ? (
                        <Loading />
                    ) : (
                            <>
                                <div className="productbtn-list">
                                    <button className="productbtn-item btn1" onClick={handleSeachVouchersAll}>
                                        <p>Tổng Voucher</p>
                                        <h1>{vouchersCount}</h1>
                                    </button>
                                    <button className="productbtn-item btn4" onClick={() => handleSearchVoucherByStatus(0)}>
                                        <p>Voucher chưa áp dụng</p>
                                        <h1>{chuaApDung}</h1>
                                    </button>
                                    <button className="productbtn-item btn3" onClick={() => handleSearchVoucherByStatus(2)}>
                                        <p>Voucher còn hạn</p>
                                        <h1>{conHan}</h1>
                                    </button>
                                    <button className="productbtn-item btn2" onClick={() => handleSearchVoucherByStatus(1)}>
                                        <p>Voucher hết hạn</p>
                                        <h1>{hetHan}</h1>
                                    </button>
                                </div>
                                {/* 3 thanh tìm kiếm */}
                                <div className="product-search_list">
                                    <div className="product-search_item">
                                        <label>Mã voucher</label>
                                        <div className="product-search_item__flex">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={searchName}
                                                onChange={handleChangeVoucherName}
                                                onFocus={handleFocusInput}
                                            />
                                            <button className="product-search_item__btn" onClick={() => handleSearchVoucherByName(searchName)}>
                                                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="product-search_item">
                                        <label>Số tiền giảm</label>
                                        <div className="product-search_item__flex">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={saleOff}
                                                onChange={handleChangeVoucherSaleOff}
                                                onFocus={handleFocusInput}
                                            />
                                            <button className="product-search_item__btn" onClick={() => handleSearchVoucherBySaleOff(saleOff)}>
                                                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                                            </button>
                                        </div>
                                    </div>
                                    {/* <div className="product-search_item">
                        <label>Ngày tạo voucher</label>
                        <div className="product-search_item__flex">
                            <input
                                type="date"
                                className="form-control"
                            />
                            <button className="product-search_item__btn">
                                <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                            </button>
                        </div>
                    </div> */}
                                    <div style={{ marginLeft: '300px' }}>
                                        <button
                                            onClick={handleShowAddVoucherForm}
                                            className="product-search_btnadd">+ Thêm Voucher</button>
                                    </div>
                                </div>

                                <ListVoucher listVouchers={vouchers} keySearch={searchKey} />

                                {
                                    isAddVoucherForm && (
                                        <VoucherForm
                                            keyForm={'addVoucher'}
                                            onClose={handleCloseAddVoucherForm}
                                            nameShop={shop.ten_cua_hang} />
                                    )
                                }
                            </>
                        )
                }

                {/* 4 nút đầu */}


            </div>
        </div>
    );
};

export default ManagerVoucher;