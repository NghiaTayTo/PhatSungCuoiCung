import axios from 'axios';

const hostCategory = "http://localhost:8080/api/v1/category";

// * Hàm lấy Thể Loại - http://localhost:8080/api/v1/category
export const getCategory = () => {
    return axios.get(`${hostCategory}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });
}

// * Hàm lấy Thể Loại theo ID - http://localhost:8080/api/v1/category/(ID)
export const getCategoryByID = (categoryID) => {
    return axios.get(`${hostCategory}/${categoryID}`)
        .then(response => {
            return response.data.result;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });
}

// * Hàm xóa thể loại theo ID

export const deleteCategoryByID = (categoryID) => {
    return axios.delete(`${hostCategory}/delete/${categoryID}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });
}

// * Hàm đếm tất cả thể loại
export const getCountAllCategory = () => {
    return axios.get(`${hostCategory}/count-all-category`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });
}

// * Hàm đếm số lượng sản phẩm thuộc cửa hàng
export const getCountBookByStore = (maTheLoai) => {
    return axios.get(`${hostCategory}/count-${maTheLoai}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching count products:', error);
            throw error;
        });
}

// * Hàm tìm kiếm thể loại theo tên
export const searchCategoryByName = (tenTheLoai) => {
    return axios.get(`${hostCategory}/search-${tenTheLoai}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });
}

// * Hàm thêm mới thể loại
export const addCategory = (categoryData) => {
    return axios.post(`${hostCategory}/add`, categoryData)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });
}

// * Hàm cập nhật thể loại
export const updateCategory = (categoryData) => {
    return axios.put(`${hostCategory}/update`, categoryData)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });
}

// * Hàm xóa thể loại theo mã
export const deleteCategoryByMa = (maTheLoai) => {
    return axios.delete(`${hostCategory}/delete/${maTheLoai}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });
}