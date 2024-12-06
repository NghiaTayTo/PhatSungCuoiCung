const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const connectDatabase = require('./src/utils/database');

// Kết nối đến MongoDB
connectDatabase();

// Tạo server HTTP
const server = http.createServer(app);

// Tích hợp Socket.IO
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// Sự kiện Socket.IO
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Sự kiện gửi tin nhắn
    socket.on('sendMessage', async (data) => {
        const { sender, receiver, content, nameSender,  image, chatKey } = data;
        const Message = require('./src/models/Message');
        const newMessage = new Message({
            sender,
            receiver,
            content,
            nameSender,
            image,
            chatKey, // Thêm chatKey vào đối tượng
            timestamp: new Date(),
            seen: false,
        });
    
        try {
            await newMessage.save();
            console.log('Message saved to database:', newMessage);
            // Emit thông báo cho client khác (nếu cần)
            // socket.broadcast.emit('receiveMessage', newMessage);
            io.emit('receiveMessage', newMessage);
        } catch (err) {
            console.error('Error saving message:', err);
        }
    });
    


    // Sự kiện khi client ngắt kết nối
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


// Khởi động server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
