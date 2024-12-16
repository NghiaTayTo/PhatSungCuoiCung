import React, { useEffect, useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import Pagination from '../../../utils/Pagination/Pagination';
import { renderTooltip } from '../../../utils/Order/ToolTip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import WithdrawMoneyForm from '../FormDetailsAdmin/WithdrawMoneyForm';
import './ListData.css';

const ListWithdrawMoney = ({ listGiaoDich = [], keySearch }) => {

    const [selectedValue, setSelectedValue] = useState(10);

    const [giaoDichList, setGiaoDichList] = useState([]);
    const [pagination, setPagination] = useState();

    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * selectedValue;
    const indexOfFirstItem = indexOfLastItem - selectedValue;

    const [moneyID, setMoneyID] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const handleQRCode = (id) => {
        setMoneyID(id);
        setShowForm(true);
    }

    const handleCloseForm = () => {
        setShowForm(false);
        setMoneyID(null);
    }

    const getTrangThaiCSS = (id) => {
        if (id === 0) {
            return 'choduyet';
        } else if (id === 1) {
            return 'xong';
        } else {
            return 'huy';
        }
    }
    const getTrangThaiText = (id) => {
        if (id === 0) {
            return 'Chờ duyệt';
        } else if (id === 1) {
            return 'Đã rút tiền';
        } else {
            return 'Đã hủy';
        }
    }

    const currentProducts = Array.isArray(giaoDichList)
        ? giaoDichList.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    const tableRows = currentProducts.map((giaodich, index) => (

        giaodich.trang_thai === 0 ? (
            <OverlayTrigger
                key={index}
                placement="left"  // top, right, bottom, left)
                overlay={(props) => renderTooltip(props, 'Bấm vào để xem mã QR chuyển tiền', 'custom-tooltip')}
            >
                <tr key={index} onClick={() => handleQRCode(giaodich.id_gd)}>
                    <td style={{ width: '20px', textAlign: 'center' }}>
                        {/* <input
                    type="checkbox"
                    checked={isCheckedAll || checkedProducts[index]} // Checkbox cho từng sản phẩm
                    onChange={() => handleCheckProduct(index)}
                /> */}
                        <span style={{ marginTop: '3px' }}>{index + 1 + indexOfFirstItem}</span>
                    </td>
                    <td style={{ width: '120px', textAlign: 'center' }}>{giaodich.id_gd}</td>
                    <td style={{ width: '150px', textAlign: 'center' }}>{giaodich.cua_hang?.ten_cua_hang}</td>
                    <td style={{ width: '100px', textAlign: 'center' }}>Rút</td>
                    <td style={{ width: '150px', textAlign: 'center' }}>{giaodich.so_tien.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    <td style={{ width: '120px', textAlign: 'center' }}>{giaodich.ngay_giao_dich}</td>
                    <td style={{ width: '170px', textAlign: 'center' }}>{giaodich.mo_ta}</td>

                    <td style={{ width: '120px', textAlign: 'center', fontWeight: '500' }} >
                        <img src={`${giaodich.anh_qr}`} alt="QR Code" />
                    </td>

                    <td style={{ width: '120px', textAlign: 'center' }} className={getTrangThaiCSS(giaodich.trang_thai)}>{getTrangThaiText(giaodich.trang_thai)}</td>
                    <td style={{ width: '60px', textAlign: 'center' }}>
                        <button type="button" >
                            <FontAwesomeIcon icon={faEye} />
                        </button>
                        {/* <button onClick={() => handleShowDelBook(book.ten_san_pham, book.ma_san_pham)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                </button> */}
                    </td>
                </tr>
            </OverlayTrigger>
        ) : (

            <tr key={index} >
                <td style={{ width: '20px', textAlign: 'center' }}>
                    {/* <input
                    type="checkbox"
                    checked={isCheckedAll || checkedProducts[index]} // Checkbox cho từng sản phẩm
                    onChange={() => handleCheckProduct(index)}
                /> */}
                    <span style={{ marginTop: '3px' }}>{index + 1 + indexOfFirstItem}</span>
                </td>
                <td style={{ width: '120px', textAlign: 'center' }}>{giaodich.id_gd}</td>
                <td style={{ width: '150px', textAlign: 'center' }}>{giaodich.cua_hang?.ten_cua_hang}</td>
                <td style={{ width: '100px', textAlign: 'center' }}>Rút</td>
                <td style={{ width: '150px', textAlign: 'center' }}>{giaodich.so_tien.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                <td style={{ width: '120px', textAlign: 'center' }}>{giaodich.ngay_giao_dich}</td>
                <td style={{ width: '170px', textAlign: 'center' }}>{giaodich.mo_ta}</td>

                <td style={{ width: '120px', textAlign: 'center', fontWeight: '500' }} >
                    <img src="/images/giaodich.png" alt="QR Code" />
                </td>

                <td style={{ width: '120px', textAlign: 'center' }} className={getTrangThaiCSS(giaodich.trang_thai)}>{getTrangThaiText(giaodich.trang_thai)}</td>
                <td style={{ width: '60px', textAlign: 'center' }}>
                    <button type="button" >
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                    {/* <button onClick={() => handleShowDelBook(book.ten_san_pham, book.ma_san_pham)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                </button> */}
                </td>
            </tr>
        )
    )
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)

        console.log(currentPage);
    }
    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    };

    useEffect(() => {
        console.log('books' + listGiaoDich);

        const totalProducts = listGiaoDich.length;
        setGiaoDichList(listGiaoDich)
        setPagination(Math.ceil(totalProducts / selectedValue)); // số trang tổng cộng
    }, [selectedValue, listGiaoDich]);

    return (
        <div>
            <div className="product-list">

                {
                    giaoDichList.length > 0
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
                    giaoDichList.length > 0 ?
                        (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '20px', textAlign: 'center' }}>
                                                Stt
                                            </th>
                                            <th style={{ width: '120px', textAlign: 'center' }}>Mã giao dịch</th>
                                            <th style={{ width: '150px', textAlign: 'center' }}>Cửa hàng</th>
                                            <th style={{ width: '100px', textAlign: 'center' }}>Loại giao dịch</th>
                                            <th style={{ width: '150px', textAlign: 'center' }}>Số tiền</th>
                                            <th style={{ width: '120px', textAlign: 'center' }}>Ngày yêu cầu</th>
                                            <th style={{ width: '170px', textAlign: 'center' }}>Mô tả</th>
                                            <th style={{ width: '120px', textAlign: 'center' }}>QR Code</th>
                                            <th style={{ width: '120px', textAlign: 'center' }}>Trạng thái</th>
                                            <th style={{ width: '60px', textAlign: 'center' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ marginTop: '10px' }} className='load-info'>
                                        {tableRows}
                                    </tbody>
                                </table>


                            </div>
                        )
                        :
                        (
                            <div className='notification-notstore'>
                                {
                                    keySearch === 'searchIsNull'
                                        ? (<img className='storenotbook-notsearch giaodich_img' src={`/images/giaodich.png`} alt="Không tìm thấy sản phẩm." />)
                                        : (<img className='storenotbook giaodich_img' src={`/images/giaodich.png`} alt="Hãy tạo sản phẩm đầu tiên của bạn." />)
                                }

                                <div>
                                    {
                                        keySearch === 'searchIsNull'
                                            ? (<h3 style={{ bottom: '0' }}>Không tìm thấy giao dịch.</h3>)
                                            : (<h3 style={{ bottom: '-8px' }}>Hệ thống chưa có giao dịch.</h3>)
                                    }

                                </div>
                            </div>
                        )
                }

            </div>

            {
                giaoDichList.length > 0
                    ?
                    (
                        /* <FontAwesomeIcon className='pagination-icon' icon={faAngleLeft}></FontAwesomeIcon> */
                        < Pagination totalPages={pagination} onPageChange={handlePageChange}></Pagination>
                        /* <FontAwesomeIcon className='pagination-icon' icon={faAngleRight}></FontAwesomeIcon> */
                    )
                    : ''
            }

            {
                showForm && moneyID !== null && (
                    <WithdrawMoneyForm moneyID={moneyID} onClose={handleCloseForm} />
                )
            }
        </div>
    );
};

export default ListWithdrawMoney;