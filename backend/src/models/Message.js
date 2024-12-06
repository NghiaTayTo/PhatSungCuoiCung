const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },   // ID người gửi
    receiver: { type: String, required: true }, // ID người nhận
    content: { type: String, required: true }, // Nội dung tin nhắn
    nameSender: { type: String, required: false }, // tên người gửi
    image: { type: String, required: false }, // ảnh người gửi
    chatKey: { type: String, required: true }, // Thêm trường chatKey
    timestamp: { type: Date, default: Date.now }, // Thời gian gửi
    seen: { type: Boolean, default: false },    // Trạng thái đã xem
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

