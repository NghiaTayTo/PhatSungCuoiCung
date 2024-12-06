import React, { useState } from 'react';
import styles from '../Home/HomeUser.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderUser from '../Component/HeaderUser';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import FooterUser from '../Component/FooterUser';
import './Register.css';

const Register = () => {
    const [code, setCode] = useState(''); // Mã OTP người dùng nhập
    const [generatedCode, setGeneratedCode] = useState(''); // Mã OTP được gửi từ server
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [userInfo, setUserInfo] = useState({
        hoTen: '',
        email: '',
        matKhau: '',
        confirmMatKhau: '',
    });
    const navigate = useNavigate();

    // Xử lý nhập liệu
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value,
        });
    };

    // Gửi mã OTP qua email
    const handleSendCode = async () => {
        if (!userInfo.email) {
            setErrorMessage('Vui lòng nhập email trước khi gửi mã!');
            return;
        }

        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            console.log("Email gửi lên:", userInfo.email);
            const response = await axios.post('http://localhost:8080/api/send-code', {
                email: userInfo.email
            });

            if (response.status === 200) {
                setGeneratedCode(response.data.otp); // Lưu mã OTP được gửi từ server
                setSuccessMessage('Mã OTP đã được gửi qua email!');
            }
        } catch (error) {
            console.error('Lỗi khi gửi mã OTP:', error);
            setErrorMessage('Không thể gửi mã OTP. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Đăng ký tài khoản
    const handleRegister = async () => {
        if (!code) {
            setErrorMessage('Vui lòng nhập mã OTP!');
            return;
        }
        if (userInfo.matKhau !== userInfo.confirmMatKhau) {
            setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/taikhoan/register', {
                ho_ten: userInfo.hoTen,
                email: userInfo.email,
                mat_khau: userInfo.matKhau,
                otp: code,
                vai_tro: { ma_vai_tro: 1 }, // Người dùng thông thường
                trang_thai_tk: 0, // Chờ kích hoạt
            });

            if (response.data.message === 'Đăng ký tài khoản thành công') {
                alert('Đăng ký thành công!');
                navigate('/login');
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Đăng ký thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className={styles.parent}>
            <HeaderUser />
            <section>
                <div className="register-container">
                    <h2 className="register-title">Đăng ký</h2>
                    <form
                        className="register-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRegister();
                        }}
                    >
                        <input
                            type="text"
                            name="hoTen"
                            placeholder="Họ và tên"
                            className="register-input"
                            value={userInfo.hoTen}
                            onChange={handleInputChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="register-input"
                            value={userInfo.email}
                            onChange={handleInputChange}
                        />
                        <div className="input-code-container">
                            <input
                                type="text"
                                placeholder="Nhập mã OTP"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="register-input otp-input"
                                disabled={loading}
                            />
                            <button
                                onClick={handleSendCode}
                                className="send-code-button"
                                disabled={loading}
                                style={{width: '200px'}}
                            >
                                {loading ? 'Đang gửi...' : 'Gửi mã'}
                            </button>
                        </div>
                        <input
                            type="password"
                            name="matKhau"
                            placeholder="Mật khẩu"
                            className="register-input"
                            value={userInfo.matKhau}
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            name="confirmMatKhau"
                            placeholder="Nhập lại mật khẩu"
                            className="register-input"
                            value={userInfo.confirmMatKhau}
                            onChange={handleInputChange}
                        />

                        {successMessage && <p className="success-message">{successMessage}</p>}
                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        <button type="submit" className="register-button">
                            Đăng ký
                        </button>
                    </form>

                    <div className="register-or">
                        <span>hoặc</span>
                    </div>
                    <div className="register-social">
                        <button className="social-button facebook-button">
                            <FaFacebook style={{ marginRight: '8px' }} /> Facebook
                        </button>
                        <button
                            className="social-button google-button"
                            onClick={() =>
                            (window.location.href =
                                'http://localhost:8080/oauth2/authorization/google')
                            }
                        >
                            <FaGoogle style={{ marginRight: '8px' }} /> Đăng nhập bằng Google
                        </button>
                    </div>
                    <div className="register-login-link">
                        Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link>
                    </div>
                </div>
            </section>
            <FooterUser />
        </div>
    );
};

export default Register;
