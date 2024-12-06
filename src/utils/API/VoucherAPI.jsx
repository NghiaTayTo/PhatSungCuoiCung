import axios from 'axios';
// import StoreApi from '../../StoreId';
import {StoreApi} from '../../StoreId';

const hostVoucher = "http://localhost:8080/api/v1/voucher";



// * Hàm lấy Voucher
export const getVouchersByCuaHangId = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await  axios.get(`${hostVoucher}/cuahang-${storeID}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
  
}

// * Hàm lấy thông tin 1 Voucher
export const getVouchersByCuaHangIdAndVoucherID = async (voucherID) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await  axios.get(`${hostVoucher}/cuahang-${storeID}/${voucherID}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
}

// * Hàm cập nhật voucher
export const updateVoucherByID = async (voucherID, voucher) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =await  axios.put(`${hostVoucher}/cuahang-${storeID}/${voucherID}`, voucher);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
};

// * Hàm thêm voucher mới
export const addVoucher =  async (voucher) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.post(`${hostVoucher}/cuahang-${storeID}`, voucher);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
 
};

// * Hàm xóa voucher
export const deleteVoucherByID = (voucherID) => {
    return axios.delete(`${hostVoucher}/${voucherID}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('L��i khi xóa voucher:', error);
            throw error;
        });
}

// * Hàm tìm kiếm danh sách voucher theo trạng thái
export const searchVouchersByStatus = async (status) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostVoucher}/cuahang-${storeID}/tim-kiem/status?trangthai=${status}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
   
}

// * Hàm tìm kiếm danh sách voucher theo tên
export const searchVouchersByName = async (name) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostVoucher}/cuahang-${storeID}/tim-kiem/ten-voucher?voucherName=${name}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
   
}

// * Hàm tìm kiếm danh sách voucher theo giá giảm
export const searchVouchersByPrice = async (price) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response =  await axios.get(`${hostVoucher}/cuahang-${storeID}/tim-kiem/gia-giam?saleOff=${price}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
   
}

// *------------------------- START -- Hàm đếm số lượng voucher -----------------------------------
// * đếm số lượng voucher thuộc cửa hàng
export const getCountVoucherByStore = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostVoucher}/cuahang-${storeID}/count-voucher-by-store`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
  
}

// * đếm số lượng voucher theo trạng thái
export const getCountVoucherByStatus = async (status) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostVoucher}/cuahang-${storeID}/count-voucher-by-status/${status}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

}
// *------------------------- END -- Hàm đếm số lượng voucher -----------------------------------
