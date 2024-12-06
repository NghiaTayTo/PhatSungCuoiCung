import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderUser from "../Component/HeaderUser";
import FooterUser from "../Component/FooterUser";
import axios from "axios";
import styles from "./HomeUser.module.css";
import { useNavigate } from "react-router-dom";
import ChatFormUser from "../../chat/ChatFormUser";
import FormDep from "../../chat/ChatFormUser";

const StorePage = () => {
  const { id_cua_hang } = useParams(); // Lấy id cửa hàng từ URL
  const [storeInfo, setStoreInfo] = useState(null); // Thông tin cửa hàng
  const [products, setProducts] = useState([]); // Danh sách sản phẩm cửa hàng
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [formChat, setFormChat] = useState(false);
  const productsPerPage = 8; // Số sản phẩm trên mỗi trang
  const navigate = useNavigate();
  const handleProductClick = (id) => {
    navigate(`/ProductDetail/${id}`);
  };
  const [idUser, setIdUser] = useState(null);

  // * hiện form chat
  const handleChatOpen = () => {
    setFormChat(true);
  };
  const handleChatClose = () => {
    setFormChat(false);
  };

  // Lấy thông tin cửa hàng và danh sách sản phẩm
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        setIdUser(storedUser.id_tai_khoan);
        // Lấy thông tin cửa hàng
        const storeResponse = await axios.get(
          `http://localhost:8080/api/v1/cuahang/info/${id_cua_hang}`
        );
        setStoreInfo(storeResponse.data);

        // Lấy danh sách sản phẩm của cửa hàng
        const productsResponse = await axios.get(
          `http://localhost:8080/api/v1/product/cuahang-${id_cua_hang}/allinfo`
        );
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu cửa hàng:", error);
      }
    };

    fetchStoreData();
  }, [id_cua_hang]);

  // Tính toán chỉ số của sản phẩm đầu tiên và cuối cùng trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Tổng số trang
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!storeInfo) return <p>Loading...</p>;

  

  return (
    <div className={styles.parent}>
      <HeaderUser />
      <div className={styles.storeHeader}>
        <div className={styles.storeInfo}>
          <img
            src={storeInfo.anh_dai_dien}
            alt={`Ảnh đại diện của ${storeInfo.ten_cua_hang}`}
            className={styles.storeAvatar}
          />
          <div style={{ fontSize: '16px', fontWeight: '900' }}>
            <h1 className={styles.storeName}>{storeInfo.ten_cua_hang}</h1>
            <p>Tham gia: {storeInfo.ngay_tao || "01/01/2024"}</p>
            <p>Địa chỉ: {storeInfo.dia_chi_cua_hang}</p>
            <button onClick={handleChatOpen}>nhắn tin với cửa hàng</button>
          </div>
        </div>
      </div>

      {
        formChat === true && (
          <ChatFormUser storeID={id_cua_hang} userID={idUser} onClose={handleChatClose}/>
        )
      }
      {/* <ChatFormUser/> */}


      <section className={styles.section}>
        {/* Hiển thị sản phẩm dựa trên kết quả tìm kiếm hoặc danh sách gốc */}
        {currentProducts.map((product, index) => (
          <div
            className={styles.productCard}
            key={index}
            onClick={() => handleProductClick(product.ma_san_pham)}
          >
            <div className={styles.imageContainer}>
              <img
                className={styles.productImage}
                src={`/images/${product.anh_san_pham}`}
                alt={product.ten_san_pham}
              />
            </div>
            <div className={styles.productInfo}>
              <p className={styles.productName}>{product.ten_san_pham}</p>
              <p className={styles.productPrice}>{product.gia.toLocaleString()} VND</p>
            </div>
          </div>
        ))}
      </section>

      {/* Điều hướng phân trang */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ""}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      

      <FooterUser />
    </div>
  );
};

export default StorePage;
