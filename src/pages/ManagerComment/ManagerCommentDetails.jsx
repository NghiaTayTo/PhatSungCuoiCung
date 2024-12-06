import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import "./ManagerComment.css";
import "../ManageProduct/ManageProduct.css";

import ListCommentDetails from "../../utils/ManageListUI/ListCommentDetails";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";

import { getListCommentByBookID, countCommentByBookID, searchCommentByBookIDAndRating } from "../../utils/API/DanhGiaAPI";
import { getSanPhamById } from "../../utils/API/ProductAPI";
import Loading from '../../utils/Order/Loading';


const ManagerCommentDetails = () => {
    const location = useLocation();
    const bookID = location.state?.bookID;
    // * Hiển thị loading
    const [isLoading, setIsLoading] = useState(true);

    // * lưu comments
    const [comments, setComments] = useState([]);
    const [product, setProduct] = useState([]);

    // * Đếm số lượt đánh giá theo mã sản phẩm
    const [countComment, setCountComment] = useState(0);
    const [fiveStar, setFiveStar] = useState(0);
    const [fourStar, setFourStar] = useState(0);
    const [threeStar, setThreeStar] = useState(0);
    const [twoStar, setTwoStar] = useState(0);
    const [oneStar, setOneStar] = useState(0);

    const [selectedButton, setSelectedButton] = useState('all'); // Khởi tạo trạng thái với giá trị mặc định là 'all'
    const [rating, setRating] = useState('')
    // Hàm xử lý sự kiện bấm button
    const handleButtonClick = (buttonId) => {
        setSelectedButton(buttonId); // Cập nhật trạng thái với button được chọn

        if (buttonId === 'all') {
            fetchAllRatingData();
            setRating('all')
        } else if (buttonId === '5star') {
            fetchDataByRating(5);
            setRating('5 sao')
        } else if (buttonId === '4star') {
            fetchDataByRating(4);
            setRating('4 sao')
        } else if (buttonId === '3star') {
            fetchDataByRating(3);
            setRating('3 sao')
        } else if (buttonId === '2star') {
            fetchDataByRating(2);
            setRating('2 sao')
        } else {
            fetchDataByRating(1);
            setRating('1 sao')
        }
    };

    // * Lấy tất cả sản phẩm
    const fetchAllRatingData = async () => {
        try {
            const listComment = await getListCommentByBookID(bookID);
            setComments(listComment);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const fetchDataByRating = async (starNumber) => {
        try {
            const listComment = await searchCommentByBookIDAndRating(bookID, starNumber);
            setComments(listComment);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };
    // '/seller/manage-comment'

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            if (!bookID) return;

            try {
                const productData = await getSanPhamById(bookID);
                setProduct(productData);

                const listComment = await getListCommentByBookID(bookID);
                setComments(listComment);

                const countCommentData = await countCommentByBookID(bookID);
                setCountComment(countCommentData);

                const fiveStarData = listComment.filter(comment => comment.diem_danh_gia === 5).length;
                setFiveStar(fiveStarData);

                const fourStarData = listComment.filter(comment => comment.diem_danh_gia === 4).length;
                setFourStar(fourStarData);

                const threeStarData = listComment.filter(comment => comment.diem_danh_gia === 3).length;
                setThreeStar(threeStarData);

                const twoStarData = listComment.filter(comment => comment.diem_danh_gia === 2).length;
                setTwoStar(twoStarData);

                const oneStarData = listComment.filter(comment => comment.diem_danh_gia === 1).length;
                setOneStar(oneStarData);

            } catch (error) {
                console.error("Error fetching data:", error);
            }

            setIsLoading(false); // Cập nhật lại isLoading sau khi kết thúc độ trễ
        };

        fetchData();
    }, [bookID]);

    return (
        <div className="page scroll-container">
            <div className="container">

                {
                    isLoading === true ? (
                        <Loading />
                    ) : (
                        <>
                            <div className="backtoComment" onClick={handleBackClick}>
                                <FontAwesomeIcon icon={faAnglesLeft}></FontAwesomeIcon>
                            </div>
                            <div className="info-book-header">
                                <div className="info-book-header_img">
                                    <img src={`${product.anh_san_pham}`} alt="book" />
                                </div>
                                <div className="info-book-header_info">
                                    <h1>{product.ten_san_pham}</h1>
                                    <div>
                                        <div className="info-book-header_info_item">
                                            <p><strong>Tác giả</strong>: {product.tac_gia}</p>
                                            <p><strong>Số lượng hàng</strong>: {product.so_luong_hang}</p>
                                            <p><strong>Đã bán</strong>: {product.da_ban}</p>
                                            <p><strong>Còn hàng</strong>: {product.con_hang}</p>

                                        </div>
                                        <div className="info-book-header_info_item update-item-position">
                                            <p><strong>Thể loại</strong>: {product.the_loai?.ten_the_loai}</p>
                                            <p><strong>Lượt đánh giá</strong>: {countComment}</p>
                                            <p className="info-book-header_info_item_danhgia"><strong>Điểm đánh giá</strong>: {Math.round(product.diem_trung_binh * 10) / 10} / 5</p>
                                            <h2 className="info-book-header_info_item_gia">{product.gia ? product.gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 0}</h2>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Add your code here */}

                            <div className="display-update">
                                <ListCommentDetails listComments={comments} rating={rating} />

                                <div className="comment-search">
                                    <div className="comment-search-title">
                                        <h1>{Math.round(product.diem_trung_binh * 10) / 10}</h1>
                                        <p>trên 5</p>
                                    </div>
                                    <button
                                        id={selectedButton === 'all' ? 'search-comment-choose' : undefined}
                                        onClick={() => handleButtonClick('all')}
                                    >
                                        Tất cả ({countComment})
                                    </button>
                                    <button
                                        id={selectedButton === '5star' ? 'search-comment-choose' : undefined}
                                        onClick={() => handleButtonClick('5star')}
                                    >
                                        5 Sao ({fiveStar})
                                    </button>
                                    <button
                                        id={selectedButton === '4star' ? 'search-comment-choose' : undefined}
                                        onClick={() => handleButtonClick('4star')}
                                    >
                                        4 Sao ({fourStar})
                                    </button>
                                    <button
                                        id={selectedButton === '3star' ? 'search-comment-choose' : undefined}
                                        onClick={() => handleButtonClick('3star')}
                                    >
                                        3 Sao ({threeStar})
                                    </button>
                                    <button
                                        id={selectedButton === '2star' ? 'search-comment-choose' : undefined}
                                        onClick={() => handleButtonClick('2star')}
                                    >
                                        2 Sao ({twoStar})
                                    </button>
                                    <button
                                        id={selectedButton === '1star' ? 'search-comment-choose' : undefined}
                                        onClick={() => handleButtonClick('1star')}
                                    >
                                        1 Sao ({oneStar})
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
            </div>
        </div>
    );
};

export default ManagerCommentDetails;
