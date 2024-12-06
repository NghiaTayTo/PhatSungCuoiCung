const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Lấy tất cả tin nhắn của một người nhận (receiverId)
// router.get('/:receiverId', async (req, res) => {
//     const { receiverId } = req.params;

//     try {
//         // Lấy tin nhắn từ MongoDB và sắp xếp theo thời gian
//         const messages = await Message.find({ receiver: receiverId }).sort({ timestamp: 1 });
//         res.json(messages); // Trả về danh sách tin nhắn dưới dạng JSON
//     } catch (err) {
//         console.error('Error fetching messages:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// Lấy tất cả tin nhắn giữa cửa hàng và người nhận (receiverId)
router.get('/:chatKey', async (req, res) => {
    const { chatKey } = req.params;

    try {
        // Tìm tất cả tin nhắn dựa theo chatKey
        const messages = await Message.find({ chatKey }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/manager-store/:receiverId', async (req, res) => {
    const { receiverId } = req.params;
    try {
        // Tìm tất cả tin nhắn dựa theo receiver
        const messages = await Message.find({  receiver: receiverId  }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
