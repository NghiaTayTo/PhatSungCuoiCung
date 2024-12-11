import axios from 'axios';

const hostDanhGia = 'http://localhost:8080/api/v1/danhgia';

// * Hàm lấy đánh giá theo mã đánh giá
export const getCommentById = (maDanhGia) => {
    return axios.get(`${hostDanhGia}/comment-${maDanhGia}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
        });
}

// * Hàm lấy danh sách đánh giá theo mã sách
export const getListCommentByBookID = (bookID) => {

    return axios.get(`${hostDanhGia}/ma_san_pham-${bookID}`)
        .then(response => {
            if (Array.isArray(response.data))
                return response.data;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });

};

// * Hàm đếm tất cả đánh giá theo mã sản phẩm
export const countCommentByBookID = (bookID) => {
    return axios.get(`${hostDanhGia}/tat-ca-danh-gia/ma_san_pham-${bookID}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });
};

// * Hàm tính điểm trung bình theo mã sản phẩm
export const getDiemTrungBinhByMaSanPham = (bookID) => {
    return axios.get(`${hostDanhGia}/diem-trung-binh-san-pham-${bookID}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });
};

// * Hàm tìm kiếm đánh giá theo mã sản phẩm và điểm đánh giá
export const searchCommentByBookIDAndRating = (bookID, rating) => {

    return axios.get(`${hostDanhGia}/tim-kiem/ma_san_pham-${bookID}/diem_danh_gia-${rating}`)
        .then(response => {
            if (Array.isArray(response.data))
                return response.data;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });

};