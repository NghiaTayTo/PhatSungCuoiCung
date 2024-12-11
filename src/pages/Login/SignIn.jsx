import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import HeaderUser from '../Component/HeaderUser';
import FooterUser from '../Component/FooterUser';
import styles from '../Home/HomeUser.module.css';
import './SignIn.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous error messages

        try {
            const response = await axios.post("http://localhost:8080/api/taikhoan/login", {
                email,
                mat_khau: matKhau
            });

            if (response.data.message === "Đăng nhập thành công") {
                // Lưu thông tin người dùng vào localStorage nếu cần
                sessionStorage.setItem('user', JSON.stringify(response.data.result));
                sessionStorage.setItem('id_tai_khoan', response.data.result.id_tai_khoan);

                console.log(response.data.result.vai_tro.ma_vai_tro)

                // Chuyển hướng đến trang /HomeUser sau khi đăng nhập thành công
                navigate("/HomeUserIndex");
                if (response.data.result.vai_tro.ma_vai_tro == 3) {
                    navigate('/admin');
                }
            } else {
                setError(response.data.message || "Đăng nhập thất bại");
            }

        } catch (err) {
            setError("Có lỗi xảy ra khi đăng nhập");
            console.error("Lỗi đăng nhập:", err);
        }
    };

    return (
        <div >
            {/* <HeaderUser /> */}

            <section className="bgSignin">
                <div className="boxCenter">
                    <div className="login-container">
                        <h2 className="login-title">Đăng nhập</h2>
                        <form className="login-form" onSubmit={handleLogin}>
                            <input
                                type="email"
                                placeholder="Email"
                                className="login-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                className="login-input"
                                value={matKhau}
                                onChange={(e) => setMatKhau(e.target.value)}
                            />
                            <button type="submit" className="login-button">Đăng nhập</button>
                        </form>

                        {error && <div className="error-message">{error}</div>}

                        <div className="forgot-password">
                            <Link to="/forgot-password">Quên mật khẩu</Link>
                        </div>
                        <div className="login-register-link">
                            Chưa có tài khoản? <Link to="/register">Đăng ký tại đây</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* <FooterUser /> */}
        </div>
    );
};

export default Login;