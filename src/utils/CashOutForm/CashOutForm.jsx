import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';

import { countUp } from "../../pages/countUp.js";
import './CashOutForm.css';
import { getCuaHangById } from '../API/StoreAPI.jsx';

const CashOutForm = () => {

    const [shop, setShop] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const store = await getCuaHangById();
                setShop(store);

            } catch (err) {
                console.log('Lỗi khi load sản phẩm bán chạy: ' + err);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className="info-basic_column3 info-basic_column3-up">
                <div style={{ height: '230px' }} className="info-box_item info-box_item-up">
                    <div style={{ backgroundColor: '#FFF8DA' }} className="info-box_item_icon">
                        <div style={{ backgroundColor: '#FFDB45' }} className="info-box_item_icon--layout2">
                            <FontAwesomeIcon style={{ left: '12px' }} className="faIcon" icon={faWallet}></FontAwesomeIcon>
                        </div>
                    </div>
                    <div className="info-box_item_money">
                        <h3>Tổng Thu Nhập</h3>
                        <p><strong>{shop.doanh_thu ? shop.doanh_thu.toLocaleString('vi-VN') : 0}</strong> VNĐ</p>
                    </div>

                    <div>
                        
                    </div>
                    <form className='cashout'>
                        <label>Số tiền cần rút</label>
                        <input type='number' /> 
                        <p>Số tiền không hợp lệ!</p>
                        <div className='cashout-card'>
                            <input type='radio' checked/>
                            <p>Thẻ ngân hàng của tôi</p>
                        </div>
                    </form>
                    <button className="info-box_item--btn info-box_item--btn-up">Rút ngay</button>
                </div>
            </div>
        </div>
    );
};

export default CashOutForm;