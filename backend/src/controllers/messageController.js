const Message = require('../models/Message');

// Lấy tin nhắn của người nhận (receiverId)
// exports.getMessages = async (req, res) => {
//     const { receiverId } = req.params;

//     try {
//         const messages = await Message.find({ receiver: receiverId });
//         res.json(messages);
//     } catch (err) {
//         console.error('Error fetching messages:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// controllers/messageController.js
exports.getMessages = async (req, res) => {
    const { senderId, receiverId } = req.params;

    // Tạo chatKey dựa trên senderId và receiverId
    const chatKey = [senderId, receiverId].sort().join('_'); // Tạo key theo định dạng 'sender_receiver'

    try {
        // Truy vấn tin nhắn dựa vào chatKey
        const messages = await Message.find({ chatKey })
            .sort({ timestamp: 1 }); // Sắp xếp theo thời gian

        res.json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





// Tạo tin nhắn mới
exports.createMessage = async (req, res) => {
    const { sender, receiver, content } = req.body;

    try {
        const newMessage = new Message({ sender, receiver, content });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
