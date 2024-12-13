import React, { useState } from 'react';
import './ChangePass.css';
import HeaderUser from '../Component/HeaderUser';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FooterUser from '../Component/FooterUser';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState(''); // Thông báo kết quả

    const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
    const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu mới và nhập lại mật khẩu có khớp nhau không
        if (newPassword !== confirmPassword) {
            setMessage('Mật khẩu mới và nhập lại mật khẩu không khớp');
            return;
        }

        try {
            // Lấy `id_tai_khoan` từ thông tin người dùng trong session
            const user = JSON.parse(sessionStorage.getItem('user'));
            const idTaiKhoan = user?.id_tai_khoan;

            // Gửi yêu cầu đổi mật khẩu đến API
            const response = await axios.post(`http://localhost:8080/api/taikhoan/change-password`, null, {
                params: {
                    idTaiKhoan,
                    oldPassword,
                    newPassword,
                    confirmPassword
                }
            });

            // Kiểm tra kết quả từ API
            if (response.data.code === 200) {
                setMessage('Đổi mật khẩu thành công');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            setMessage('Đã xảy ra lỗi khi đổi mật khẩu');
        }
    };

    return (
        <div>
            <div className="change-password-page">
                <h2>Đổi mật khẩu</h2>
                <p>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
                {message && <p className="message">{message}</p>} {/* Hiển thị thông báo */}
                <form className="change-password-form" onSubmit={handleSubmit}>
                    <div className="password-field">
                        <label>Mật khẩu cũ</label>
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="input-field"
                        />
                        <span className="toggle-password" onClick={toggleShowOldPassword}>
                            <i className="fas fa-eye"></i>
                        </span>
                    </div>
                    <div className="password-field">
                        <label>Mật khẩu mới</label>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="input-field"
                        />
                        <span className="toggle-password" onClick={toggleShowNewPassword}>
                            <i className="fas fa-eye"></i>
                        </span>
                    </div>
                    <div className="password-field">
                        <label>Nhập lại mật khẩu</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field"
                        />
                        <span className="toggle-password" onClick={toggleShowConfirmPassword}>
                            <i className="fas fa-eye"></i>
                        </span>
                    </div>
                    <button type="submit" className="submit-buttonn">Xác nhận</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
