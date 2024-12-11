import axios from 'axios';
// import storeID from '../../StoreId';
import { StoreApi } from '../../StoreId';

let cachedStoreID = null;

const hostProduct = "http://localhost:8080/api/v1/product";

// export const StoreApi = async () =>{
//     const storedUser = JSON.parse(sessionStorage.getItem('user'));
//     if (storedUser) {
//             const storeID = await  axios.get(`http://localhost:8080/api/v1/cuahang/taikhoan/${storedUser.id_tai_khoan}`)
//             console.log(storeID.data.ma_cua_hang, 12312321312)
//             return storeID.data.ma_cua_hang;
//     }
// }

//* Hàm lấy danh sách sản phẩm theo cửa hàng - http://localhost:8080/api/v1/product/cuahang-(storeID)
// * SELLER
export const getSanPhamByCuaHangId = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
};
export const getProductByIdStore = async (idStore) => {
    try {
        const response = await axios.get(`${hostProduct}/cuahang-${idStore}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
};

// * Hàm lấy list sản phẩm theo cửa hàng cho ADMIN
export const getSanPhamByCuaHangIdAdmin = async (storeId) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeId}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

};

// * Hàm lấy ra sản phẩm sắp xếp theo điểm đánh giá cao -> thấp
export const getSanPhamOrderByComment = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/sap-xep/diemdanhgia`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

};
export const getSanPhamOrderByCommentByStoreID = (storeId) => {
    return axios.get(`${hostProduct}/cuahang-${storeId}/sap-xep/diemdanhgia`)
        .then(response => {
            if (Array.isArray(response.data))
                return response.data;
        })
        .catch(error => {
            console.error('Error fetching products by store:', error);
            throw error;
        });
};

//* Hàm lấy chi tiết sản phẩm theo ID sản phẩm và mã cửa hàng
// * - http://localhost:8080/api/v1/product/cuahang-(storeID)/(spID)
export const getSanPhamById = async (sanPhamId) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/${sanPhamId}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
};


//* Hàm tìm kiếm sản phẩm theo tên
export const searchSanPhamByName = async (tenSanPham) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/tim-kiem/tensanpham?ten=${tenSanPham}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

};

// * Hàm tìm kiếm sản phẩm theo thể loại
export const searchProductsByCategoryID = async (categoryID) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/tim-kiem/theloai?category=${categoryID}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

}

// * Hàm tìm kiếm sản phẩm theo trạng thái
export const searchBookByStatus = async (statusInt) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/tim-kiem/trangthai/${statusInt}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
}

// * Hàm thêm sản phẩm mới
export const addSanPham = async (newProduct) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.post(`${hostProduct}/cuahang-${storeID}`, newProduct);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
};

// * Hàm cập nhật sản phẩm
export const updateSanPham = (updatedProduct) => {
    return axios.put(`${hostProduct}/update`, updatedProduct)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            throw error;
        });
};

// * Hàm xóa sản phẩm
export const deleteBook = async (productId) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = axios.delete(`${hostProduct}/cuahang-${storeID}/${productId}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
};

// * Hàm lấy sản phẩm bán chạy
export const getBookBySale = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/ban-chay`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

};

// * Hàm lấy sản phẩm sắp xếp theo doanh thu
export const getBookByDoanhThu = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/doanh-thu`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

};


// *======================================= Hàm lấy số lượng - start ===========================================

// * Đếm số lượng sản phẩm theo cửa hàng
export const getCountBooksAll = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/count`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
}

// * Hàm lấy sản phẩm theo trạng thái
export const getNumberOfBookByClock = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/spbikhoa`);
        return response.data.length; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
}
// * Hàm lấy sản phẩm theo trạng thái
export const getNumberOfBookByYeuCauMoKhoa = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/yeucaumokhoa`);
        return response.data.length; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
}



// * Hmaf laấy sản phảm còn hàng
export const getNumberOfBookByInStock = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/conhang`);
        return response.data.length; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
}
// * Hầm lấy sản phẩm hết hàng
export const getNumberOfBookByOutOfStock = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/hethang`);
        return response.data.length; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
}



// * Hàm đếm sản phẩm chờ duyệt
export const getNumberOfBookByBrowse = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/choduyet`);
        return response.data.length; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

}

// * Hàm đếm sản phẩm đang ẩn
export const getNumberOfBookByHidden = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/an/length`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

}

// * Hàm lấy sản phẩm đang ẩn
export const getBookByHidden = async () => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`${hostProduct}/cuahang-${storeID}/an/list`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }
}

// *======================================= Hàm lấy số lượng - end ===========================================

// * USER - lấy tất cả sản phẩm
export const getAllBook = () => {
    return axios.get(`http://localhost:8080/api/v1/product/allinfo`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.error(err)
        })
}

// * USER - Lấy thông tin chi tiết sản phẩm
export const getBookByMaSP = async (idProduct) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/product/sanpham/${idProduct}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

};

// * USER - Lấy thông tin chi tiết của một sách
export const getBookByID = async (idProduct) => {
    try {
        const storeID = await StoreApi(); // Đợi StoreApi trả về storeID
        console.log(storeID);

        if (!storeID) {
            throw new Error('Store ID is not available');
        }
        const response = await axios.get(`http://localhost:8080/api/v1/product/cuahang-${storeID}/${idProduct}`);
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error; // Xử lý lỗi
    }

};

export const getProductByMaSPUser = (idSP) => {
    return axios.get(`${hostProduct}/sanpham/${idSP}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.error(err)
        })
}

// * ADMIN - Hàm lấy sản phẩm chở duyệt
export const getProductToBrowse = () => {
    return axios.get(`${hostProduct}/cho-duyet`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.error(err)
        })
}

// * ADMIN - Hàm lấy sản phẩm yêu cầu mở khóa
export const getProductToYeuCauMoKhoa = () => {
    return axios.get(`${hostProduct}/yeu_cau_duyet`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.error(err)
        })
}

// * ADMIN - Hàm lấy sản phẩm bị khóa
export const getProductLocked = () => {
    return axios.get(`${hostProduct}/vo-hieu-hoa`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.error(err)
        })
}

// * ADMIN - Hàm lấy sản phẩm đang bán
export const getProductForSelling = () => {
    return axios.get(`${hostProduct}/dang-ban`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.error(err)
        })
}

// * ADMIN - Hàm lấy sản phẩm vi phạm
export const getProductViPham = () => {
    return axios.get(`${hostProduct}/sanpham/vipham`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.error(err)
        })
}


// * ADMIN - hàm lấy tất cả sản phẩm
export const getAllProducts = () => {
    return axios.get(`${hostProduct}/admin/all-san-pham`)
        .then(res => {
            return res.data.length;
        })
        .catch(err => {
            console.error(err)
        })
};

// * Trung Anh
export const searchProducts = async (searchTerm, storeId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/product/cuahang-21/tim-kiem/tensanpham`, {
            params: {
                ma_cua_hang: storeId,
                ten: searchTerm
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
        return []; // Trả về mảng rỗng nếu có lỗi
    }
};