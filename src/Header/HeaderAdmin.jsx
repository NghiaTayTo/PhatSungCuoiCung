import React, { useEffect, useState } from "react";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";

import { Link } from "react-router-dom";

import {getCuaHangById} from '../utils/API/StoreAPI';

const HeaderAdmin = () => {

    const [store, setStore] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const store = await getCuaHangById();
                setStore(store);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();

    },[]);

    return (
        <header className="headerStyle">
            <div className="logoStyle">
                <Link to="/booker.vn">
                    <img className="logo" src="/images/logoBooker.svg" alt="Booker.vn" />
                </Link>
            </div>
            <div className="accountStyle">
                <FontAwesomeIcon
                    className="custom-icon"
                    icon={faBell}
                ></FontAwesomeIcon>
                <div className="accountStyle-details">
                    <img src="/images/logoBooker.png"/>
                    <div style={{marginTop: '10px'}}>
                        {/* <h3>{store.tai_khoan?.ho_ten}</h3> */}
                        <h3>Booker</h3>
                        <p>Admin</p>
                    </div>

                    <div className="accountStyle-details_hover_ok">
                        <Link to="/booker.vn/profile">
                            <li>Tài khoản</li>
                        </Link>
                        <Link to="/booker.vn/home">
                            <li>Đến trang mua hàng</li>
                        </Link>
                        <Link to="/booker.vn/close-store">
                            <li>Thông tin về Booker</li>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderAdmin;
