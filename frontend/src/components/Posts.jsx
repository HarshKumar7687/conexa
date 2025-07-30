import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';

const Posts = () => {
  const { posts } = useSelector((store) => store.post);

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 py-6 bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#1a1a1a] text-white rounded-lg border border-[#2a2a2a] shadow-inner">
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        {posts.length === 0 ? (
          <div className="text-center text-gray-400 text-lg mt-10">
            No posts to display
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="transition-transform duration-200 hover:scale-[1.01] rounded-xl"
            >
              <Post post={post} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
