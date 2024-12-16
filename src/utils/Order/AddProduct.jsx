import React, { useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');

  // Hàm xử lý thêm sản phẩm
  const handleAddProduct = () => {
    // Giả lập một API call (thành công/thất bại)
    const isSuccess = Math.random() > 0.5; // Giả lập xác suất thành công

    if (isSuccess) {
      // Thông báo thành công
      NotificationManager.success('Thành công', '');
    } else {
      // Thông báo thất bại
      NotificationManager.warning('Đã xảy ra lỗi khi thêm sản phẩm!', 'Thất bại');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h3>Thêm Sản Phẩm</h3>
      <div>
        <label>Tên sản phẩm:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
      </div>
      <div>
        <label>Giá:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
      </div>
      <button
        onClick={handleAddProduct}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Thêm Sản Phẩm
      </button>

      {/* NotificationContainer để hiển thị thông báo */}
      <NotificationContainer />
    </div>
  );
};

export default AddProduct;
