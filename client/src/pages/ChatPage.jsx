import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [chats, setChats] = useState([]); 

  const fetchChats = async () => {
    const data = await axios.get("/api/chat");
    console.log(data.data.data);
    setChats(data.data.data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div className='chat-message' key={chat.id}>
          {chat.message}
        </div>
      ))}
    </div>
  )
}

export default ChatPage
