import React, { useEffect, useState } from 'react';
import styles from './wallet.module.css';
import axios from 'axios';
import logo from '../Home/logoBooker.png';

const RechargeForm = ({ onClose }) => {
    const [inputAmount, setInputAmount] = useState('');
    const [displayAmount, setDisplayAmount] = useState(0);
    const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [user, setUser] = useState(null);
    const [walletId, setWalletId] = useState(null);
    const [errorMessage, setErrorMessage] = useState(''); // Trạng thái lưu thông báo lỗi

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchWalletId(storedUser.id_tai_khoan);
        }
    }, []);

    const fetchWalletId = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/get-vi/${userId}`);
            setWalletId(response.data.id_vi);
        } catch (error) {
            console.error('Lỗi khi lấy id ví:', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, ''); // Chỉ giữ lại số
        setInputAmount(numericValue);
        setDisplayAmount(Number(numericValue));
        setImgSrc(`https://apiqr.web2m.com/api/generate/ACB/12897891/LE%20CHAU%20KIET?amount=${numericValue}&memo=${walletId}&is_mask=0&bg=0`);
    };

    const showForm =async () =>{
         // Kiểm tra nếu số tiền chưa nhập hoặc nhỏ hơn 10.000 đ
        if (displayAmount <= 0) {
            setErrorMessage('Vui lòng nhập số tiền nạp.');
            return;
        } else if (displayAmount < 10000) {
            setErrorMessage('Số tiền nạp phải từ 10.000 đ.');
            return;
        }
        setIsInvoiceVisible(true);
    }

    const handleCreateInvoice = async () => {
        // Kiểm tra nếu số tiền chưa nhập hoặc nhỏ hơn 10.000 đ
        if (displayAmount <= 0) {
            setErrorMessage('Vui lòng nhập số tiền nạp.');
            return;
        } else if (displayAmount < 10000) {
            setErrorMessage('Số tiền nạp phải từ 10.000 đ.');
            return;
        }


        setInputAmount('');
        setDisplayAmount(0);
        setErrorMessage(''); // Xóa thông báo lỗi nếu số tiền hợp lệ

        try {
            const storedUser = JSON.parse(sessionStorage.getItem('user'));
            const userId = storedUser?.id_tai_khoan;
            if (userId) {
                const response = await axios.get(`http://localhost:8080/api/v1/get-thanhtoan/${walletId}`);
                if (response.status === 200) {
                    console.log('Giao dịch đã được lưu thành công:', response.data);
                } else {
                    console.error('Lỗi khi lưu giao dịch:', response.statusText);
                }
            } else {
                console.error('Không tìm thấy ID người dùng trong sessionStorage');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API lưu giao dịch:', error);
        }
    };

    const handleCloseInvoice = () => {
        setIsInvoiceVisible(false);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.modal}>
                <div className={styles.modal1}>
                    <div className={styles.modalHeader}>
                        <h3>Nhập số tiền cần nạp</h3>
                        <button onClick={onClose} className={styles.closeButton}>X</button> {/* Nút đóng form */}
                    </div>
                    <div className={styles.modalContent}>
                        <input
                            type="text"
                            value={inputAmount}
                            onChange={handleInputChange}
                            placeholder="Nhập số tiền cần nạp"
                            className={styles.inputAmount}
                        />
                        {errorMessage && (
                            <div className={styles.errorMessage}>
                                {errorMessage} {/* Hiển thị thông báo lỗi nếu có */}
                            </div>
                        )}
                        <div className={styles.amountInfo}>
                            <div className={styles.amountLabel}>
                                <span>Số tiền cần thanh toán</span>
                                <span style={{ color: 'blue' }}>
                                    {displayAmount.toLocaleString()} đ
                                </span>
                            </div>
                            <div className={styles.amountLabel}>
                                <span>Số tiền nhận được</span>
                                <span style={{ color: 'red' }}>
                                    {displayAmount.toLocaleString()} đ
                                </span>
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelButton} onClick={onClose}>Đóng</button> {/* Nút đóng form */}
                            <button
                                className={styles.confirmButton}
                                onClick={showForm}
                            >
                                Tạo hóa đơn
                            </button> {/* Nút tạo hóa đơn */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lớp phủ (Overlay) cho hóa đơn */}
            {isInvoiceVisible && (

                <div className={styles.invoiceOverlay} onClick={handleCloseInvoice}>

                    <div className={styles.invoiceImageContainer} onClick={(e) => e.stopPropagation()}>
                        
                            <div className={styles.content}>
                                <div className={styles.info}>
                                    <img src={logo} alt="Logo" />
                                    <hr />
                                    <div>
                                        <i className="fa-solid fa-building-columns"></i> Ngân hàng:
                                    </div>
                                    <span className={styles.bank} type="text">ACB</span>
                                    <hr />
                                    <div>
                                        <i className="fa-solid fa-credit-card"></i> Số tài khoản:
                                        
                                    </div>
                                    <span style={{ color: 'rgb(255, 204, 0)' }}>12897891</span>
                                    <hr />
                                    <div>
                                        <i className="fa-solid fa-user"></i> Chủ tài khoản:
                                    </div>
                                    <span>Lê Châu Kiệt</span>
                                    <hr />
                                    <div>
                                        <i className="fa-solid fa-money-bill"></i> Số tiền thanh toán:
                                    </div>
                                    <span style={{ color: 'rgb(134, 236, 50)' }}>{displayAmount.toLocaleString('vi-VN') || 0} VND</span>
                                    <hr />
                                    <div>
                                        <i className="fa-solid fa-message"></i> Nội dung chuyển khoản:
                                    </div>
                                    <span style={{ color: 'rgb(0, 251, 255)' }}>{walletId}</span>
                                </div>
                                <div className={styles.qrCode}>
                                    <h3>QUÉT MÃ QR ĐỂ THANH TOÁN</h3>
                                    <img src={imgSrc} alt="Hóa đơn QR" />
                                    <div className={styles.footer}>
                                        Vui lòng xem kỹ nội dung trước khi chuyển khoản
                                    </div>
                                </div>
                            </div>
                    
                       

                    </div>
                </div>
            )}
        </div>
    );
};

export default RechargeForm;
