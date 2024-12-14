import mysql from 'mysql2';  // Dùng import thay vì require

// Tạo kết nối tới MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'booker',
    port: 3306  // Nếu cổng khác, bạn có thể thay đổi tại đây
});


// Kết nối đến DB
db.connect((err) => {
    if (err) {
        console.error('Không thể kết nối tới cơ sở dữ liệu:', err.message);
        return;
    }
    console.log('Đã kết nối tới cơ sở dữ liệu!');
});

// // Hàm lưu giao dịch
// const saveTransaction = async (transaction, orderId, expectedAmount, memo, amountTransferred) => {
//     const senderAddress = transaction.transaction.message.accountKeys[0].toBase58();
//     const receiverAddress = 'ReceiverPublicKey';  // Đảm bảo bạn có receiverPublicKey
//     const preBalance = transaction.meta.preBalances[1];
//     const postBalance = transaction.meta.postBalances[1];

//     const sql = `
//         INSERT INTO transactions (transaction_id, order_id, memo, sender_address, receiver_address, 
//             amount_transferred, pre_balance, post_balance, transaction_status, lamports_to_sol_conversion_rate)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
    
//     const values = [
//         transaction.transaction.signatures[0], // transaction_id
//         orderId,                               // order_id
//         memo,                                  // memo
//         senderAddress,                         // sender_address
//         receiverAddress,                       // receiver_address
//         amountTransferred,                     // amount_transferred
//         preBalance,                            // pre_balance
//         postBalance,                           // post_balance
//         'confirmed',                           // transaction_status (nếu là confirmed)
//         1000000000                             // lamports_to_sol_conversion_rate
//     ];

//     db.execute(sql, values, (err, result) => {
//         if (err) {
//             console.error('Lỗi khi lưu giao dịch:', err.message);
//             return;
//         }
//         console.log('Giao dịch đã được lưu thành công!');
//     });
// };

// module.exports = { saveTransaction };
