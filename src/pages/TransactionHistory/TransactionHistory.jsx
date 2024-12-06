import React, { useEffect, useState } from 'react';

import './TransactionHistory.css'
import ListTransaction from '../../utils/ManageListUI/ListTransaction';
import { addTaiKhoanNganHang, getAllBank, getTaiKhoanNganHangByStore, updateTaiKhoanNganHang } from '../../utils/API/BankAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';

import { getCuaHangById, updateCuaHang } from '../../utils/API/StoreAPI';
import NotificationUI from '../../utils/Notification/NotificationUI';
import { addGiaoDich, createQRCode, getAllGiaoDichByStore, getAllGiaoDichByStoreLength, getGiaoDichByCuaHangAndTrangThai, getGiaoDichByCuaHangAndTrangThaiLength } from '../../utils/API/GiaoDichAPI';

const TransactionHistory = () => {
    const [giaoDichByStore, setGiaoDichByStore] = useState([]);

    // * Tài khoản ngân hàng của tôi
    // const [myBankAccount, setMyBankAccount] = useState({});

    const [bankList, setBankList] = useState([]);

    const [store, setStore] = useState({});

    const [code, setCode] = useState('');
    const [cardNumber, setCardNumber] = useState('************');
    // const [iconBank, setIconBank] = useState('');
    const [isForm, setIsForm] = useState(false);

    // * lưu thông tin ngân hàng
    const [bankInfo, setBankInfo] = useState({});

    // * lưu thông tin giao dịch
    // const [giaoDich, setGiaoDich] = useState({});

    const [allGiaoDich, setAllGiaoDich] = useState(0);
    const [giaoDichCho, setGiaoDichCho] = useState(0);
    const [giaoDichDuyet, setGiaoDichDuyet] = useState(0);
    const [giaoDichHuy, setGiaoDichHuy] = useState(0);

    // * Hiển thị thông báo
    const [notificationStatus, setNotificationStatus] = useState('');
    const [closeNotification, setCloseNotification] = useState(true);

    const [money, setMoney] = useState();

    // * check tài khoản
    const [checkResult, setCheckResult] = useState('Chưa có tài khoản');

    const handleClickChangeForm = () => {
        setIsForm(!isForm);
    }

    const [eye, setEye] = useState(false);
    const handleToggleEye = () => {
        setEye(!eye);
    }

    // *Hàm close notification
    const handleCloseNotification = () => {
        setCloseNotification(false);
        setNotificationStatus('')
    }

    const [textRutTien, setTextRutTien] = useState(false);
    // * nhập tiền cần rút
    const handleCardNumberChangeMoney = (event) => {
        const rutTienNumber = event.target.value;

        if (rutTienNumber <= store.doanh_thu) {
            setMoney(event.target.value);
            setTextRutTien(false);
        } else {
            setMoney(event.target.value);
            setTextRutTien(true);
        }

    };

    // * Số tài khoản ngân hàng
    const handleCardNumberChange = (event) => {
        const input = event.target.value.replace(/\D/g, '');
        setCardNumber(input);
        setBankInfo(
            prevBank => (
                {
                    ...prevBank,
                    accountNo: input
                }
            )
        );
    };

    // * Lấy ra thông tin của ngân hàng
    const handleSelectChange = (event) => {
        const selectedBin = event.target.value;
        const selectedBank = bankList.find(bank => bank.bin === parseInt(selectedBin, 10));
        if (selectedBank) {
            setBankInfo(
                {
                    ...bankInfo,
                    acqId: selectedBank.bin,
                    addInfo: `Rút tiền - ${store.ma_cua_hang} - ${store.ten_cua_hang}`,
                    fomat: "text",
                    template: "compact2",
                    nameBank: selectedBank.name,
                    code: selectedBank.code,
                    icon_url: selectedBank.icon_url,
                    cua_hang: store
                }

            );
            setCode(selectedBank.code);
            // setIconBank(selectedBank.icon_url);
        } else {
            setCode('');
            // setIconBank('');
        }
    };

    // * Kiểm tra tài khoản ngân hàng khi nhấn nút
    const handleSaveAccountInfo = async (key) => {
        try {
            const response = await axios.post(
                'https://api.httzip.com/api/bank/id-lookup-prod',
                {
                    bank: code,
                    account: cardNumber
                },
                {
                    headers: {
                        'x-api-key': '85f58718-56a1-46d7-b7d9-af9e1cc32a53key',
                        'x-api-secret': '68a8b830-839b-4b82-8c9c-574718c48f6bsecret',
                        // 'Content-Type': 'application/json'
                    }
                }
            );

            if (response && response.data && response.data.data && response.data.data.ownerName) {
                // Cập nhật thông tin tài khoản vào bankInfo
                setBankInfo(prevBank => ({
                    ...prevBank,
                    account_name: response.data.data.ownerName
                }));
                setCheckResult(response.data.data.ownerName);
                setNotificationStatus('searchIsSuccess');

                // Gọi hàm thêm tài khoản ngân hàng sau khi có kết quả tìm kiếm
                if (key === 'add') {
                    handleAddBankAccount({
                        ...bankInfo,
                        account_name: response.data.data.ownerName
                    });
                } else if (key === 'update') {
                    handleUpdateBankAccount({
                        ...bankInfo,
                        account_name: response.data.data.ownerName
                    });
                }

            } else {
                setCheckResult('Không tìm thấy tài khoản');
                setNotificationStatus('searchIsFail');
            }
        } catch (error) {
            console.error('Error checking bank account:', error);
            setCheckResult('Không tìm thấy tài khoản');
            setNotificationStatus('searchIsFail');
        }
    };

    // * Hàm thêm tài khoản ngân hàng mới
    const handleAddBankAccount = async (data) => {
        try {
            const account = await addTaiKhoanNganHang(data);
            if (account) {
                setBankInfo(account);
                setNotificationStatus('addIsSuccess');
                window.location.reload(); // Reload sau khi thêm thành công
            }
        } catch (e) {
            setNotificationStatus('addIsFail');
            console.error('Error adding bank account:', e);
        }
    };

    // * Hàm cập nhật tài khoản ngân hàng mới
    const handleUpdateBankAccount = async (data) => {
        try {
            const account = await updateTaiKhoanNganHang(data);
            if (account) {
                setBankInfo(account);
                setNotificationStatus('addIsSuccess');
                window.location.reload(); // Reload sau khi thêm thành công
            }
        } catch (e) {
            setNotificationStatus('addIsFail');
            console.error('Error adding bank account:', e);
        }
    };

    // * Hàm tạo dữ liệu và QR code
    const handleCreateQRCode = async (data) => {
        if (data && money) { // Kiểm tra data và money
            const qrCode = {
                accountNo: data.accountNo,
                accountName: data.account_name,
                acqId: data.acqId,
                amount: money,
                addInfo: data.addInfo,
                format: data.fomat,
                template: data.template,
            };
            const updatedDoanhThu = store.doanh_thu - money;
            const dataUpdate = { ...store, doanh_thu: updatedDoanhThu }

            try {
                const qrDataURL = await createQRCode(qrCode);
                handleAddGiaoDich(qrDataURL.data.qrDataURL, data);
                handleTruDoanhThuCuaHang(dataUpdate);
                setNotificationStatus('giaoDichIsSuccess');
                window.location.reload();
            } catch (error) {
                setNotificationStatus('giaoDichIsFail');
                console.error("Lỗi khi tạo QR Code:", error);
            }
        } else {
            console.warn("Thiếu dữ liệu hoặc số tiền không hợp lệ");
        }
    };

    // * Hàm thêm giao dịch vào database
    const handleAddGiaoDich = async (qrData, dataGiaoDich) => {
        if (dataGiaoDich && money) {
            const giaoDichMoi = {
                so_tien: money,
                trang_thai: 0,
                anh_qr: qrData,
                mo_ta: dataGiaoDich.addInfo,
                cua_hang: store,
            };

            try {
                const response = await addGiaoDich(giaoDichMoi);
                // setGiaoDich(response);
            } catch (error) {
                console.error("Lỗi khi thêm giao dịch:", error);
            }
        } else {
            console.warn("Thiếu dữ liệu giao dịch hoặc số tiền không hợp lệ");
        }
    };

    // * Hàm trừ doanh thu của cửa hàng khi rút tiền
    const handleTruDoanhThuCuaHang = async (dataUpdate) => {
        try {
            const storeDataUpdate = await updateCuaHang(dataUpdate);
            if (storeDataUpdate) {
                setStore(storeDataUpdate);
            }
        } catch (e) {
            console.error('Lỗi khi update doanh thu:', e);
        }
    };

    // * giao dịch all
    const handleGetGiaoDichStore = async () => {
        try {
            const data = await getAllGiaoDichByStore();
            setGiaoDichByStore(data);
        } catch (e) {
            console.log(e);
        }
    }

    // * list giao dịch theo trạng thái
    const handleGetGiaoDichTrangThaiStore = async (trangThai) => {
        try {
            const data = await getGiaoDichByCuaHangAndTrangThai(trangThai);
            setGiaoDichByStore(data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const myBank = await getTaiKhoanNganHangByStore();
                setBankInfo(myBank);
                if (myBank) {
                    setIsForm(true);
                }

                const data = await getAllBank();
                setBankList(data);

                const storeData = await getCuaHangById();
                setStore(storeData);

                const allGiaoDichLength = await getAllGiaoDichByStoreLength()
                setAllGiaoDich(allGiaoDichLength);
                const choLength = await getGiaoDichByCuaHangAndTrangThaiLength(0);
                setGiaoDichCho(choLength);
                const duyetLength = await getGiaoDichByCuaHangAndTrangThaiLength(1);
                setGiaoDichDuyet(duyetLength);
                const huyLength = await getGiaoDichByCuaHangAndTrangThaiLength(2);
                setGiaoDichHuy(huyLength);

                const dataGiaoDich = await getAllGiaoDichByStore();
                setGiaoDichByStore(dataGiaoDich);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="page scroll-container">
            <div className="container">

                <div className='nganhang'>
                    <div className='credit-card'>
                        <div className='credit-card-bg'>
                            <img src='/images/betabg.svg' alt='bg' />
                        </div>
                        <div className='credit-card-card'>
                            <img src='/images/cardmaster.png' alt='creditcard' />
                            <div className='credit-card-card_item'>
                                <p>SỐ TÀI KHOẢN</p>
                                {/* {
                                    myBankAccount ? (
                                        <h2>{myBankAccount.accountNo}</h2>
                                    ) : ( */}
                                <h2>{bankInfo ? bankInfo.accountNo : '************'}</h2>
                                {/* )
                                } */}
                            </div>
                            <div className='credit-card-card_item2'>
                                {
                                    bankInfo && (
                                        <img className='credit-card-card_item2_img' src={bankInfo.icon_url} alt={bankInfo.nameBank} />
                                    )
                                }
                                <h1>{bankInfo.code || ''} Bank</h1>
                            </div>
                            <div className='credit-card-card_item3'>
                                <p>{bankInfo.account_name || checkResult}</p>
                            </div>
                        </div>

                        <div className={`cash-button ${isForm ? 'cash-button-update' : ''}`} onClick={handleClickChangeForm}>
                            {
                                isForm === true ? (
                                    <>
                                        <FontAwesomeIcon className='cash-button-icon' icon={faCreditCard}></FontAwesomeIcon>
                                        <h3>Card</h3>
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon className='cash-button-icon' icon={faSackDollar}></FontAwesomeIcon>
                                        <h3>Rút tiền</h3>
                                    </>
                                )
                            }

                        </div>

                        {
                            isForm === true ? (
                                <div className='form-card'>
                                    <div className='credit-card-info-title'>
                                        <h2>Rút tiền về tài khoản</h2>
                                    </div>

                                    <div className='credit-card-info'>
                                        <div className='my_cash' onClick={handleToggleEye}>
                                            {
                                                eye ? (
                                                    <h2> Số dư: {store.doanh_thu ? store.doanh_thu.toLocaleString('vi-VN') : 0} VNĐ</h2>
                                                ) : (
                                                    <h2> Số dư: <strong>*******</strong> VNĐ</h2>
                                                )
                                            }

                                            {/* <FontAwesomeIcon icon={faEye}></FontAwesomeIcon> */}
                                        </div>
                                        <div className='credit-card-info_item credit-card-info_item_update'>
                                            <label>SỐ TIỀN CẦN RÚT</label>
                                            <input
                                                className='item-number-card'
                                                style={{ textAlign: 'center' }}
                                                type='text'
                                                value={money}
                                                onChange={handleCardNumberChangeMoney}
                                                maxLength={10} //
                                            />
                                            <label className='vnd-css'>VNĐ</label>
                                            {
                                                textRutTien ? (
                                                    <p className='err-text'>Số dư của bạn không đủ!</p>
                                                ) : (
                                                    <></>
                                                )
                                            }
                                        </div>
                                        <div className='credit-card-info_item credit-card-info_item_flex' style={{ marginTop: '30px' }}>
                                            <input
                                                id='my-card'
                                                className='radio-number-card'
                                                type='radio'
                                                checked={bankInfo ? true : false}
                                            />
                                            <label htmlFor='my-card'>Số tài khoản của tôi</label>

                                        </div>
                                        {/* <p className='radio-number-card_err'>Bạn chưa có tài khoản nhận tiền. <span>Hãy tạo ngay</span></p> */}
                                    </div>
                                    <div className='credit-card-info-save credit-card-info-save_cash'>
                                        {
                                            textRutTien ? (
                                                <button>RÚT TIỀN</button>
                                            ) : (
                                                <button onClick={() => handleCreateQRCode(bankInfo)}>RÚT TIỀN</button>
                                            )
                                        }

                                    </div>
                                </div>
                            ) : (
                                <div className='form-card'>
                                    <div className='credit-card-info-title'>
                                        <h2>Tài khoản nhận tiền</h2>
                                    </div>
                                    <div className='credit-card-info'>
                                        <div className='credit-card-info_item'>
                                            <label>TÊN NGÂN HÀNG</label>
                                            <select
                                                value={bankInfo.acqId || ''}
                                                onChange={handleSelectChange}>
                                                <option value="">Chọn ngân hàng của bạn</option>
                                                {bankList.map(bank => (
                                                    <option key={bank.id} value={bank.bin}>
                                                        {bank.code} - {bank.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='credit-card-info_item ' style={{ marginTop: '30px' }}>
                                            <label>SỐ TÀI KHOẢN</label>
                                            <input
                                                className='item-number-card'
                                                style={{ textAlign: 'center' }}
                                                type='text'
                                                value={bankInfo.accountNo || ''}
                                                onChange={handleCardNumberChange}
                                                maxLength={19} // Maximum length for 'xxxx xxxx xxxx xxxx'
                                                placeholder="************"
                                            />
                                        </div>
                                    </div>

                                    {
                                        bankInfo ? (
                                            <div className='credit-card-info-save'>
                                                <button onClick={() => handleSaveAccountInfo('update')}>Cập nhật tài khoản mới</button>
                                            </div>
                                        ) : (
                                            <div className='credit-card-info-save'>
                                                <button onClick={() => handleSaveAccountInfo('add')}>Lưu thông tin tài khoản</button>
                                            </div>
                                        )
                                    }


                                    {/* Hiển thị kết quả kiểm tra tài khoản */}
                                    {/* {checkResult && ( */}

                                    {/* )} */}
                                </div>
                            )
                        }

                    </div>
                    <div className='history'>

                    </div>
                </div>

                <div className="productbtn-list" style={{ marginTop: '30px' }}>
                    <button className="productbtn-item btn1 pointer-events-auto" onClick={handleGetGiaoDichStore}>
                        <p>Số giao dịch</p>
                        <h1>
                            {allGiaoDich}
                        </h1>
                    </button>
                    <button className="productbtn-item btn3 pointer-events-auto" onClick={() => handleGetGiaoDichTrangThaiStore(0)}>
                        <p>Đang xử lý</p>
                        <h1>
                            {giaoDichCho}
                        </h1>
                    </button>
                    <button className="productbtn-item btn4 pointer-events-auto" onClick={() => handleGetGiaoDichTrangThaiStore(1)}>
                        <p>Rút thành công</p>
                        <h1>
                            {giaoDichDuyet}
                        </h1>
                    </button>
                    <button className="productbtn-item btn2 pointer-events-auto" onClick={() => handleGetGiaoDichTrangThaiStore(2)}>
                        <p>Rút thất bại</p>
                        <h1>
                            {giaoDichHuy}
                        </h1>
                    </button>

                </div>

                <div>
                    <ListTransaction listBooks={giaoDichByStore} />
                </div>


                {notificationStatus === 'addIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title="Thêm tài khoản ngân hàng"
                            description={`"Thành công."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'addIsFail' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="error"
                            title="Thêm tài khoản ngân hàng"
                            description={`"Thất bại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'searchIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title="Tài khoản ngân hàng"
                            description={`"Thông tin tài khoản hợp lệ."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'searchIsFail' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="error"
                            title="Tài khoản ngân hàng"
                            description={`"Thông tin tài khoản không hợp lệ."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'giaoDichIsSuccess' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="success"
                            title="Tạo giao dịch"
                            description={`"Thành công."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}
                {notificationStatus === 'giaoDichIsFail' && closeNotification === true && (
                    <div>
                        <NotificationUI
                            type="error"
                            title="Tạo giao dịch"
                            description={`"Thất bại."`}
                            onClose={handleCloseNotification}
                            keyPage={"bookForm"}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default TransactionHistory;