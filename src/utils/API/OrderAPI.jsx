import axios from "axios";

const hostOrder = "http://localhost:8080/api/v1/donhang";

// * Hàm lấy ra đơn hàng theo mã -SELLER
export const getDonHangById = (maDonHang) => {
    return axios.get(`${hostOrder}/seller/ma_don_hang-${maDonHang}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching order by ID:", error);
            throw error;
        });
};

// * ADMIN - hàm lấy tất cả đơn hàng
export const getAllDonHang = () => {
    return axios.get(`${hostOrder}/admin/all-don-hang`)
        .then(response => {
            return response.data.length;
        })
        .catch(error => {
            console.error("Error fetching all orders:", error);
            throw error;
        });
};