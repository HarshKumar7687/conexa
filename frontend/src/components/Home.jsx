import React from 'react';
import Feed from './Feed';
import { Outlet } from 'react-router-dom';
import RightSidebar from './RightSidebar';
import useGetAllPost from '@/hooks/useGetAllPost';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white">
      
      {/* Optional Left Sidebar Placeholder */}
      <div className="hidden lg:block lg:w-[240px] border-r border-[#2a2a2a]" />

      {/* Center Feed */}
      <div className="flex-grow w-full px-4 py-6 flex justify-center">
        <div className="w-full sm:max-w-xl md:max-w-2xl">
          <Feed />
          <Outlet />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block lg:w-[270px] border-l border-[#2a2a2a] px-4">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
