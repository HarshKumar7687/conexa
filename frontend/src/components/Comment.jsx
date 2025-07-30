import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Comment = ({ comment }) => {
  return (
    <div className="my-3 px-2">
      <div className="flex gap-3 items-start">
        <Avatar className="h-8 w-8 ring-1 ring-yellow-400">
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-yellow-400">{comment?.author?.username}</span>
          <span className="text-sm text-gray-300">{comment?.text}</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
