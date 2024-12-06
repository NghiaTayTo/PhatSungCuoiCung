import React, { useState } from 'react';
import { handleMultipleImageUpload } from '../Order/testanh';

const MultiImageUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedUrls, setUploadedUrls] = useState([]);

    // * Hàm xử lý khi người dùng chọn ảnh
    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files); // Lưu trữ các file đã chọn
    };

    // * Hàm upload các ảnh đã chọn
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            alert("Please select at least one image to upload.");
            return;
        }

        try {
            const urls = await handleMultipleImageUpload(selectedFiles);
            setUploadedUrls(urls); // Lưu các URL ảnh đã upload
        } catch (error) {
            console.error("Error uploading images:", error);
        }
    };

    return (
        <div>
            <h1>Upload Multiple Images</h1>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
            />
            <button onClick={handleUpload}>Upload Images</button>

            {uploadedUrls.length > 0 && (
                <div>
                    <h2>Uploaded Images:</h2>
                    <ul>
                        {uploadedUrls.map((url, index) => (
                            <li key={index}>
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    {url}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MultiImageUpload;
