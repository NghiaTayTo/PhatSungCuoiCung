import axios from "axios";

const hostViPham = "http://localhost:8080/api/vi_pham";

// * Hàm lấy tất cả vi phạm
export const getAllViPham = () => {
    return axios.get(`${hostViPham}/all_vipham`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching products by store:", error);
        });
};

// * Lấy vi phạm theo id
export const getViPhamById = (id) => {
    return axios.get(`${hostViPham}/${id}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching product by id:", error);
        });
};