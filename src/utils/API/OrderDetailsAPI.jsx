import axios from 'axios';
// import storeID from '../../StoreId';
import {StoreApi} from '../../StoreId';

const hostProduct = "http://localhost:8080/api/v1/orderdetail";

// export const StoreApi = async () =>{
//     const storedUser = JSON.parse(sessionStorage.getItem('user'));
//     if (storedUser) {
//             const storeID = await  axios.get(`http://localhost:8080/api/v1/cuahang/taikhoan/${storedUser.id_tai_khoan}`)
//             console.log(storeID.data.ma_cua_hang, 12312321312)
//             return storeID.data.ma_cua_hang;
//     }
// }

// * Hàm lấy danh sách hóa đơn chi tiết theo mã CỬA HÀNg
export const getOrderDetail = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${hostProduct}/cuahang-${storeID}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
}

// * Hàm lấy danh sách hóa đơn chi tiết theo mã trạng thái
export const getOrderDetailsByTrangThai = async (maTrangThai) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${hostProduct}/cuahang-${storeID}/sort/trangthai-${maTrangThai}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
  
}

// * Hàm tính tạm doanh thu đơn hàng mới
export const calculateNewOrderRevenue = async (maTrangThai) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${hostProduct}/cuahang-${storeID}/trangthai-${maTrangThai}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

}

// * Hàm đếm hóa đơn chi tiết theo trạng thái
export const countOrderDetailsByStatus = async (maTrangThai) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${hostProduct}/dem_hoa_don_chi_tiet/cuahang-${storeID}/trangthai-${maTrangThai}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
 
}

// * Hàm tìm kiếm hóa đơn chi tiết theo ngày tạo
export const searchOrderDetailsByDateCreated = async (matt, date) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${hostProduct}/cuahang-${storeID}/sort/trangthai-${matt}/ngay-${date}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
   
}

// * Hàm tìm kiếm hóa đơn chi tiết theo mã hóa đơn
export const searchOrderDetailsByOrderID = async (matt, madhct) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${hostProduct}/cuahang-${storeID}/trangthai-${matt}/tim_kiem_by_idhd-${madhct}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
   
}

// * Hàm lấy thông tin của một đơn hàn chi tiết
export const getInfoOfOrderDetailById = async (madhct) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await axios.get(`${hostProduct}/cuahang-${storeID}/don_hang_chi_tiet-${madhct}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    } 
}

// * ADMIN - Hàm xem chi tiết hóa đơn chi tiết
export const getDetail = async (madhct) => {
    try {
        const response =await axios.get(`${hostProduct}/admin/detail-${madhct}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    } 
}


// * Hàm cập nhật trạng thái 
export const updateOrderDetailStatus = (orderDetailData) => {
    return axios.put(`${hostProduct}/cap-nhat_don_hang_chi_tiet`, orderDetailData)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error updating order detail status:', error);
            throw error;
        });
}

// * ADMIN - hàm lấy tất cả hóa đơn chi tiết theo mã trạng thái
export const getAllOrderDetailsByStatus = (maTrangThai) => {
    return axios.get(`${hostProduct}/admin/trangthai-${maTrangThai}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching order details by status:', error);
            throw error;
        });
}

// * Hàm lấy ra tổng lượt bán của cửa hàng
export const getSumLuotBanByMaCuaHang = (idStore) => {
    return axios.get(`${hostProduct}/sum-luot-ban/${idStore}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching order details by status:', error);
            throw error;
        });
}