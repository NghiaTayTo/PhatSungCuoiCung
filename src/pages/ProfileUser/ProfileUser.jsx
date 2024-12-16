import React, { useEffect, useState } from 'react';
import HeaderUser from '../Component/HeaderUser';
import FooterUser from '../Component/FooterUser';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ProfileUser.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar, faLocationDot, faLockOpen, faPen, faTicket, faUnlock, faUser } from '@fortawesome/free-solid-svg-icons';
import MyInformation from './MyInformation';
import AddressUser from './AddressUser';
import ChangePassword from './ChangePass';
import KhoVoucher from './KhoVoucher';
import DonHang from '../Cart/Donhang';

const ProfileUser = () => {
    const location = useLocation();
    const keyForm = location.state?.key;
    const [userData, setUserData] = useState({
        id_tai_khoan: '',    // ID tài khoản
        ho_ten: '',          // Họ và tên
        email: '',           // Email (chỉ đọc)
        so_dt: '',           // Số điện thoại
        ngay_sinh: '',       // Ngày sinh
        anh_dai_dien: '',
    });
    const [key, setKey] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);

    // Hàm lấy dữ liệu người dùng từ API
    useEffect(() => {
        if (keyForm === 4) {
            setKey(keyForm)
        }
        const fetchUserData = async () => {
            try {
                const id_tai_khoan = sessionStorage.getItem('id_tai_khoan'); // Lấy ID tài khoản từ session storage
                const response = await axios.get(`http://localhost:8080/api/taikhoan/profile/${id_tai_khoan}`);
                setUserData(response.data.result); // Lưu dữ liệu người dùng vào state
                console.log(userData)
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu người dùng:", error);
            }
        };
        fetchUserData();
    }, []);

    const handleClickOption = (key) => {
        setKey(key);
    };

    return (
        <div className="profile-page" >
            {/* Sử dụng HeaderUser */}
            <HeaderUser fixed={true} />

            <section className="profile-section" >
                <div className="profile-container">
                    <div className="profile-sidebar">
                        <div className="profile-sidebar-user">
                            <img src={userData.anh_dai_dien} />
                            <div className="profile-sidebar-user-text">
                                <strong>{userData.ho_ten}</strong>
                                <div>
                                    <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                                    <p>Sửa hồ sơ</p>
                                </div>
                            </div>
                        </div>

                        <ul>
                            <li onClick={() => handleClickOption(1)} className={key === 1 ? ' li_active' : ''}><FontAwesomeIcon className='icon-user' icon={faUser}></FontAwesomeIcon>Tài khoản của tôi</li>
                            <li onClick={() => handleClickOption(2)} className={key === 2 ? ' li_active' : ''}><FontAwesomeIcon className='icon-user' icon={faLocationDot}></FontAwesomeIcon>Địa chỉ</li>
                            <li onClick={() => handleClickOption(3)} className={key === 3 ? ' li_active' : ''}><FontAwesomeIcon className='icon-user' icon={faUnlock}></FontAwesomeIcon>Đổi mật khẩu</li>
                            <li onClick={() => handleClickOption(4)} className={key === 4 ? ' li_active' : ''}><FontAwesomeIcon className='icon-user' icon={faFileInvoiceDollar}></FontAwesomeIcon>Đơn mua</li>
                            <li onClick={() => handleClickOption(5)} className={key === 5 ? ' li_active' : ''}><FontAwesomeIcon className='icon-user' icon={faTicket}></FontAwesomeIcon>Kho Voucher</li>
                            {/* <li><Link to="/address" className="sidebar-link"><FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon>Địa chỉ</Link></li>
                            <li><Link to="/change-pass" className="sidebar-link"><FontAwesomeIcon icon={faLockOpen}></FontAwesomeIcon>Đổi mật khẩu</Link></li>
                            <li><Link to="/shopping" className="sidebar-link"><FontAwesomeIcon icon={faFileInvoiceDollar}></FontAwesomeIcon>Đơn mua</Link></li> */}
                        </ul>
                    </div>
                    <div className="profile-content">
                        {
                            key === 1 && <><MyInformation /></>
                        }
                        {
                            key === 2 && <><AddressUser /></>
                        }
                        {
                            key === 3 && <><ChangePassword /></>
                        }
                        {
                            key === 4 && <><DonHang /></>
                        }
                        {
                            key === 5 && <><KhoVoucher /></>
                        }
                    </div>
                </div>

            </section>

            <FooterUser />
        </div>
    );
};

export default ProfileUser;