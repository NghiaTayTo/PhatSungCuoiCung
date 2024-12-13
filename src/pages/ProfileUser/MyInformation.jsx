import axios from 'axios';
import React, { useEffect, useState } from 'react';

const MyInformation = () => {

    const [userData, setUserData] = useState({
        id_tai_khoan: '',    // ID tài khoản
        ho_ten: '',          // Họ và tên
        email: '',           // Email (chỉ đọc)
        so_dt: '',           // Số điện thoại
        ngay_sinh: '',       // Ngày sinh
    });
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const id_tai_khoan = sessionStorage.getItem('id_tai_khoan'); // Lấy ID tài khoản từ session storage
                const response = await axios.get(`http://localhost:8080/api/taikhoan/profile/${id_tai_khoan}`);
                setUserData(response.data.result); // Lưu dữ liệu người dùng vào state
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu người dùng:", error);
            }
        };
        fetchUserData();
    }, []);

    // Hàm xử lý thay đổi dữ liệu trong form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    // Hàm xử lý thay đổi ảnh đại diện
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    // Hàm xử lý cập nhật hồ sơ
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const id_tai_khoan = sessionStorage.getItem('id_tai_khoan'); // Lấy ID tài khoản từ session storage
            await axios.put(`http://localhost:8080/api/taikhoan/profile/${id_tai_khoan}`, userData);
            alert("Cập nhật hồ sơ thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật hồ sơ:", error);
            alert("Đã xảy ra lỗi khi cập nhật hồ sơ.");
        }
    };

    return (
        <div className='d-flex'>
            <div className='profile-user'>
                <h2 className="profile-title">Hồ sơ của tôi</h2>
                <p className="profile-subtitle">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                <form className="profile-form" onSubmit={handleSaveProfile}>
                    <div className="profile-form-group">

                    </div>
                    <div className="profile-form-group">
                        <label>Họ và tên</label>
                        <input
                            type="text"
                            name="ho_ten"
                            value={userData.ho_ten}
                            onChange={handleInputChange}
                            className="profile-input"
                        />
                    </div>
                    <div className="profile-form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            readOnly
                            className="profile-input"
                        />
                    </div>
                    <div className="profile-form-group">
                        <label>Số điện thoại</label>
                        <input
                            type="text"
                            name="so_dt"
                            value={userData.so_dt}
                            onChange={handleInputChange}
                            className="profile-input"
                        />
                    </div>
                    <div className="profile-form-group">
                        <label>Ngày sinh</label>
                        <input
                            type="date"
                            name="ngay_sinh"
                            value={userData.ngay_sinh}
                            onChange={handleInputChange}
                            className="profile-input"
                        />
                    </div>
                    <button type="submit" className="save-button">Lưu</button>
                </form>
            </div>
            <div className='profile-user-img'>
                <img src='/images/avtadmin.jpg' />
                <div>
                    <button>Chọn Ảnh</button>
                </div>
                <p>Định dạng: .JPEG, .PNG, .JPG</p>
            </div>
        </div>
    );
};

export default MyInformation;