import axios from "axios";
// import storeID from "../../StoreId";
import {StoreApi} from '../../StoreId';

const host = "http://localhost:8080/api/baocaocuahang"

// export const StoreApi = async () =>{
//     const storedUser = JSON.parse(sessionStorage.getItem('user'));
//     if (storedUser) {
//             const storeID = await  axios.get(`http://localhost:8080/api/v1/cuahang/taikhoan/${storedUser.id_tai_khoan}`)
//             console.log(storeID.data.ma_cua_hang, 12312321312)
//             return storeID.data.ma_cua_hang;
//     }
// }


// * Hàm lấy tất cả báo cáo thuộc cửa hàng theo trạng thái ( đang xử lý - không hợp lệ ) - SELLER
export const getAllBaoCaoCuaHangByStatus = async (maTrangThai) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${host}/cuahang-${storeID}/trang_thai/${maTrangThai}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
   
}

// * Hàm lấy tất cả báo cáo thuộc cửa hàng theo trạng thái ( đã duyệt ) - SELLER
export const getAllBaoCaoCuaHangByDaDuyet = async () => {

    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${host}/cuahang-${storeID}/da_duyet`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
}

// * Hàm thêm cửa hàng báo cáo người dùng
export const addBaoCaoCuaHang = (data) => {
    return axios.post(`${host}/save`, data)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error adding report:", error);
        });
}

// * Hàm cập nhật báo cáo cửa hàng - ADMIN
export const updateBaoCaoCuaHang = (baoCaoCuaHang) => {
    return axios.put(`${host}/update`, baoCaoCuaHang)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error updating report:", error);
        });
}

// * Hàm xóa báo cáo - SELLER
export const deleteBaoCaoCuaHang = (maBaoCaoCuaHang) => {
    return axios.delete(`${host}/delete/bao-cao/${maBaoCaoCuaHang}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error deleting report:", error);
        });
}

// * Hàm đếm tổng số báo cáo thuộc cửa hàng - SELLER
export const getCountBaoCaoCuaHang = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${host}/cuahang-${storeID}/count-all`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
  
}

// * Hàm đếm tổng số báo cáo thuộc cửa hàng - ADMIN
export const getCountBaoCaoCuaHangAdmin = () => {
    return axios.get(`${host}/admin/count-all`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching count reports:", error);
        });
}

// * ADMIN - hàm lấy báo cáo mới hoặc đã hủy
export const getBaoCaoCuaHangByTrangThaiAdmin = (trangThai) => {
    return axios.get(`${host}/admin/trang_thai/${trangThai}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching count reports:", error);
        });
}
// * ADMIN - hàm lấy báo cáo đã duyệt
export const getBaoCaoCuaHangByDuyetAdmin = () => {
    return axios.get(`${host}/admin/da_duyet`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching count reports:", error);
        });
}

// * Xem thông tin chi tiết báo cáo
export const getBaoCaoCuaHangById = (maBaoCaoCuaHang) => {
    return axios.get(`${host}/thong-tin-chi-tiet/${maBaoCaoCuaHang}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching report by id:", error);
        });
}