import React, { useEffect, useRef, useState } from 'react';

import './ChatFormUser.scss';
import { getCuaHangByIdAdmin } from '../utils/API/StoreAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faWindowMaximize, faWindowMinimize, faXmark } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
import { Scrollbar } from 'react-scrollbars-custom'; // Hoặc thư viện bạn đang sử dụng
import { getCustomerById } from '../utils/API/CustomerAPI';


const socket = io('http://localhost:4000');

const ChatFormUser = ({ storeID, userID, onClose }) => {

    const [store, setStore] = useState({});
    const [user, setUser] = useState({});
    const [menu, setMenu] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const senderId = `KH${userID}`; // ID người mua
    const receiverId = `CH${storeID}`; // ID cửa hàng
    const chatKey = [senderId, receiverId].sort().join('_'); // Tạo chatKey
    const scrollRef = useRef(null);

    const handleClickMenu = () => {
        setMenu(!menu);
    }

    const sendMessage = () => {
        if (message.trim()) {
            const data = {
                sender: senderId, // ID người mua
                receiver: receiverId, // ID cửa hàng
                content: message,
                nameSender: user.ho_ten,
                image: user.anh_dai_dien || '/images/avtfb.jpg',
                chatKey: chatKey, // Thêm chatKey vào dữ liệu
            };

            console.log('Sending message:', data); // Kiểm tra dữ liệu trước khi gửi
            socket.emit('sendMessage', data); // Gửi tin nhắn qua Socket.IO
            setMessage(''); // Reset input sau khi gửi
        } else {
            console.error('Error: Message content is empty');
        }
    };

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
    }, [chatKey, storeID]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        const fetchData = async () => {
            console.log('id cửa hàng: là ' + storeID);
            console.log('id người đung: là ' + userID);

            try {
                const dataStore = await getCuaHangByIdAdmin(storeID);
                setStore(dataStore);

                const dataUser = await getCustomerById(userID);
                setUser(dataUser);
                // console.log(dataUser);
                

            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, [storeID, userID]);

    return (
        <div>
            {/* <!--
Inspired by https://dribbble.com/supahfunk
--> */}
            <section class="avenue-messenger">
                <div class="menu" >
                    {
                        menu === true && (
                            <div class="items"><span>
                                <p title="Minimize">&mdash;</p><br />
                                <p title="End Chat">&#10005;</p>
                            </span></div>
                        )
                    }

                    <div class="button" onClick={handleClickMenu}>
                        <FontAwesomeIcon  style={{fontSize: '18px', marginBottom: '7px', marginRight: '17px'}} icon={faWindowMinimize}></FontAwesomeIcon>
                        <FontAwesomeIcon onClick={onClose} icon={faXmark}></FontAwesomeIcon>
                    </div>
                </div>

                <div class="agent-face">
                    <div class="half">
                        <img class="agent circle" src={store?.anh_dai_dien} alt="Jesse Tino" /></div>
                </div>
                <div class="chat">
                    <div class="chat-title">
                        <h1>{store?.ten_cua_hang}</h1>
                        <h2>{store?.so_dien_thoai}</h2>
                        {/* <figure class="avatar">
      <img src="http://askavenue.com/img/17.jpg" /></figure> */}
                    </div>
                    <div class="messages">
                        {/* <Scrollbar ref={scrollRef} style={{ height: 400 }}> */}
                        <div class="messages-content">
                            {messages.map((msg, index) => (
                                <div key={index} style={{ textAlign: msg.sender === senderId ? 'right' : 'left' }}>
                                    {msg.sender === senderId ? (
                                        <>
                                            <div className="message message-personal">{msg.content}

                                                <div className="timestamp" style={{ color: '#888' }}>
                                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                                </div>
                                            </div>

                                        </>
                                    ) : (
                                        <>
                                            <div className="message new">
                                                <figure className="avatar">
                                                    <img src={store?.anh_dai_dien} alt="ảnh cửa hàng" />
                                                </figure>
                                                {msg.content}
                                                <div className="timestamp-right" style={{ color: '#888' }}>
                                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                                </div>
                                            </div>

                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* </Scrollbar> */}
                    </div>
                    <div class="message-box">
                        <textarea
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); // Ngăn việc xuống dòng
                                    sendMessage(); // Gửi tin nhắn
                                }
                            }}
                            class="message-input"
                            placeholder="Nội dung tin nhắn..."></textarea>
                        <button onClick={sendMessage} class="message-submit">
                            <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
                        </button>
                    </div>
                </div>
            </section>
            {/* <div class="bg"></div> */}
        </div >
    );
};

export default ChatFormUser;