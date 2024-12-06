import React, { useEffect, useState } from 'react';
import styles from './wallet.module.css';
import HeaderUser from '../Component/HeaderUser';
import FooterUser from '../Component/FooterUser';
import axios from 'axios';

const RechargeForm = () => {
    const [inputAmount, setInputAmount] = useState('');
    const [displayAmount, setDisplayAmount] = useState(0);
    const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);
    const [imgSrc, setImgSrc] = useState('');

    const [user, setUser] = useState(null);
    const [walletId, setWalletId] = useState(null); // Trạng thái lưu trữ id_vi

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchWalletId(storedUser.id_tai_khoan); // Gọi hàm lấy id ví
        }
    }, []);

    const fetchWalletId = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/get-vi/${userId}`);
            console.log(response.data);
            setWalletId(response.data.id_vi); // Lưu id_vi vào trạng thái
        } catch (error) {
            console.error("Lỗi khi lấy id ví:", error);
        }
    };


    // Hàm xử lý thay đổi giá trị khi người dùng nhập
    const handleInputChange = (e) => {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, ''); // Loại bỏ các ký tự không phải số
        setInputAmount(numericValue);

        // Cập nhật giá trị số tiền hiển thị
        setDisplayAmount(Number(numericValue));

        // Cập nhật URL hình ảnh mã QR
        setImgSrc(`https://apiqr.web2m.com/api/generate/ACB/12897891/LE%20CHAU%20KIET?amount=${numericValue}&memo=${walletId}&is_mask=0&bg=0`);
    };

    const handleCreateInvoice = async () => {
        setIsInvoiceVisible(true);
        setInputAmount('')
        setDisplayAmount(0)
        try {
            // Lấy id ví từ trạng thái
            const storedUser = JSON.parse(sessionStorage.getItem('user'));
            const userId = storedUser?.id_tai_khoan;

            if (userId) {
                // Gọi API để lưu giao dịch chuyển khoản vào cơ sở dữ liệu
                const response = await axios.get(`http://localhost:8080/api/v1/get-thanhtoan/${walletId}`);

                if (response.status === 200) {
                    console.log("Giao dịch đã được lưu thành công:", response.data);

                    // Hiển thị hình ảnh hóa đơn
                    setIsInvoiceVisible(true);
                } else {
                    console.error("Lỗi khi lưu giao dịch:", response.statusText);
                }
            } else {
                console.error("Không tìm thấy ID người dùng trong sessionStorage");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API lưu giao dịch:", error);
        }

    };

    const handleCloseInvoice = () => {
        // Ẩn hình ảnh hóa đơn khi nhấp ra ngoài
        setIsInvoiceVisible(false);
    };

    return (
        <div className={styles.modal}>
            <HeaderUser />
            <div className={styles.modal1}>
                <div className={styles.modalHeader}>
                    <h3>Nhập số tiền cần nạp</h3>
                    <button className={styles.closeButton}>X</button>
                </div>
                <div className={styles.modalContent}>
                    <input
                        type="text"
                        value={inputAmount}
                        onChange={handleInputChange}
                        placeholder="Nhập số tiền cần nạp"
                        className={styles.inputAmount}
                    />
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
                        <button className={styles.cancelButton}>Đóng</button>
                        <button className={styles.confirmButton} onClick={handleCreateInvoice}>Tạo hóa đơn</button>
                    </div>
                </div>
            </div>

            {/* Hình ảnh hóa đơn */}
            {isInvoiceVisible && (
                <div className={styles.invoiceOverlay} onClick={handleCloseInvoice}>
                    <div className={styles.invoiceImageContainer} onClick={(e) => e.stopPropagation()}>
                        {/* Hiển thị mã QR dựa trên số tiền đã nhập */}
                        <img className={styles.invoiceImage} src={imgSrc} alt="Hóa đơn QR" />
                    </div>
                </div>
            )}

            <FooterUser />
        </div>
    );
};

export default RechargeForm;
