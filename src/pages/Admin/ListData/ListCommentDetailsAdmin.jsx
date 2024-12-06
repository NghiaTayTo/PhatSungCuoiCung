import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { OverlayTrigger } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Pagination from '../../../utils/Pagination/Pagination';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faDeleteLeft } from "@fortawesome/free-solid-svg-icons";

import { renderTooltip } from '../../../utils/Order/ToolTip';
import StarRating from '../../../utils/Order/StarRating';
import ReportForm from '../../../utils/ReportForm/ReportForm';
import NotificationUI from '../../../utils/Notification/NotificationUI';

import { getPhanHoiDanhGiaByMaDanhGia, insertPhanHoiDanhGia, deletePhanHoiDanhGia } from '../../../utils/API/PhanHoiDanhGiaAPI';
import {StoreApi} from '../../../StoreId';


const ListCommentDetailsAdmin = ({ listComments = [], keySearch, searchName, rating }) => {

    // * Mảng các Sản phẩm
    const [commentList, setCommentList] = useState([]);
    // * Phân trang
    const [pagination, setPagination] = useState();
    // * Trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    // * Mỗi trang 10 sản phẩm
    const [selectedValue, setSelectedValue] = useState(10); // số lượng sản phẩm hiển thị mỗi trang

    // *Trang được chọn
    const indexOfLastItem = currentPage * selectedValue;
    const indexOfFirstItem = indexOfLastItem - selectedValue;
    // * Lưu mã đánh giá khi đc click
    const [commentID, setCommentID] = useState(null);
    // * Hàm xóa sản phẩm
    const [notificationStatus, setNotificationStatus] = useState('');
    const [storeId, setStoreId] = useState();
    // * Đóng thông báo
    const [closeNotification, setCloseNotification] = useState(true);
    // * Hàm change trong thẻ input phản hồi đánh giá
    const [contentPhanHoi, setContentPhanHoi] = useState('')
    // * Lưu phản hồi
    const [feedbacks, setFeedbacks] = useState({});
    // * Ẩn hiện form báo cáo
    const [showReportForm, setShowReportForm] = useState(false);
    // * Ẩn hiện input phản hồi
    const [showFeedbackInput, setShowFeedbackInput] = useState(null);

    //* click vào cái nào
    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    };

    // * Ẩn hiện input phản hồi
    const handleShowFeedbackInput = (commentId) => {
        const idComment = commentId;
        setCommentID(idComment);
        setShowFeedbackInput(commentId);
    };
    // * Comment được báo cáo
    const [reportedComments, setReportedComments] = useState([]);

    // * Ẩn hiện form báo cáo
    const handleShowReportForm = (commentId) => {
        setShowReportForm(true);
        setReportedComments(commentId);
    };
    const handleCloseReportForm = () => {
        setShowReportForm(false);
    };

    const currentProducts = Array.isArray(commentList)
        ? commentList.slice(indexOfFirstItem, indexOfLastItem)
        : [];



    // * Hàm change trong thẻ input phản hồi đánh giá
    const handleChangeContentPhanHoi = (e) => {
        setContentPhanHoi(e.target.value);
    }

    // * Đóng thông báo
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }


    // * Hàm thêm phản hồi đánh giá mới
    const handleInsertPhanHoiDanhGia = async (idcm, idch, date, content) => {
        setNotificationStatus(''); 
        setCloseNotification(true);
        if (content.length <= 0 || content === undefined || content === null) {
            setNotificationStatus('insertContentIsNull');
        } else {
            try {
                const phanHoiDanhGia = {
                    ngay_phan_hoi: date,
                    noi_dung_phan_hoi: content,
                    cua_hang: { ma_cua_hang: idch },
                    danh_gia: { ma_danh_gia: idcm }
                };

                const phanHoiDanhGiaNew = await insertPhanHoiDanhGia(phanHoiDanhGia);
                if (phanHoiDanhGiaNew) {
                    window.location.reload();
                    setNotificationStatus('insertOK');
                } else {
                    setNotificationStatus('insertNoOK');
                }
            } catch (e) {
                setNotificationStatus('insertNoOK');
                console.error(e);
            }
        }
    }

    // * Hàm xóa phản hồi đánh giá
    const handleDeletePhanHoiDanhGia = async (id) => {
        setNotificationStatus('');
        setCloseNotification(true);
        try {
            const result = await deletePhanHoiDanhGia(id);
            if (result) {
                window.location.reload();
                setNotificationStatus('deleteOK');
            } else {
                setNotificationStatus('deleteNoOK');
            }
        } catch (e) {
            setNotificationStatus('deleteNoOK');
            console.error(e);
        }
    }

    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng từ 0-11, nên +1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    

    const tableRows = currentProducts.map((comment, index) => {
        const feedback = feedbacks[comment.ma_danh_gia];
        return (
            <>
                {
                    feedback && (
                        <div className='comment' key={index}>
                            <div className='comment-flex'>
                                <div>
                                    <div className='comment-account'>
                                        <div className='comment-account_img'>
                                            <img src={`/images/avt6.jpg`} alt="book" />
                                        </div>
                                        <div style={{ marginLeft: '15px' }}>
                                            <p className='comment-account_name'>{comment.tai_khoan_danh_gia?.ho_ten}</p>
                                            <StarRating rating={comment.diem_danh_gia} />
                                            <p className='comment-account_date'>{comment.ngay_danh_gia} | Số lượng mua: {comment.don_hang_chi_tiet?.so_luong}</p>
                                        </div>
                                    </div>
                                    <div className='comment-content'>
                                        <p>{comment.noi_dung_danh_gia}</p>
                                        {/* <p>mấy thằng cảnh sát không phải cha, nó lấy tiền vào vào tiệp tạp hóa mua bao cao su. Có nhỏ kia nó lấy chồng Trung Quốc, có bầu rồi đẻ ở bên bển luôn.</p> */}
                                    </div>
                                </div>
                                <div className='comment-report'>
                                    <FontAwesomeIcon icon={faEllipsisVertical} className='faEllipsisVertical'></FontAwesomeIcon>
                                    <button onClick={() => handleShowReportForm(comment.ma_danh_gia)} className='comment-report_btn'>Báo cáo</button>
                                </div>
                            </div>

                            <div className='seller-feedback'>
                                <div className='seller-feedback_flex'>
                                    <div className='comment-account_img comment-account_img-update'>
                                        <img src={`${feedback.cua_hang?.anh_dai_dien}`} alt="book" />
                                    </div>
                                    <div className='seller-feedback_info'>
                                        <strong>{feedback.cua_hang?.ten_cua_hang}</strong>
                                        <p>{feedback.ngay_phan_hoi}</p>
                                    </div>
                                </div>
                                <div className='seller-feedback_content'>
                                    <p>{feedback.noi_dung_phan_hoi}</p>
                                </div>
                                {/* <OverlayTrigger
                                    key={index}
                                    placement="right"
                                    overlay={(props) => renderTooltip(props, 'Xóa phản hồi', 'tooltip-del-feedback')}
                                >
                                    <FontAwesomeIcon onClick={() => handleDeletePhanHoiDanhGia(feedback.ma_phan_hoi)} className='delete-feedback' icon={faDeleteLeft}></FontAwesomeIcon>
                                </OverlayTrigger> */}

                            </div>

                        </div>
                    )
                }

                {
                    !feedback && (
                        // <OverlayTrigger
                        //     key={index}
                        //     placement="right"
                        //     overlay={(props) => renderTooltip(props, 'Bấm vào đánh giá để phản hồi', 'tooltip2')}
                        // >
                            <div onClick={() => handleShowFeedbackInput(comment.ma_danh_gia)} className='comment comment-cursor_default' key={index}>
                                <div className='comment-flex'>
                                    <div>
                                        <div className='comment-account'>
                                            <div className='comment-account_img'>
                                                <img src={`/images/avt6.jpg`} alt="book" />
                                            </div>
                                            <div style={{ marginLeft: '15px' }}>
                                                <p className='comment-account_name'>{comment.tai_khoan_danh_gia?.ho_ten}</p>
                                                {/* <p className='comment-account_name'>{comment.ma_danh_gia}</p> */}
                                                <StarRating rating={comment.diem_danh_gia} />
                                                <p className='comment-account_date'>{comment.ngay_danh_gia} | Số lượng mua: {comment.don_hang_chi_tiet?.so_luong}</p>
                                            </div>
                                        </div>
                                        <div className='comment-content'>
                                            <p>{comment.noi_dung_danh_gia}</p>
                                            {/* <p>mấy thằng cảnh sát không phải cha, nó lấy tiền vào vào tiệp tạp hóa mua bao cao su. Có nhỏ kia nó lấy chồng Trung Quốc, có bầu rồi đẻ ở bên bển luôn.</p> */}
                                        </div>
                                    </div>
                                    <div className='comment-report'>
                                        <FontAwesomeIcon icon={faEllipsisVertical} className='faEllipsisVertical'></FontAwesomeIcon>
                                        <button onClick={() => handleShowReportForm(comment.ma_danh_gia)} className='comment-report_btn'>Báo cáo</button>
                                    </div>
                                </div>
                                {/* {!feedback && showFeedbackInput === comment.ma_danh_gia && (
                                    <div className='reply'>
                                        <input
                                            value={contentPhanHoi}
                                            placeholder='Phản hồi khách hàng của bạn (không bắt buộc)'
                                            onChange={handleChangeContentPhanHoi}
                                        />
                                        <button onClick={() => handleInsertPhanHoiDanhGia(commentID, storeId, formatDateTime(new Date()), contentPhanHoi)}>Gửi</button>
                                    </div>
                                )} */}

                            </div>
                        // </OverlayTrigger>
                    )
                }


            </>

        )
    });

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)

        console.log(currentPage);
    }

    // useEffect(() => {
    //     setProductCount(listBooks.length);
    // }, [productCount]);

    // *Tổng số trang (số lượng sản phẩm / 10)
    useEffect(() => {
        // console.log('books' + listComments);
        const idStore = StoreApi();
        const totalProducts = listComments.length;
        setCommentList(listComments)
        setPagination(Math.ceil(totalProducts / selectedValue)); // số trang tổng cộng
        setStoreId(idStore);
    }, [selectedValue, listComments]);

    useEffect(() => {
        // Hàm lấy phản hồi cho từng đánh giá trong listComments
        const fetchFeedbacks = async () => {
            const newFeedbacks = {};
            for (let comment of listComments) {
                try {
                    const feedback = await getPhanHoiDanhGiaByMaDanhGia(comment.ma_danh_gia);
                    if (feedback) {
                        newFeedbacks[comment.ma_danh_gia] = feedback; // Gắn phản hồi vào `newFeedbacks`
                    }
                } catch (error) {
                    console.error('Error fetching feedback:', error);
                }
            }
            setFeedbacks(newFeedbacks); // Cập nhật state với tất cả các phản hồi

        };

        fetchFeedbacks();

    }, [listComments]);

    return (
        <div className='update-width-list'>
            {/* hiển thị danh sách sản phẩm */}
            <div className="product-list">

                {
                    commentList.length > 0
                        ?
                        (
                            <div className="product-list_pages">
                                <span>Hiển thị</span>
                                <select id="disabledSelect" className="form-select"
                                    value={selectedValue} onChange={handleSelectChange}>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <span style={{ color: "#757B82" }}>Trang {currentPage} - {pagination}</span>
                            </div>
                        )
                        :
                        ''
                }



                {/* danh sách sản phẩm */}
                {
                    commentList.length > 0 ?
                        (
                            <div className="table-container">
                                {tableRows}
                            </div>
                        )
                        :
                        (
                            <div className='notification-notstore notification-notstore_update'>
                                {
                                    keySearch === 'searchIsNull'
                                        ? (<img className='storenotbook-notsearch' src={`/images/searchnotbook.png`} alt="Không tìm thấy sản phẩm." />)
                                        : (<img className='storenotbook' src={`/images/star.png`} alt="Hãy tạo sản phẩm đầu tiên của bạn." />)
                                }

                                <div>
                                    {
                                        keySearch === 'searchIsNull'
                                            ? (<h3 style={{ bottom: '0' }}>Không tìm thấy sản phẩm<strong>{searchName ? `: ${searchName}` : ''}</strong>.</h3>)
                                            : (<h3>
                                                {
                                                    rating === 'all' ? (
                                                        <>
                                                            Sản phẩm này chưa có đánh giá.
                                                        </>
                                                    ) : (
                                                        <>
                                                            Sản phẩm này không có đánh giá {rating}.
                                                        </>
                                                    )
                                                }
                                            </h3>)
                                    }

                                </div>
                            </div>
                        )
                }

            </div>

            {
                commentList.length > 10
                    ?
                    (
                        /* <FontAwesomeIcon className='pagination-icon' icon={faAngleLeft}></FontAwesomeIcon> */
                        < Pagination totalPages={pagination} onPageChange={handlePageChange}></Pagination>
                        /* <FontAwesomeIcon className='pagination-icon' icon={faAngleRight}></FontAwesomeIcon> */
                    )
                    : ''
            }

            {/* {
                notificationDelAll && (
                    <Notification
                        title={'Xóa sản phẩm'}
                        content={'Bạn muốn xóa các sản phẩm đã chọn?'}
                        onClose={handleCloseDelAll}
                        onApply={handleApplyDelAll} />

                )
            } */}

            {
                showReportForm && (
                    <ReportForm onClose={handleCloseReportForm} />
                )
            }
            {notificationStatus === 'insertOK' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="success"
                        title="Gửi phản hồi"
                        description={`"Thành công"`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
            {notificationStatus === 'insertNoOK' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="error"
                        title="Gửi phản hồi"
                        description={`"Thất bại"`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
            {notificationStatus === 'insertContentIsNull' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="error"
                        title="Gửi phản hồi"
                        description={`"Bạn chưa điền nội dung!"`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
            {notificationStatus === 'deleteOK' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="success"
                        title="Xóa phản hồi"
                        description={`"Xóa phản hồi thành công"`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}
            {notificationStatus === 'deleteNoOK' && closeNotification === true && (
                <div>
                    <NotificationUI
                        type="error"
                        title="Xóa phản hồi"
                        description={`"Xóa phản hồi thất bại"`}
                        onClose={handleCloseNotification}
                        keyPage={"bookForm"}
                    />
                </div>
            )}

        </div >
    );
};

export default ListCommentDetailsAdmin;