import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

import { addCategory, getCategoryByID, updateCategory } from '../../utils/API/CategoryAPI';
import NotificationUI from '../Notification/NotificationUI';


const CategoryForm = ({ categoryID, keyForm, onClose }) => {

    const [category, setCategory] = useState({});
    // *Check form
    const [errors, setErrors] = useState({});

    // * Hàm change category
    const handleChangeCategory = (e) => {
        const { name, value } = e.target;
        setCategory((prevCategory) => ({
            ...prevCategory,
            [name]: value
        }));
    };

    // * Hàm kiểm tra dữ liệu đầu vào:  insert, update
    const handleCheckInsertCategory = () => {
        const newErrors = {};
        if (!category.ten_the_loai) {
            newErrors.ten_the_loai = true;
        }
        if (!category.mo_ta_the_loai) {
            newErrors.mo_ta_the_loai = true;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            handleInsertCategory(category)
        }
    };

    const handleCheckUpdateCategory = () => {
        const newErrors = {};
        if (!category.ten_the_loai) {
            newErrors.ten_the_loai = true;
        }
        if (!category.mo_ta_the_loai) {
            newErrors.mo_ta_the_loai = true;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            handleUpdateCategory(category)
        }
    };

    // * Hiển thị thông báo
    const [notificationStatus, setNotificationStatus] = useState('');
    const [closeNotification, setCloseNotification] = useState(false);
    const [load, setLoad] = useState(false);

    // * Hàm thêm thể loại mới
    const handleInsertCategory = (category) => {
        const fetchData = async () => {
            try {
                const data = await addCategory(category);
                if (data) {
                    setCategory(data)
                    setErrors({});
                    setNotificationStatus('insertIsSuccess');
                    setCloseNotification(true);
                    window.location.reload();
                }
            } catch (e) {
                const newErrors = {};
                newErrors.trung_ten_the_loai = true;
                setErrors(newErrors);
                setNotificationStatus('insertIsFail');
                setCloseNotification(true);
                setLoad(false);
                console.log(e);
            }
        };
        fetchData();
    }

    // * Hàm update category
    const handleUpdateCategory = (category) => {
        const fetchData = async () => {
            try {
                const data = await updateCategory(category);
                if (data) {
                    setErrors({});
                    setNotificationStatus('updateIsSuccess');
                    setCloseNotification(true);
                    setLoad(true);
                } else {
                    setErrors({});
                    setNotificationStatus('updateIsFail');
                    setCloseNotification(true);
                    setLoad(false);
                }
            } catch (e) {
                setErrors({});
                setNotificationStatus('updateIsFail');
                setCloseNotification(true);
                setLoad(false);
                console.log(e);
            }
        }
        fetchData();
    };

    // * tắt form
    const handleCloseForm = () => {
        if (load) {
            window.location.reload();
        } else {
            onClose();
        }
    };

    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const category = await getCategoryByID(categoryID);
                setCategory(category);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [categoryID])

    return (
        <div>
            <div className="bg_black">
                <div className="addnewbook category-form">
                    <div className="addnewbook-header">
                        {
                            keyForm === 'add' ? (
                                <h3>Thêm thể loại cho sách</h3>
                            ) : (
                                <h3>Thể loại sách</h3>
                            )
                        }
                        <FontAwesomeIcon onClick={handleCloseForm} style={{ cursor: 'pointer' }} className="faXmark" icon={faXmark}></FontAwesomeIcon>
                    </div>

                    <div className='category-form-input'>
                        <div className='category-form-input_item'>
                            <label htmlFor='ten_the_loai'>Tên thể loại <span>*</span></label>
                            <input
                                className='category-form-input_item_inp'
                                type='text'
                                value={category.ten_the_loai}
                                onChange={handleChangeCategory}
                                name='ten_the_loai'
                            />
                            {errors.ten_the_loai && <span className='notification-err'>Tên thể loại không hợp lệ!</span>}
                            {errors.trung_ten_the_loai && <span className='notification-err'>Tên thể loại đã tồn tại!</span>}

                        </div>
                        <div className='category-form-input_item'>
                            <label htmlFor='mo_ta_the_loai'>Mô tả thể loại <span>*</span></label>
                            <textarea
                                className='category-form-input_item_inp textarea-update'
                                type='text'
                                value={category.mo_ta_the_loai}
                                onChange={handleChangeCategory}
                                name='mo_ta_the_loai'
                            ></textarea>
                            {errors.mo_ta_the_loai && <span className='notification-err'>Mô tả không hợp lệ!</span>}
                        </div>
                        {
                            keyForm === 'add' && (
                                <div className='category-form-button'>
                                    <button className='btn-add-category' onClick={handleCloseForm}>Hủy</button>
                                    <button className='btn-add-category' onClick={handleCheckInsertCategory}>Tạo mới</button>
                                </div>
                            )
                        }
                        {
                            keyForm === 'edit' && (
                                <div className='category-form-button'>
                                    <button className='btn-add-category' onClick={handleCloseForm}>Hủy</button>
                                    <button className='btn-add-category' onClick={handleCheckUpdateCategory}>Cập nhật</button>
                                </div>
                            )
                        }
                    </div>
                </div>


                {notificationStatus === 'insertIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title="Tạo thể loại"
                            description={`"Thành công."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'insertIsFail' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="error"
                            title="Tạo thể loại"
                            description={`"Thể loại đã tồn tại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'updateIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title="Cập nhật"
                            description={`"Cập nhật thể loại thành công."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'updateIsFail' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="error"
                            title="Cập nhật"
                            description={`"Cập nhật thể loại thất bại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default CategoryForm;