import React, { useState } from 'react';
import HeaderUser from '../Component/HeaderUser';
import FooterUser from '../Component/FooterUser';
import axios from 'axios';
import styles from '../Home/HomeUser.module.css';
// import './Register.css';
import './ForgotPass.css';
import { Link, useNavigate } from 'react-router-dom';


const ChangePassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Hàm đặt thông báo
    const handleMessages = (success = '', error = '') => {
        setSuccessMessage(success);
        setErrorMessage(error);
    };

    // Gửi mã OTP
    const handleSendCode = async () => {
        if (!email) {
            handleMessages('', 'Vui lòng nhập email trước khi gửi mã!');
            return;
        }

        setLoading(true);
        handleMessages();

        try {
            // Gọi API kiểm tra email tồn tại qua URL với PathVariable (sử dụng GET)
            const checkResponse = await axios.get(`http://localhost:8080/api/taikhoan/forgotpass/${email}`);

            if (checkResponse.status === 200) {
                // Email tồn tại, gửi OTP
                const response = await axios.post('http://localhost:8080/api/send-code', { email });
                if (response.status === 200) {
                    setOtpSent(true);
                    handleMessages('Mã OTP đã được gửi đến email của bạn!');
                    console.log(email, otp, newPassword);
                } else {
                    handleMessages('', 'Lỗi khi gửi mã OTP. Vui lòng thử lại.');
                }
            } else {
                handleMessages('', 'Email không tồn tại trong hệ thống!');
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra email hoặc gửi mã OTP:', error);
            handleMessages('', 'Không thể xử lý yêu cầu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };




    // Đổi mật khẩu
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!otp || !newPassword || !confirmPassword) {
            handleMessages('', 'Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        if (newPassword !== confirmPassword) {
            handleMessages('', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }

        setLoading(true);
        handleMessages();

        try {
            const response = await axios.post(
                `http://localhost:8080/api/taikhoan/reset-password?email=${email}&otp=${otp}&newPassword=${newPassword}`
            );
            // Gọi API reset-password
            console.log(response.data.message)

            if (response.data.message) {
                handleMessages('Mật khẩu đã được đổi thành công!');
                setEmail('');
                setOtp('');
                setNewPassword('');
                setConfirmPassword('');
                setOtpSent(false);
            } else {
                handleMessages('', '123');
            }
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            handleMessages('', 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            {/* <HeaderUser /> */}
            <section className="bgSignin">
                <div className="boxCenter">
                    <div className="reset-password-container">

                        <div className="">
                            <h2 className="register-title">Đổi mật khẩu</h2>
                            <form className="register-form" onSubmit={handleChangePassword}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="register-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={otpSent}
                                />
                                <div className="input-code-container">
                                    <input
                                        type="text"
                                        placeholder="Nhập mã OTP"
                                        className="register-input otp-input"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="send-code-button"
                                        onClick={handleSendCode}
                                        disabled={loading || otpSent}
                                    >
                                        {loading ? 'Đang gửi...' : otpSent ? 'Đã gửi' : 'Gửi mã'}
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Mật khẩu mới"
                                    className="register-input"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Xác nhận mật khẩu mới"
                                    className="register-input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {successMessage && <p className="success-message">{successMessage}</p>}
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                                <button type="submit" className="register-button" disabled={loading}>
                                    {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                                </button>
                                <div className="register-login-link">
                                <Link to="/login">Đăng nhập tại đây</Link>
                        </div>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
            {/* <FooterUser /> */}
        </div>
    );
};

export default ChangePassword;