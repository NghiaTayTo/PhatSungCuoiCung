import axios from "axios";
// import storeID from "../../StoreId";
import {StoreApi} from '../../StoreId';

const hostBank = "http://localhost:8080/api/v1/tai-khoan-ngan-hang"; 

// export const StoreApi = async () =>{
//     const storedUser = JSON.parse(sessionStorage.getItem('user'));
//     if (storedUser) {
//             const storeID = await  axios.get(`http://localhost:8080/api/v1/cuahang/taikhoan/${storedUser.id_tai_khoan}`)
//             console.log(storeID.data.ma_cua_hang, 12312321312)
//             return storeID.data.ma_cua_hang;
//     }
// }

export const getAllBank = () => {
    return axios.get("https://api.httzip.com/api/bank/list")
        .then(response => {
            console.log("API Response:", response);  // Logs full response to inspect structure
            if (response.data && response.data.success) {
                return response.data.data;  // Return the 'data' field if 'success' is true
            } else {
                console.error("API returned an unsuccessful response");
                return [];  // Return an empty array as a fallback
            }
        })
        .catch(error => {
            console.error("Error fetching bank data:", error);
            return [];  // Return an empty array on error
        });
}

// * Hàm thêm tài khoản ngân hàng mới
export const addTaiKhoanNganHang = (data) => {
    return axios.post(`${hostBank}/save`, data)
    .then(response => {
        return response.data.result;
    })
    .catch(error => {
        console.error('Error fetching products by store:', error);
        throw error;
    });
}

// storeID()

// * Hàm lấy tài khoản ngân hàng theo mã cửa hàng
export const getTaiKhoanNganHangByStore = async () => {

    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response= await axios.get(`${hostBank}/my_bank/${storeID}`);
        return response.data;
        
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
}

// * Hàm cập nhật tài khoản ngân hàng

export const updateTaiKhoanNganHang = (data) => {
    return axios.put(`${hostBank}/update`, data)
    .then(response => {
        return response.data;
    })
    .catch(error => {
        console.error('Error fetching products by store:', error);
        throw error;
    });
}