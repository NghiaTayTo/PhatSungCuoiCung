import axios from 'axios';

// * Hàm upload nhiều ảnh lên Cloudinary
export const handleMultipleImageUpload = async (files) => {
    const CLOUD_NAME = 'ddufwoomh';
    const PRESET_NAME = 'image-upload';
    const FOLDER_NAME = 'ECMA';
    const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const uploadedImages = [];

    try {
        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('upload_preset', PRESET_NAME);
            formData.append('folder', FOLDER_NAME);
            formData.append('file', files[i]);

            const response = await axios.post(api, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Lưu URL của ảnh đã upload
            uploadedImages.push(response.data.secure_url);
        }

        console.log("All images uploaded successfully:", uploadedImages);
        return uploadedImages;
    } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
    }
};
