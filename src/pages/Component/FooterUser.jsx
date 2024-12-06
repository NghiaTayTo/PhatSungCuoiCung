import styles from '../Home/HomeUser.module.css'


const FooterUser = () =>{



    return (
        <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <div className={styles.footerColumn}>
                        <h4>HỖ TRỢ KHÁCH HÀNG</h4>
                        <ul>
                            <li>Sản phẩm & Đơn hàng: 0933 109 009</li>
                            <li>Kỹ thuật & Bảo hành: 0989 439 986</li>
                            <li>Điện thoại: (028) 3820 7153 (giờ hành chính)</li>
                            <li>Email: info@bookbuy.vn</li>
                            <li>Địa chỉ: 9 Lý Văn Phức, Tân Định, Q1, TP.HCM</li>
                            <li>Sơ đồ đường đi</li>
                        </ul>
                    </div>
                    <div className={styles.footerColumn}>
                        <h4>TRỢ GIÚP</h4>
                        <ul>
                            <li>Hướng dẫn mua hàng</li>
                            <li>Phương thức thanh toán</li>
                            <li>Phương thức vận chuyển</li>
                            <li>Chính sách đổi - trả</li>
                            <li>Chính sách bảo hành</li>
                            <li>Câu hỏi thường gặp (FAQs)</li>
                        </ul>
                    </div>
                    <div className={styles.footerColumn}>
                        <h4>TÀI KHOẢN CỦA BẠN</h4>
                        <ul>
                            <li>Cập nhật tài khoản</li>
                            <li>Giỏ hàng</li>
                            <li>Lịch sử giao dịch</li>
                            <li>Sản phẩm yêu thích</li>
                            <li>Kiểm tra đơn hàng</li>
                        </ul>
                    </div>
                    <div className={styles.footerColumn}>
                        <h4>BOOKER</h4>
                        <ul>
                            <li>Giới thiệu bookbuy.vn</li>
                            <li>BookBuy trên Facebook</li>
                            <li>Liên hệ BookBuy</li>
                            <li>Đặt hàng theo yêu cầu</li>
                            <li>Tích lũy BBxu</li>
                            <li>iBookStop.vn</li>
                        </ul>
                    </div>
                </div>
            </footer>
    )
}
export default FooterUser