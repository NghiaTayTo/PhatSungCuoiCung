// RatingForm.jsx
import axios from "axios";
import React, { useState } from "react";
import styles from "./RatingForm.module.css"; // Tạo file CSS để styling
import { NotificationContainer, NotificationManager } from 'react-notifications';


const RatingForm = ({ onClose, userId, orderDetailId, productId }) => {
    const [rating, setRating] = useState(0);
    const [reviewContent, setReviewContent] = useState("");

    // Xử lý khi click vào từng ngôi sao
    const handleStarClick = (value) => {
        setRating(value);
    };


    const handleSubmitReview = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/danhgia/gui-danh-gia', {
                diem_danh_gia: rating,
                noi_dung_danh_gia: reviewContent,
                tai_khoan_danh_gia: { id_tai_khoan: userId }, // Gửi đối tượng chứa ID
                san_pham: { ma_san_pham: productId },        // Gửi đối tượng chứa ID
                don_hang_chi_tiet: { ma_don_hang_chi_tiet: orderDetailId }, // Gửi đối tượng chứa ID
            });


            if (response.status === 200) {
                NotificationManager.success('Gửi đánh giá thành công', '');
            }
        } catch (error) {
            console.error('Lỗi khi gửi đánh giá:', error.response.data);
            NotificationManager.error('Gửi đánh giá thất bại', '');
        }
        onClose();

    };

    return (
        <div className={styles.overlay}>
            <div className={styles.formContainer}>
                <h2>Đánh giá sản phẩm</h2>
                <div className={styles.starContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`${styles.star} ${rating >= star ? styles.active : ""}`}
                            onClick={() => handleStarClick(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <textarea
                    className={styles.textarea}
                    placeholder="Nhập nội dung đánh giá của bạn..."
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                />
                <div className={styles.buttonContainer}>
                    <button className={styles.submitButton} onClick={handleSubmitReview}>
                        Xong
                    </button>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Hủy
                    </button>
                </div>
            </div>

            <NotificationContainer />

        </div>
    );
};

export default RatingForm;
