import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { handleImageUpload } from '../../utils/Order/UploadImageFileOnCloud';

const MyInformation = () => {
    const [userData, setUserData] = useState({
        id_tai_khoan: '',    // ID tài khoản
        ho_ten: '',          // Họ và tên
        email: '',           // Email (chỉ đọc)
        so_dt: '',           // Số điện thoại
        ngay_sinh: '',       // Ngày sinh
        anh_dai_dien: '',    // Ảnh đại diện
    });
    const [selectedImage, setSelectedImage] = useState(null); // Preview ảnh mới

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const id_tai_khoan = sessionStorage.getItem('id_tai_khoan');
                const response = await axios.get(`http://localhost:8080/api/taikhoan/profile/${id_tai_khoan}`);
                setUserData(response.data.result); // Lấy dữ liệu từ backend và set vào state
                console.log(userData)
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu người dùng:", error);
            }
        };
        fetchUserData();
    }, []);

    // Xử lý khi thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    // Xử lý upload ảnh
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); // Hiển thị preview ảnh
            try {
                const uploadedImageUrl = await handleImageUpload(file); // Upload ảnh lên Cloudinary
                // Cập nhật ảnh đại diện vào state trước khi lưu
                setUserData((prevState) => ({
                    ...prevState,
                    anh_dai_dien: uploadedImageUrl,
                }));
                alert('Ảnh đã được tải lên thành công!');
                
            } catch (error) {
                console.error('Lỗi khi tải ảnh lên Cloudinary:', error);
                alert('Không thể tải ảnh lên, vui lòng thử lại.');
            }
        }
    };
    
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const id_tai_khoan = sessionStorage.getItem('id_tai_khoan');
            await axios.put(`http://localhost:8080/api/taikhoan/profile/${id_tai_khoan}`, userData);
            alert('Cập nhật hồ sơ thành công!');

            window.location.reload();
        } catch (error) {
            console.error('Lỗi khi cập nhật hồ sơ:', error);
            alert('Đã xảy ra lỗi khi cập nhật hồ sơ.');
        }
    };
    

    // Xử lý lưu thông tin hồ sơ
    // const handleSaveProfile = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const id_tai_khoan = sessionStorage.getItem('id_tai_khoan');
    //         const data = await axios.put(`http://localhost:8080/api/taikhoan/profile/${id_tai_khoan}`, userData);
    //         if(data){
    //         alert('Cập nhật hồ sơ thành công!');
    //         window.location.reload();
    //         }else{
    //             alert('cc')
    //         }
    //     } catch (error) {
    //         console.error('Lỗi khi cập nhật hồ sơ:', error);
    //         alert('Đã xảy ra lỗi khi cập nhật hồ sơ.');
    //     }
    // };

    return (
        <div className='d-flex'>
            <div className='profile-user'>
                <h2 className="profile-title">Hồ sơ của tôi</h2>
                <p className="profile-subtitle">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                <form className="profile-form" onSubmit={handleSaveProfile}>
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
                <img
                    src={selectedImage || userData.anh_dai_dien || '/images/default-avatar.jpg'}
                    alt="Avatar"
                    className="profile-avatar"
                />
                <div>
                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={handleImageChange}
                        className="upload-button"
                    />
                </div>
                <p>Định dạng: .JPEG, .PNG, .JPG</p>
            </div>
        </div>
    );
};

export default MyInformation;
