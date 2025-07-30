import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setSuggestedUsers } from "../redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUsers = () => {
  const dispatch = useDispatch();
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const [followState, setFollowState] = useState({});

  useEffect(() => {
    const state = {};
    suggestedUsers.forEach((u) => {
      state[u._id] = u.followers.includes(user._id);
    });
    setFollowState(state);
  }, [suggestedUsers, user]);

  const handleFollowToggle = async (targetUserId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setFollowState((prev) => ({
          ...prev,
          [targetUserId]: !prev[targetUserId],
        }));

        const suggestionRes = await axios.get(
          "http://localhost:8000/api/v1/user/suggested",
          { withCredentials: true }
        );
        dispatch(setSuggestedUsers(suggestionRes.data.users));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-4 shadow-md shadow-yellow-500/5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-sm font-semibold text-gray-300">Suggested for you</h1>
        <span className="text-xs cursor-pointer text-yellow-400 hover:underline hover:text-yellow-300 transition">
          See All
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {suggestedUsers.map((suggestedUser) => {
          const isFollowing = followState[suggestedUser._id];

          return (
            <div
              key={suggestedUser._id}
              className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-[#1a1a1a] transition-all"
            >
              <div className="flex items-center gap-3">
                <Link to={`/profile/${suggestedUser._id}`}>
                  <Avatar className="w-9 h-9 border border-yellow-500/10">
                    <AvatarImage src={suggestedUser?.profilePicture} alt="profile" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <h1 className="text-sm font-semibold text-yellow-400 hover:brightness-110 transition">
                    <Link to={`/profile/${suggestedUser._id}`}>{suggestedUser?.username}</Link>
                  </h1>
                  <span className="text-xs text-gray-500">{suggestedUser?.bio || "No bio"}</span>
                </div>
              </div>

              <button
                onClick={() => handleFollowToggle(suggestedUser._id)}
                className={`text-xs font-semibold px-3 py-1 rounded-full transition-all duration-200
                  ${
                    isFollowing
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-yellow-400 text-black hover:bg-yellow-500"
                  }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedUsers;
