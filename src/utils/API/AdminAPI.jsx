import axios from "axios";

const hostAdmin = "http://localhost:8080/api/thongkesan";

// * ADMIN - Hàm lấy thống kê tiền

export const getRevenueAdmin = () => {
    return axios.get(`${hostAdmin}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching revenue:", error);
        });
};

// * ADMIN - hàm lấy giao dịch nạp tiền
export const getGiaoDichNapTien = () => {
    return axios.get(`http://localhost:8080/api/nap/all`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching top don hang nap tien:", error);
        });
};