import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import useGetAllMessages from '@/hooks/useGetAllMessages';
import useGetRTM from '@/hooks/useGetRTM';

const Messages = ({ selectedUser }) => {
  useGetAllMessages();
  useGetRTM();
  const { messages } = useSelector(store => store.chat);
  const { user } = useSelector(store => store.auth);

  return (
    <div className="overflow-y-auto flex-1 px-6 py-4 custom-scroll bg-[#0f0f0f] text-white">
      {/* Header Preview */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-28 w-28 ring-2 ring-yellow-500">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="mt-2 font-semibold text-yellow-400">{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button variant="outline" className="h-8 mt-2 border-yellow-400 text-black hover:bg-yellow-400 hover:text-black">
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Message Bubbles */}
      <div className="flex flex-col gap-3">
        {messages && messages.map((msg) => (
          <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`px-4 py-2 rounded-lg max-w-xs break-words text-sm shadow-md transition-all duration-200
              ${msg.senderId === user?._id
                  ? 'bg-yellow-400 text-black rounded-br-none'
                  : 'bg-[#1a1a1a] text-gray-200 border border-gray-600 rounded-bl-none'}`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
