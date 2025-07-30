import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Button } from './ui/button';
import { MessageCircle } from 'lucide-react';
import { Input } from './ui/input';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
  const { onlineUsers, messages } = useSelector(store => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { textMessage }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex ml-[16%] h-screen text-white bg-[#0a0a0a]">
      {/* Left Sidebar */}
      <section className="w-full md:w-1/4 py-6 border-r border-[#2a2a2a] bg-[#111]">
        <h1 className="font-bold mb-4 px-4 text-yellow-400 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-[#2a2a2a]" />
        <div className="overflow-y-auto h-[80vh] custom-scroll">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-3 px-4 hover:bg-[#1a1a1a] cursor-pointer transition-all"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold">{suggestedUser.username}</span>
                  <span className={`text-xs font-bold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Window */}
      {selectedUser ? (
        <section className="flex-1 flex flex-col h-full bg-[#0f0f0f] border-l border-[#2a2a2a]">
          {/* Header */}
          <div className="flex gap-3 items-center px-4 py-3 border-b border-[#2a2a2a] bg-[#111] sticky top-0 z-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-yellow-300">{selectedUser?.username}</span>
            </div>
          </div>

          {/* Messages */}
          <Messages selectedUser={selectedUser} />

          {/* Input */}
          <div className="flex items-center p-4 border-t border-[#2a2a2a] bg-[#111]">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              placeholder="Type your message..."
              className="flex-1 mr-2 bg-[#1a1a1a] text-white placeholder-gray-500 border border-[#333] focus-visible:ring-yellow-400"
            />
            <Button
              onClick={() => sendMessageHandler(selectedUser?._id)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
            >
              Send
            </Button>
          </div>
        </section>
      ) : (
        // Empty Chat UI
        <div className="flex-1 flex flex-col items-center justify-center bg-[#0f0f0f]">
          <MessageCircle className="w-28 h-28 text-gray-600 my-6" />
          <h1 className="font-medium text-xl text-gray-300">Your Messages</h1>
          <span className="text-sm text-gray-500">Send a message to start chatting</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
