import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderUser from "../Component/HeaderUser";
import FooterUser from "../Component/FooterUser";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import axios from "axios";
import styles from "./HomeUser.module.css";
import stylesIndex from "./HomeUserIndex.module.css";
import { useNavigate } from "react-router-dom";
import ChatFormUser from "../../chat/ChatFormUser";
import { faAngleRight, faArrowAltCircleRight, faBook, faFireFlameCurved, faHeart, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import FormDep from "../../chat/ChatFormUser";
import Loading from "../../utils/Order/Loading";


const StorePage = () => {
  const { id_cua_hang } = useParams(); // Lấy id cửa hàng từ URL
  const [storeInfo, setStoreInfo] = useState(null); // Thông tin cửa hàng
  const [products, setProducts] = useState([]); // Danh sách sản phẩm cửa hàng
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [formChat, setFormChat] = useState(false);
  const productsPerPage = 20; // Số sản phẩm trên mỗi trang
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

  const [quantity, setQuantity] = useState(1);

  //* Hàm thêm vào giỏ hàng
  const addToCart = (product) => {
    const user = JSON.parse(sessionStorage.getItem('user')); // Lấy thông tin người dùng từ session
    if (!user) {
      // NotificationManager.warning('Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng!', 'Cảnh báo');
      alert('Vui lòng đăng nhập trước khi thêm vào giỏ hàng');
      navigate("/login");
      return;
    }

    const cartKey = `cart_${user.id_tai_khoan}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingProduct = cart.find((item) => item.ma_san_pham === product.ma_san_pham);
    if (existingProduct) {
      existingProduct.so_luong += quantity;
    } else {
      cart.push({ ...product, so_luong: quantity });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    alert("Sản phẩm đã được thêm vào giỏ hàng");
    window.location.reload();

  };

  //* Hàm "Mua ngay"
  const buyNow = (product) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
      alert("Vui lòng đăng nhập để mua sản phẩm");
      navigate("/login");
      return;
    }

    sessionStorage.setItem('checkoutItem', JSON.stringify({ ...product, so_luong: quantity }));
    navigate("/checkout");
  };

  if (!storeInfo) return <Loading />;

  return (
    <div className={styles.parent}>
      <HeaderUser />
      <div className={styles.storeHeader}>
        <div className={styles.bia_overlay}>
          <img className={styles.bgShop} src={storeInfo.anh_bia} alt="" />
          <div className={styles.overlay}></div>
        </div>
        <div className={styles.storeInfo}>
          <img
            src={storeInfo.anh_dai_dien}
            alt={`Ảnh đại diện của ${storeInfo.ten_cua_hang}`}
            className={styles.storeAvatar}
          />
          <div style={{ fontSize: '16px', fontWeight: '900' }} className={styles.info}>
            <h1 className={styles.storeName}>{storeInfo.ten_cua_hang}</h1>
            <p>Tham gia: {storeInfo.ngay_tao || "01/01/2024"}</p>
            <p>Địa chỉ: {storeInfo.dia_chi_cua_hang}</p>
            <button onClick={handleChatOpen}><FontAwesomeIcon icon={faMessage} /> Chat ngay</button>
          </div>
        </div>
      </div>

      {
        formChat === true && (
          <ChatFormUser storeID={id_cua_hang} userID={idUser} onClose={handleChatClose} />
        )
      }
      {/* <ChatFormUser/> */}


      <section className={styles.storeProductList}>
        {/* Hiển thị sản phẩm dựa trên kết quả tìm kiếm hoặc danh sách gốc */}
        {currentProducts.map((product, index) => (
          <div
            onClick={() => handleProductClick(product.ma_san_pham)}
            key={index} className={stylesIndex.listBookBannerProductItem}>
            <img src={product.anh_san_pham}
              alt={product.ten_san_pham} />
            <p className={stylesIndex.productName}>{product.ten_san_pham}</p>
            <div className={stylesIndex.price}>
              <p className={stylesIndex.productPrice}>
                {product.gia ? product.gia.toLocaleString('vi-VN') : 0}đ
              </p>
              <div className={stylesIndex.listCategoryHayItemSol}>
                <img src='./images/solana.png' alt='solana icon' />
                <p>{product.gia_sol || 0} SOL</p>
              </div>
            </div>

            <div className={stylesIndex.formHover}>
              <div className={stylesIndex.formHoverInfo}>
                <h5>{product.ten_san_pham}</h5>
                <p className={stylesIndex.tg}>{product.tac_gia}</p>
                <p className={stylesIndex.mt}>{product.mo_ta}</p>
                <div className={stylesIndex.positionOk}>
                  <span>Xem thêm</span>
                  <div className={stylesIndex.money}>
                    <p className={stylesIndex.productPrice}>
                      {product.gia ? product.gia.toLocaleString('vi-VN') : 0}đ
                    </p>
                    <div className={stylesIndex.listCategoryHayItemSol}>
                      <img src='/images/solana.png' alt='solana icon' />
                      <p>{product.gia_sol || 0} SOL</p>
                    </div>
                  </div>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      addToCart(product);
                    }}
                    className={stylesIndex.addCart}
                  >
                    THÊM VÀO GIỎ HÀNG
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      buyNow(product);
                    }}
                    className={stylesIndex.muangay}>MUA NGAY
                  </button>
                </div>
              </div>
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
