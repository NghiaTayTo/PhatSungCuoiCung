import React, { useEffect, useState } from "react";
import "./Header.css";
// import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faBell, faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faBan, faXmark } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

import { getCuaHangById } from "../utils/API/StoreAPI";

const Header = () => {
  const [store, setStore] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const store = await getCuaHangById();
        setStore(store);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <header className="headerStyle">
      <div className="logoStyle">
        <Link to="/seller">
          <img className="logo" src="/images/logoBooker.svg" alt="Booker.vn" />
        </Link>
      </div>
      <div className="accountStyle" >
        <FontAwesomeIcon
          className="custom-icon"
          icon={faBell}
        ></FontAwesomeIcon>

        <div className="thongbao" style={{display:'none'}}>
          <div className="thongbao-header">
            <h2>Thông báo</h2>
          </div>
          <div className="thongbao-item">
            <img className="thongbao-item-img" src="/images/logoBooker.png" />
            <p>
              <strong>Thông báo:</strong> chúng tôi đã xem xét và đánh giá mức
              độ vi phạm của người dùng: <strong>nghiadubay0230</strong>. Booker
              cảm ơn bạn đã báo cáo, chúng tôi rất cần những đóng góp của bạn để
              giúp môi trường mua sắm trở nên tốt đẹp và văn minh hơn.
            </p>
            <FontAwesomeIcon
              className="custom-icon-hidden"
              icon={faXmark}
            ></FontAwesomeIcon>
          </div>
          <div className="thongbao-item thongbao-ok">
            <img className="thongbao-item-img" src="/images/logoBooker.png" />
            <p>
              <strong>Thông báo:</strong> chúng tôi đã xem xét và đánh giá mức
              độ vi phạm của người dùng: <strong>nghiadubay0230</strong>. Booker
              cảm ơn bạn đã báo cáo, chúng tôi rất cần những đóng góp của bạn để
              giúp môi trường mua sắm trở nên tốt đẹp và văn minh hơn.
            </p>
            <img className="anh-san-pham" src="/images/25.jpg" />
            <FontAwesomeIcon
              className="custom-icon-check"
              icon={faCircleCheck}
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              className="custom-icon-hidden"
              icon={faXmark}
            ></FontAwesomeIcon>
          </div>
          <div className="thongbao-item">
            <img className="thongbao-item-img" src="/images/logoBooker.png" />
            <p>
              <strong>Thông báo:</strong> chúng tôi đã xem xét và đánh giá mức
              độ vi phạm của người dùng: <strong>nghiadubay0230</strong>. Booker
              cảm ơn bạn đã báo cáo, chúng tôi rất cần những đóng góp của bạn để
              giúp môi trường mua sắm trở nên tốt đẹp và văn minh hơn.
            </p>
            <FontAwesomeIcon
              className="custom-icon-hidden"
              icon={faXmark}
            ></FontAwesomeIcon>
          </div>
          <div className="thongbao-item thongbao-no">
            <img className="thongbao-item-img" src="/images/logoBooker.png" />
            <p>
              <strong>Thông báo:</strong> chúng tôi đã xem xét và đánh giá mức
              độ vi phạm của người dùng: <strong>nghiadubay0230</strong>. Booker
              cảm ơn bạn đã báo cáo, chúng tôi rất cần những đóng góp của bạn để
              giúp môi trường mua sắm trở nên tốt đẹp và văn minh hơn.
            </p>
            <img className="anh-san-pham" src="/images/21.jpg" />
            <FontAwesomeIcon
              className="custom-icon-ban"
              icon={faBan}
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              className="custom-icon-hidden"
              icon={faXmark}
            ></FontAwesomeIcon>
          </div>
          <div className="thongbao-item">
            <img className="thongbao-item-img" src="/images/logoBooker.png" />
            <p>
              <strong>Thông báo:</strong> chúng tôi đã xem xét và đánh giá mức
              độ vi phạm của người dùng: <strong>nghiadubay0230</strong>. Booker
              cảm ơn bạn đã báo cáo, chúng tôi rất cần những đóng góp của bạn để
              giúp môi trường mua sắm trở nên tốt đẹp và văn minh hơn.
            </p>
            <FontAwesomeIcon
              className="custom-icon-hidden"
              icon={faXmark}
            ></FontAwesomeIcon>
          </div>
          <div className="thongbao-item">
            <img className="thongbao-item-img" src="/images/logoBooker.png" />
            <p>
              <strong>Thông báo:</strong> chúng tôi đã xem xét và đánh giá mức
              độ vi phạm của người dùng: <strong>nghiadubay0230</strong>. Booker
              cảm ơn bạn đã báo cáo, chúng tôi rất cần những đóng góp của bạn để
              giúp môi trường mua sắm trở nên tốt đẹp và văn minh hơn.
            </p>
            <FontAwesomeIcon
              className="custom-icon-hidden"
              icon={faXmark}
            ></FontAwesomeIcon>
          </div>
        </div>
        <div className="accountStyle-details">
          <img src="/images/avt_default.png" />
          <div style={{ marginTop: "10px" }}>
            <h3>{store.tai_khoan?.ho_ten}</h3>
            <p>Nhà bán</p>
          </div>

          <div className="accountStyle-details_hover_ok">
            <Link to="/booker.vn/profile">
              <li>Tài khoản</li>
            </Link>
            <Link to="/HomeUserIndex">
              <li>Tiếp tục mua hàng</li>
            </Link>
            <Link to="/booker.vn/close-store">
              <li>Hủy cửa hàng</li>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
