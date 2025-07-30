import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  if (!user) return null;

  return (
    <div className="fixed top-0 right-0 z-10 w-full sm:w-[270px] h-screen overflow-y-auto px-4 py-6 sm:py-10 bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#1a1a1a] text-white border-l border-[#2a2a2a] shadow-inner">
      {/* Profile Summary */}
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/profile/${user._id}`}>
          <Avatar className="h-12 w-12 border border-yellow-400/20 hover:scale-105 transition">
            <AvatarImage src={user?.profilePicture} alt="profilePicture" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-semibold text-yellow-400 text-base hover:underline transition">
            <Link to={`/profile/${user._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-gray-400 text-sm">
            {user?.bio || "No bio yet"}
          </span>
        </div>
      </div>

      {/* Suggested Users */}
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
