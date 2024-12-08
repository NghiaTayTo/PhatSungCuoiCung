import React, { useState } from 'react';


const ProductFormSlider = () => {
  // Dữ liệu sản phẩm
  const currentProducts = [
    {
      ma_san_pham: 1,
      ten_san_pham: "Sản phẩm 1",
      tac_gia: "Tác giả 1",
      gia: 100000,
      mo_ta: "Mô tả sản phẩm 1",
      anh_san_pham: "https://via.placeholder.com/150",
    },
    {
      ma_san_pham: 2,
      ten_san_pham: "Sản phẩm 2",
      tac_gia: "Tác giả 2",
      gia: 200000,
      mo_ta: "Mô tả sản phẩm 2",
      anh_san_pham: "https://via.placeholder.com/150",
    },
    {
      ma_san_pham: 3,
      ten_san_pham: "Sản phẩm 3",
      tac_gia: "Tác giả 3",
      gia: 300000,
      mo_ta: "Mô tả sản phẩm 3",
      anh_san_pham: "https://via.placeholder.com/150",
    },
  ];

  // Trạng thái index của sản phẩm hiện tại
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hàm điều hướng đến sản phẩm tiếp theo
  const nextProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentProducts.length);
  };

  // Hàm điều hướng đến sản phẩm trước đó
  const prevProduct = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? currentProducts.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className='container'>
      {/* Form với sản phẩm hiện tại */}
      <div className='productForm'>
        <div className='productImageContainer'>
          <img
            src={currentProducts[currentIndex].anh_san_pham}
            alt={currentProducts[currentIndex].ten_san_pham}
            className='productImage'
          />
        </div>
        <div className='productDetails'>
          <h3>{currentProducts[currentIndex].ten_san_pham}</h3>
          <p>{currentProducts[currentIndex].tac_gia}</p>
          <p>{currentProducts[currentIndex].mo_ta}</p>
          <p><strong>Giá:</strong> {currentProducts[currentIndex].gia.toLocaleString('vi-VN')} đ</p>
          <button className='addToCartBtn'>Thêm vào giỏ hàng</button>
          <button className='buyNowBtn'>Mua ngay</button>
        </div>
      </div>

      {/* Các nút điều hướng */}
      <div className='navigation'>
        <button className='prevBtn' onClick={prevProduct}>Trước</button>
        <button className='nextBtn' onClick={nextProduct}>Sau</button>
      </div>
    </div>
  );
};

export default ProductFormSlider;
