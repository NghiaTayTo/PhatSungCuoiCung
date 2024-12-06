import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/v1/nguoidung";

export const getDefaultAddress = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/diachi/default/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching default address:", error);
        throw error;
    }
};

export const addAddress = async (userId, addressData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/diachi/nguoidung-${userId}`, addressData);
        return response.data;
    } catch (error) {
        console.error("Error adding new address:", error);
        throw error;
    }
};

export const updateAddress = async (userId, addressId, addressData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${userId}/diachi-${addressId}`, addressData);
        return response.data;
    } catch (error) {
        console.error("Error updating address:", error);
        throw error;
    }
};

export const deleteAddress = async (userId, addressId) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/v1/nguoidung/${userId}/diachi-${addressId}`);
        return response;
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error;
    }
};
export const getAddresses = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/diachi/${userId}`);
    return response.data;
};