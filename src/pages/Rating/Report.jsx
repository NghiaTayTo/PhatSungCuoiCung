import React, { useState } from "react";
import axios from "axios";
import './Report.css'
import { handleImageUpload } from "../../utils/Order/UploadImageFileOnCloud";
import { NotificationContainer, NotificationManager } from 'react-notifications';


const ReportForm = ({ userId, storeId, productId, onClose }) => {
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [customViolation, setCustomViolation] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null)
  const [srcImg, setSrcImg] = useState(null)

  const violations = [
    { id: 1, ten_vi_pham: "Đánh giá thô tục phản cảm" },
    { id: 2, ten_vi_pham: "Chứa hình ảnh phản cảm, khỏa thân, khiêu dâm" },
    { id: 3, ten_vi_pham: "Đánh giá trùng lặp (thông tin rác)" },
    { id: 4, ten_vi_pham: "Chứa thông tin cá nhân" },
    { id: 5, ten_vi_pham: "Quảng cáo trái phép" },
    { id: 6, ten_vi_pham: "Đánh giá không chính xác / gây hiểu lầm" },
    { id: 7, ten_vi_pham: "Vi phạm khác" },
  ];

  const handleSubmit = async () => {
    if (!selectedViolation) {
      NotificationManager.warning('Vui lòng chọn lý do vi phạm', '');
      return;
    }
    if (!srcImg) {
      NotificationManager.warning('Vui lòng chọn hình ảnh chứng minh vi phạm', '');
      return;
    }

    try {
      let imageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResponse = await axios.post(
          "https://your-google-cloud-upload-url",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        imageUrl = uploadResponse.data.url;
      }
      const selectedViolationDetail = violations.find(
        (violation) => violation.id === selectedViolation
      );
      const ten_vi_pham = selectedViolationDetail?.ten_vi_pham || "";

      const payload = {
        vi_pham: { id_vi_pham: selectedViolation },
        noi_dung_vi_phạm: selectedViolation === 7 ? customViolation : ten_vi_pham,
        anh_minh_chung: srcImg,
        id_tai_khoan_bao_cao: { id_tai_khoan: userId },
        ma_cua_hang_bi_bao_cao: { ma_cua_hang: storeId },
        san_pham: { ma_san_pham: productId }

      };

      await axios.post("http://localhost:8080/api/baocaonguoidung/report", payload);
      NotificationManager.success('Báo cáo thành công', '');
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
      NotificationManager.error('Báo cáo thất bại. Vui lòng thử lại', '');
    }
    onClose()
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Tạo URL tạm thời để hiển thị ảnh đã chọn
    setSelectedImage(URL.createObjectURL(file));


    try {
      // Tải ảnh lên Cloudinary
      const uploadedImageUrl = await handleImageUpload(file);

      console.log("Uploaded Image URL:", uploadedImageUrl);
      setSrcImg(uploadedImageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="overlay">
      <div className="report-form-container">
        <h2 className="report-form-title">Báo cáo vi phạm</h2>
        <form
          className="report-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="report-form-section">
            <h3 className="report-form-subtitle">Chọn lý do vi phạm:</h3>
            {violations.map((violation) => (
              <div key={violation.id} className="report-form-radio">
                <label>
                  <input
                    type="radio"
                    name="violation"
                    value={violation.id}
                    checked={selectedViolation === violation.id}
                    onChange={() => setSelectedViolation(violation.id)}
                  />
                  {violation.ten_vi_pham}
                </label>
              </div>
            ))}
          </div>

          {selectedViolation === 7 && (
            <div className="report-form-custom">
              <label htmlFor="customViolation">Nội dung cụ thể:</label>
              <textarea
                id="customViolation"
                className="report-form-textarea"
                value={customViolation}
                onChange={(e) => setCustomViolation(e.target.value)}
                rows="3"
                required
              />
            </div>
          )}

          <div className="report-form-upload">
            <label style={{ fontSize: '16px' }} htmlFor="image"> Chọn hình ảnh (bắt buộc):</label>
            <input
              type="file"
              id="image"
              className="report-form-file"
              accept="image/*"
              onChange={(e) => { handleImageChange(e) }}
              required
            />
          </div>
          {srcImg && (
            <img className="imgPre" src={srcImg} alt="anhxemtruoc" />
          )}

          <div className="report-form-actions">
            <button type="submit" className="report-form-button submit-button">
              Xong
            </button>
            <button
              type="button"
              className="report-form-button cancel-button"
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
      <NotificationContainer />

    </div>
  );
};

export default ReportForm;
