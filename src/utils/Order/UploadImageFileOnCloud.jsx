import axios from 'axios';

// * Hàm upload ảnh lên Cloudinary
export const handleImageUpload = async (file) => {
    const CLOUD_NAME = 'ddufwoomh';
    const PRESET_NAME = 'image-upload';
    const FOLDER_NAME = 'ECMA';
    const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append('upload_preset', PRESET_NAME);
    formData.append('folder', FOLDER_NAME);
    formData.append('file', file);

    try {
        const response = await axios.post(api, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        // Trả về URL của ảnh đã tải lên thành công
        return response.data.secure_url;
    } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
    }
};

// * Hàm tạo File object từ URL của ảnh
export const createFileFromUrl = async (url, filename) => {
    try {
        const response = await fetch(url); // Tải ảnh từ URL
        const blob = await response.blob(); // Chuyển đổi response thành Blob
        const file = new File([blob], filename, { type: blob.type }); // Tạo File object
        return file;
    } catch (error) {
        console.error("Error creating file from URL:", error);
        throw error;
    }
};
 