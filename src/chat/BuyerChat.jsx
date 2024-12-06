import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // Kết nối với backend

const BuyerChat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const senderId = 'buyer321'; // ID người mua
    const receiverId = 'store123'; // ID cửa hàng
    const chatKey = [senderId, receiverId].sort().join('_'); // Tạo chatKey

    useEffect(() => {
        // Lấy tin nhắn từ server (API)
        fetch(`http://localhost:4000/api/messages/${chatKey}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched messages:', data); // Kiểm tra dữ liệu từ API
                setMessages(data);
            })
            .catch((error) => console.error('Error fetching messages:', error));

        // Nhận tin nhắn real-time từ Socket.IO
        socket.on('receiveMessage', (data) => {
            // Chỉ cập nhật tin nhắn nếu chatKey khớp
            if (data.chatKey === chatKey) {
                setMessages((prev) => [...prev, data]);
            }
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [chatKey]);

    const sendMessage = () => {
        if (message.trim()) {
            const data = {
                sender: senderId, // ID người mua
                receiver: receiverId, // ID cửa hàng
                content: message,
                chatKey: chatKey, // Thêm chatKey vào dữ liệu
            };

            console.log('Sending message:', data); // Kiểm tra dữ liệu trước khi gửi
            socket.emit('sendMessage', data); // Gửi tin nhắn qua Socket.IO
            setMessage(''); // Reset input sau khi gửi
        } else {
            console.error('Error: Message content is empty');
        }
    };

    return (
        <div>
            <div>
            </div>

            <div style={{ width: '400px', margin: '20px auto', fontFamily: 'Arial' }}>
                <h2>Buyer Chat</h2>
                <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{ textAlign: msg.sender === senderId ? 'right' : 'left' }}>
                            <strong>{msg.sender === senderId ? 'You' : 'Seller'}:</strong> {msg.content}
                            <br />
                            <small style={{ color: '#888' }}>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '10px' }}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message"
                        style={{ width: '80%', padding: '5px' }}
                    />
                    <button onClick={sendMessage} style={{ padding: '5px 10px', marginLeft: '5px' }}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuyerChat;
