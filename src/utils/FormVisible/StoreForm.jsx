import React, { useEffect, useState } from 'react';

import './FormVisibleAll.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger } from 'react-bootstrap';
import { renderTooltip } from '../Order/ToolTip';

import { updateCuaHang } from '../../utils/API/StoreAPI';
import { handleImageUpload } from '../../utils/Order/UploadImageFileOnCloud';

import NotificationUI from '../Notification/NotificationUI';

const StoreForm = ({ onClose, storeData }) => {

    const [store, setStore] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    const handleInputChange = (e) => {
        const { id, value } = e.target; // Lấy id và giá trị của input
        let newValue = value;

        if (!newValue) return;

        setStore(prevStore => ({
            ...prevStore,
            [id]: newValue
        }));
    };

    // * Hàm xử lý khi người dùng chọn ảnh
    const handleImageChange = async (e, imageType) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log(file);

        try {
            // Hiển thị ảnh tạm thời cho người dùng xem trước
            const previewUrl = URL.createObjectURL(file);

            if (imageType === 'anh_dai_dien') {
                setSelectedImage(prev => ({ ...prev, anh_dai_dien: previewUrl }));
            } else if (imageType === 'anh_bia') {
                setSelectedImage(prev => ({ ...prev, anh_bia: previewUrl }));
            }

            // Gọi hàm upload và nhận URL ảnh sau khi upload
            const uploadedImageUrl = await handleImageUpload(file);

            // Cập nhật URL ảnh vào store dựa trên loại ảnh
            setStore(prevStore => ({
                ...prevStore,
                [imageType]: uploadedImageUrl
            }));
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };
    const [errors, setErrors] = useState({});
    const handleSubmitUpdate = (e) => {
        // e.preventDefault();

        const newErrors = {};

        // Kiểm tra các trường dữ liệu
        if (!store.anh_dai_dien) {
            newErrors.anh_dai_dien = true;
        }
        if (!store.anh_bia) {
            newErrors.anh_bia = true;
        }
        if (!store.ten_cua_hang) {
            newErrors.ten_cua_hang = true;
        }
        if (!store.dia_chi_cua_hang) {
            newErrors.dia_chi_cua_hang = true;
        }

        // Nếu có lỗi, cập nhật trạng thái errors
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            handleUpdateStore(store)
        }
    };

    const [isUpdate, setIsUpdate] = useState(false);

    const handleUpdateStore = (store) => {
        const fetchData = async () => {
            try {
                const updatedStore = await updateCuaHang(store);

                if (updatedStore) {
                    // setStore(updatedStore);
                    setCloseNotification(true);
                    setIsUpdate(true);
                    setNotificationStatus('updateIsGood')
                } else {
                    setCloseNotification(true);
                    setIsUpdate(false);
                    setNotificationStatus('updateIsFail')
                }
            } catch (error) {
                setCloseNotification(true);
                setIsUpdate(false);
                setNotificationStatus('updateIsFail')
                console.error(error);
            }
        }

        fetchData();
    }

    // * Hiển thị thông báo
    const [notificationStatus, setNotificationStatus] = useState('');
    const [closeNotification, setCloseNotification] = useState(false);


    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    const handleCloseStoreForm = () => {
        if (isUpdate) {
            window.location.reload();
        } else {
            onClose();
        }
    }

    useEffect(() => {
        setStore(storeData);
    }, [storeData])

    return (
        <div>
            <div className="bg_black">
                <div className='addnewbook store-form'>
                    <div className='addnewbook-header'>
                        <h3>Cập nhật cửa hàng</h3>
                        <FontAwesomeIcon onClick={handleCloseStoreForm} style={{ cursor: 'pointer' }} className="faXmark" icon={faXmark}></FontAwesomeIcon>
                    </div>
                    <div className='store-form-img'>
                        <div className='store-form-img_bia'>
                            <img src={store.anh_bia} alt='Ảnh bìa' />
                        </div>

                        <div className='store-form-img_avt'>
                            <img src={store.anh_dai_dien} alt='Ảnh đại diện' />
                        </div>

                        <div className='store-form-img_changce-avt'>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'anh_dai_dien')}
                                id="anh_dai_dien"
                                style={{ cursor: 'pointer', display: 'none' }} // Đổi con trỏ thành kiểu click
                            />
                            <label htmlFor="anh_dai_dien" style={{ margin: '0', cursor: 'pointer' }}>Thay đổi ảnh</label>
                        </div>

                        <div className='store-form-img_info'>
                            <div style={{ display: 'flex' }}>
                                <input
                                    id='ten_cua_hang'
                                    type='text'
                                    className='text-stroke'
                                    value={store.ten_cua_hang}
                                    onChange={handleInputChange} />
                            </div>
                            <div style={{ display: 'flex' }}>
                                <textarea
                                    id='dia_chi_cua_hang'
                                    className='text-stroke stroke-update'
                                    value={store.dia_chi_cua_hang}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'anh_bia')}
                            id="anh_bia"
                            style={{ cursor: 'pointer', display: 'none' }} // Đổi con trỏ thành kiểu click
                        />
                        <label htmlFor="anh_bia" style={{ margin: '0', cursor: 'pointer' }}>
                            <OverlayTrigger
                                placement="right"
                                overlay={(props) => renderTooltip(props, 'Cập nhật ảnh bìa', 'tooltip-update-store')}
                            >
                                <FontAwesomeIcon style={{ cursor: 'pointer' }} className="store-form-img_info-icon" icon={faPenToSquare}></FontAwesomeIcon>
                            </OverlayTrigger>
                        </label>

                    </div>
                    <div className='store-form_btn'>
                        <button onClick={handleSubmitUpdate} className='store-form_btn1'>Cập nhật</button>
                        <button className='store-form_btn2' onClick={handleCloseStoreForm}>Thoát</button>
                    </div>
                </div>

                {notificationStatus === 'updateIsGood' && closeNotification === true && (
                    <NotificationUI
                        type="success"
                        title="Cập nhật cửa hàng"
                        description={`"Thành công."`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                )}

                {notificationStatus === 'updateIsFail' && closeNotification === true && (
                    <NotificationUI
                        type="error"
                        title="Cập nhật cửa hàng"
                        description={`"Thất bại."`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                )}
            </div>
        </div>
    );
};

export default StoreForm;