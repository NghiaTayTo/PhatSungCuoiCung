// PaymentForm.js
import React, { useEffect } from "react";
import styles from "./QrCodeSolana.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMask, faXmark } from "@fortawesome/free-solid-svg-icons";


const QrCodeSolana = ({ onClose, message, qrCodeLink, totalSOL }) => {



    return (
        <div className={styles.bg_black2}>
            <div className={styles.paymentForm}>
                <header className={styles.header}>
                    <img src="/images/solana.png" alt="Logo Solana" className={styles.logo} />
                    <h2 className={styles.title}>Thanh Toán Solana</h2>
                </header>

                <FontAwesomeIcon onClick={onClose} className={styles.iconXmark} icon={faXmark}></FontAwesomeIcon>

                <p>Chỉ cần quét mã QR dưới đây để thanh toán.</p>

                <div className={styles.paymentDetails}>
                    <div>
                        <strong>Số tiền cần thanh toán:</strong>
                        <span id="amount">{totalSOL} SOL</span>
                    </div>
                    <div>
                        <strong>Địa chỉ ví Solana:</strong>
                        <span id="wallet-address">
                            CjKxSyUss7AztEXzfvZ2F5Fwp5eWr3Q8dfoF4L74x5S4
                        </span>
                    </div>
                </div>

                <div className={styles.qrCodeContainer}>
                    <h3>Quét mã QR Để Thanh Toán</h3>
                    <img
                        src={qrCodeLink}
                        alt="QR Code Thanh Toán"
                        id="qr-code"
                        className={styles.qrCode}
                    />
                </div>

                <div className={styles.securityNotice}>
                    <p>
                        <i className="fa-solid fa-wallet"></i> 
                        {/* Hãy chắc chắn rằng bạn đang
                        thanh toán đến đúng địa chỉ ví. */}
                        {message}
                    </p>
                </div>

                {/* <div className={styles.confirmation}>
                    <button className={styles.paymentButton} >
                        Thanh Toán
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default QrCodeSolana;

