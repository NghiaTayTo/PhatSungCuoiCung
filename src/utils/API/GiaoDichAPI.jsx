import axios from "axios";
// import storeID from "../../StoreId";
import {StoreApi} from '../../StoreId';

const hostGiaoDich = "http://localhost:8080/api/v1/giaodich";

// export const StoreApi = async () =>{
//     const storedUser = JSON.parse(sessionStorage.getItem('user'));
//     if (storedUser) {
//             const storeID = await  axios.get(`http://localhost:8080/api/v1/cuahang/taikhoan/${storedUser.id_tai_khoan}`)
//             console.log(storeID.data.ma_cua_hang, 12312321312)
//             return storeID.data.ma_cua_hang;
//     }
// }

// * Hàm thêm giao dịch mới
export const addGiaoDich = (data) => {
    return axios.post(`${hostGiaoDich}/add`, data)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching products by store:", error);
            throw error;
        });
};

// * Hàm tạo mã QR giao dịch
export const createQRCode = (giaoDichData) => {
    return axios.post(`https://api.vietqr.io/v2/generate`, giaoDichData)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching products by store:", error);
            throw error;
        });
};

// * Hàm cập nhật giao dịch
export const updateGiaoDich = (giaoDichData) => {
    return axios.put(`${hostGiaoDich}/update`, giaoDichData)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching products by store:", error);
            throw error;
        });
};


// * Hàm lấy tất cả giao dịch của cửa hàng - SELLER
export const getAllGiaoDichByStore = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${hostGiaoDich}/seller/cuahang-${storeID}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
   
};
export const getAllGiaoDichByStoreLength = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${hostGiaoDich}/seller/cuahang-${storeID}`);
        return response.data.length; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
  
};

// * Hàm lấy giao dịch theo cửa hàng và trạng thái - SELLER
export const getGiaoDichByCuaHangAndTrangThai = async (trangThai) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${hostGiaoDich}/seller/cuahang-${storeID}/trannthai-${trangThai}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
   
}
export const getGiaoDichByCuaHangAndTrangThaiLength = async (trangThai) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${hostGiaoDich}/seller/cuahang-${storeID}/trannthai-${trangThai}`);
        return response.data.length; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching products by store:', error);
        throw error; // Xử lý lỗi
    }
   
}

//  * ADMIN - hàm lấy tất cả giao dịch theo trạng thái
export const getAllGiaoDichByTrangThaiAdmin = (trangThai) => {
    return axios.get(`${hostGiaoDich}/admin/trangthai-${trangThai}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching products by store:", error);
            throw error;
        });
};


//  * Hàm xem chi tiết giao dịch
export const getGiaoDichByID = (giaoDichID) => {
    return axios.get(`${hostGiaoDich}/detail-${giaoDichID}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching products by store:", error);
            throw error;
        });
};

// * ADMIN - hàm lấy tất cả giao dịch
export const getAllGiaoDichAdmin = () => {
    return axios.get(`${hostGiaoDich}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching products by store:", error);
            throw error;
        });
};