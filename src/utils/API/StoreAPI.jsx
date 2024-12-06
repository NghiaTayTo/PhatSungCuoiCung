import axios from 'axios';
// import StoreApi from '../../StoreId';
import { StoreApi } from '../../StoreId';


const hostCuaHang = "http://localhost:8080/api/v1/cuahang";
const hostOrder = "http://localhost:8080/api/v1/orderdetail";

// export const StoreApi = async () =>{
//     const storedUser = JSON.parse(sessionStorage.getItem('user'));
//     if (storedUser) {
//             const storeID = await  axios.get(`http://localhost:8080/api/v1/cuahang/taikhoan/${storedUser.id_tai_khoan}`)
//             console.log(storeID.data.ma_cua_hang, 12312321312)
//             return storeID.data.ma_cua_hang;
//     }
// }

// * ADMIN - Hàm lấy tất cả cửa hàng
export const getAllStoreAdmin = () => {
    return axios.get(`${hostCuaHang}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching all stores:', error);
            throw error;
        });
}

// * ADMIN - hàm lấy cửa hàng vi phạm
export const getStoreViPham = () => {
    return axios.get(`${hostCuaHang}/vi_pham`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching store in violation:', error);
            throw error;
        });
}

// * Hàm lấy thông tin cửa hàng theo ID - SELLER
export const getCuaHangById = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostCuaHang}/${storeID}`);
        return response.data.result; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
};
// * Hàm lấy thông tin cửa hàng theo ID - ADMIN
export const getCuaHangByIdAdmin = (id) => {
    return axios.get(`${hostCuaHang}/${id}`)
        .then(response => {
            return response.data.result;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });
}

// * Hàm cập nhật thông tin cửa hàng
export const updateCuaHang = async (cuaHang) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const a = await axios.put(`${hostCuaHang}/${storeID}`, cuaHang);
        return a.data;

    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

}

// * ADMIN - update trạng thái cửa hàng
export const updateCuaHangAdmin = async (cuaHang) => {
    try {
        const a = await axios.put(`${hostCuaHang}/admin/update`, cuaHang);
        return a.data;
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

}

// * Hàm lấy cửa hàng theo trạng thái
export const getCuaHangChoDuyet = (maTrangThai) => {
    return axios.get(`${hostCuaHang}/trang_thai/${maTrangThai}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });
}

// * ADMIN - hàm lấy ra tất cả cửa hàng khóa

export const getCuaHangKhoaAdmin = () => {
    return axios.get(`${hostCuaHang}/trang_thai/khoa`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });
}

// * Tổng doanh thu của cửa hàng với đơn động
export const getDoanhThuCuaHang = async (maTrangThai) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const a = await axios.get(`${hostOrder}/cuahang-${storeID}/trangthai-${maTrangThai}`);
        return a.data;

    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

}

// * Hàm sắp xếp cửa hàng theo doanh thu - ADMIN
export const getBookByDoanhThuAdmin = () => {
    return axios.get(`${hostCuaHang}/admin/desc`)
        .then(response => {
            return response.data;
        })
}