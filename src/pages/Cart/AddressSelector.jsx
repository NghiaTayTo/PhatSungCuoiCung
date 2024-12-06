// AddressSelector.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddressSelector.css';
import { useNavigate } from 'react-router-dom/dist';

const AddressSelector = ({ onSelectAddress, onClose }) => {
    const [addresses, setAddresses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const user = JSON.parse(sessionStorage.getItem('user'));
                if (user) {
                    const response = await axios.get(`http://localhost:8080/api/v1/nguoidung/diachi/${user.id_tai_khoan}`);
                    setAddresses(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách địa chỉ:", error);
            }
        };

        fetchAddresses();
    }, []);
    const handleAddAddress = () =>{
        navigate('/address')
    }

    return (
        <div className="address-selector-overlay">
            <div className="address-selector-modal">
                <h3>Chọn địa chỉ giao hàng</h3>
                <ul className="address-list">
                    {addresses.map(address => (
                        <li key={address.ma_dia_chi} onClick={() => onSelectAddress(address)}>
                            <p>{address.ten_dia_chi}</p>
                            {address.dia_chi_mac_dinh && <span>(Mặc định)</span>}
                        </li>
                    ))}
                </ul>
                <button style={{fontSize: '14px', marginRight: '180px'}} onClick={onClose} className="close-button">Đóng</button>
                <button style={{fontSize: '14px'}} onClick={handleAddAddress} className="close-button">Thêm địa chỉ</button>
            </div>
        </div>
    );
};

export default AddressSelector;
