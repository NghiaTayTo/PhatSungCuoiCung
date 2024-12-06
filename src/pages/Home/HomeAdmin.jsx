import React, { useEffect, useState } from 'react';

import './Home.css';
import TickPlacementBars from '../../chart/TickPlacement';
import ApexChart from '../../chart/ApexChart';
import BoxThongKeBlack from '../Admin/Order/BoxThongKeBlack';
import BoxThongKeBlue from '../Admin/Order/BoxThongKeBlue';
import { getAllDonHang } from '../../utils/API/OrderAPI';
import { getCustomerNumber } from '../../utils/API/CustomerAPI';
import { getAllProducts } from '../../utils/API/ProductAPI';
import { getAllStoreAdmin } from '../../utils/API/StoreAPI';

const HomeAdmin = () => {

    const [donHang, setDonHang] = useState(0);
    const [cuaHang, setCuaHang] = useState(0);
    const [sach, setSach] = useState(0);
    const [khachHang, setKhachHang] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const donHangs = await getAllDonHang();
                setDonHang(donHangs);

                const khachHangs = await getCustomerNumber();
                setKhachHang(khachHangs);

                const sachs = await getAllProducts();
                setSach(sachs);

                const cuaHangs = await getAllStoreAdmin();
                setCuaHang(cuaHangs.length);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="page scroll-container">
            <div className="container">

                <div className='admin-home'>
                    <BoxThongKeBlack title={'Đơn hàng'} value={donHang} image={'order.png'}/>
                    <BoxThongKeBlue title={'Khách hàng'} value={khachHang} image={'teamwork.png'}/>
                    <BoxThongKeBlack title={'Cửa hàng'} value={cuaHang} image={'ecommerce.png'}/>
                    <BoxThongKeBlue title={'Sách'} value={sach} image={'books.png'}/>
                </div>

                <div className='admin-home-main'>
                    <div className='admin-home-account'>
                        <img className='admin-home-account-img' src='/images/logoBooker.png' alt='' />
                        <div className='admin-home-account-info'>
                            <p>Booker</p>
                            <p>Admin</p>
                        </div>
                    </div>
                    <div className='admin-home-about'>
                        <p>
                            Booker là một sàn giao dịch sách trực tuyến, nơi độc giả có thể dễ dàng tìm thấy, mua và bán hàng ngàn cuốn sách từ mọi thể loại. Với giao diện thân thiện và dễ sử dụng, Booker không chỉ là nơi để sở hữu những cuốn sách yêu thích mà còn là không gian để chia sẻ đam mê và khám phá thế giới tri thức. Booker tự hào mang đến cho người dùng những cuốn sách mới nhất, các tác phẩm kinh điển, và những quyển sách hiếm từ các tác giả nổi tiếng lẫn những tài năng mới. Tại Booker, chúng tôi kết nối cộng đồng yêu sách và biến việc đọc sách trở nên gần gũi và dễ tiếp cận hơn bao giờ hết.
                        </p>
                    </div>
                </div>
                <div className="chart admin-home-chart">
                    <TickPlacementBars className="chart-w" />
                </div>
            </div>
        </div>
    );
};

export default HomeAdmin;