
import axios from 'axios';


export const StoreID = async () => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser) {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/cuahang/taikhoan/${storedUser.id_tai_khoan}`);
            const storeID = response.data.ma_cua_hang;
            console.log(storeID, 'Store ID fetched');
            return storeID; // Trả về trực tiếp giá trị mong muốn
        } catch (error) {
            console.error('Error fetching store ID:', error);
            throw error; // Xử lý lỗi nếu có
        }
    } else {
        console.warn('No user found in sessionStorage');
        return null; // Trả về null nếu không có user
    }
};

export const StoreApi = () => {
    return StoreID();
}