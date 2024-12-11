import axios from 'axios';
// import storeID from '../../StoreId';
import {StoreApi} from '../../StoreId';

const hostPhanHoiDanhGia = "http://localhost:8080/api/v1/phan-hoi-danh-gia";

// export const StoreApi = async () =>{
//     const storedUser = JSON.parse(sessionStorage.getItem('user'));
//     if (storedUser) {
//             const storeID = await  axios.get(`http://localhost:8080/api/v1/cuahang/taikhoan/${storedUser.id_tai_khoan}`)
//             console.log(storeID.data.ma_cua_hang, 12312321312)
//             return storeID.data.ma_cua_hang;
//     }
// }

// * Hàm lấy danh sách phản hồi đánh giá theo mã sản phẩm
export const getPhanHoiDanhGiaByMaDanhGia = async (maDanhGia) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${hostPhanHoiDanhGia}/cuahang-${storeID}/ma_danh_gia-${maDanhGia}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
  
}   
export const getPhanHoiDanhGiaByMaDanhGiaUser = async (idStore, maDanhGia) => {
    try {
        const response =await axios.get(`${hostPhanHoiDanhGia}/cuahang-${idStore}/ma_danh_gia-${maDanhGia}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
  
}   

// * Hàm insert phản hồi đánh giá mới
export const insertPhanHoiDanhGia = (phanHoiDanhGia) => {
    return axios.post(`${hostPhanHoiDanhGia}/insert`, phanHoiDanhGia)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error inserting new feedback:', error);
            throw error;
        });
}

// * Hàm xóa phản hồi đánh giá

export const deletePhanHoiDanhGia = (maPhanHoiDanhGia) => {
    return axios.delete(`${hostPhanHoiDanhGia}/delete-${maPhanHoiDanhGia}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error deleting feedback:', error);
            throw error;
        });
}