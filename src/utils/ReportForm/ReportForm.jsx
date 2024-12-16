import React, { useEffect, useState } from 'react';
import './ReportForm.css';
import { getAllViPham, getViPhamById } from '../API/ViPhamAPI';
import { getCommentById } from '../API/DanhGiaAPI';
import { addBaoCaoCuaHang } from '../API/BaoCaoAPI';

import { NotificationContainer, NotificationManager } from 'react-notifications';


const ReportForm = ({ IDComment, taiKhoanBiBaoCao = {}, cuaHangBaoCao = {}, onClose }) => {

    const [selectedOption, setSelectedOption] = useState(''); // Theo dõi lựa chọn của người dùng
    const [otherText, setOtherText] = useState(''); // Lưu trữ nội dung khi chọn "Vi phạm khác"
    const [reportContent, setReportContent] = useState(''); // Lưu trữ nội dung báo cáo
    const [reportBtn, setReportBtn] = useState(false);


    // * List Vi phạm
    const [listViPham, setListViPham] = useState([]); //
    // * Một đối tượng vi phạm
    const [viPham, setViPham] = useState({});
    // * Đối tượng đánh giá
    const [comment, setComment] = useState({});

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        setReportBtn(true);
    };

    const viPhamRows = listViPham.map((viPham, index) => {
        return (
            <div key={index}>
                <input
                    type='radio'
                    id={`option-${viPham.id_vi_pham}`}
                    name='report'
                    value={viPham.id_vi_pham !== 7 ? viPham.id_vi_pham : 'Vi phạm khác'}
                    onChange={handleOptionChange}
                // checked={selectedOption === viPham.id_vi_pham} 
                />
                <label htmlFor={`option-${viPham.id_vi_pham}`}>{viPham.ten_vi_pham}</label>
            </div>
        );
    });

    // * Hàm thêm báo cáo mới
    // const handleAddReport = () => {
    //     if (selectedOption !== "Vi phạm khác") {
    //         handleGetViPhamById(selectedOption)
    //     } else if (selectedOption === "Vi phạm khác") {
    //         if (otherText.length > 0 || otherText !== null) {
    //             alert(selectedOption)
    //         }
    //     }
    // };
    // * hàm lấy ra một vi phạm
    // const handleGetViPhamById = async (id) => {
    //     try {
    //         const data = await getViPhamById(id);
    //         setViPham(data);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    const viPhamKhac = {
        id_vi_pham: 7,
        ten_vi_pham: 'Vi phạm khác',
        diem_vi_pham: 2
    }

    const trangThaiBaoCao = {
        id_trang_thai_bao_cao: 1,
        ten_trang_thai_bao_cao: 'Đang xử lý'
    }

    // * hàm thêm báo cáo mới
    const handleAddReportNew = async () => {
        try {
            if (selectedOption === "Vi phạm khác") {
                if (otherText !== null) {
                    await addBaoCaoCuaHang({
                        cua_hang_bao_cao: cuaHangBaoCao,
                        tai_khoan_bi_bao_cao: taiKhoanBiBaoCao,
                        vi_pham: viPhamKhac,
                        noi_dung_vi_pham: otherText,
                        danh_gia: comment,
                        trang_thai_bao_cao: trangThaiBaoCao
                    });
                    // setNotificationStatus("addIsYes")
                    NotificationManager.success('Thành công', 'Gửi báo cáo');
                }
            } else {
                const dataViPham = await getViPhamById(selectedOption);
                await addBaoCaoCuaHang({
                    cua_hang_bao_cao: cuaHangBaoCao,
                    tai_khoan_bi_bao_cao: taiKhoanBiBaoCao,
                    vi_pham: dataViPham,
                    danh_gia: comment,
                    trang_thai_bao_cao: trangThaiBaoCao
                });
                // setNotificationStatus("addIsYes")
                NotificationManager.success('Thành công', 'Gửi báo cáo');
            }
        } catch (e) {
            // setNotificationStatus("addIsNo")
            NotificationManager.error('Thất bại', 'Gửi báo cáo');
            console.log(e);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllViPham();
                setListViPham(data);

                const danhGiaData = await getCommentById(IDComment);
                setComment(danhGiaData)
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, [IDComment, taiKhoanBiBaoCao, cuaHangBaoCao])




    return (
        <div className="bg_black">
            <div className="addnewbook update-form">
                <h3 className='update-form_title'>Báo cáo đánh giá này</h3>
                <p className='update-form_p'>Vui lòng chọn lý do báo cáo</p>

                <div className='update-form_inp'>
                    {viPhamRows}
                    {selectedOption === 'Vi phạm khác' && (
                        <div className='viphamkhac'>
                            <input
                                type='text'
                                placeholder='Vui lòng mô tả chi tiết vi phạm (bắt buộc)'
                                value={otherText}
                                onChange={(e) => setOtherText(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <div className='update-form_btn '>
                    <button onClick={onClose}>THOÁT</button>

                    {
                        selectedOption === 'Vi phạm khác' ? (
                            <button onClick={handleAddReportNew} className={otherText ? '' : 'btn_mo'}>Gửi</button>
                        ) : (
                            <button onClick={handleAddReportNew} className={reportBtn ? '' : 'btn_mo'}>Gửi</button>
                        )
                    }

                </div>

            </div>

            <NotificationContainer />


        </div>
    );
};

export default ReportForm;