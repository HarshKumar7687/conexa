import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import axios from "axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";

const Profile = () => {
  const { id: userId } = useParams();
  useGetUserProfile(userId);

  const { user, userProfile } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const isLoggedInUserProfile = user?._id === userProfile?._id;

  useEffect(() => {
    if (userProfile && user) {
      setIsFollowing(userProfile.followers.includes(user._id));
    }
  }, [userProfile, user]);

  const handleFollowToggle = async () => {
    try {
      const res = await axios.post(
        `https://connexa-0mua.onrender.com/api/v1/user/followorunfollow/${userProfile._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setIsFollowing(res.data.user.followers.includes(user._id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const displayedPosts =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="pl-[18%] py-8 pr-8 min-h-screen bg-black text-white">
      <div className="flex flex-col gap-16">
        {/* Profile Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <Avatar className="h-36 w-36 border-4 border-yellow-500 shadow-md">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">{userProfile?.username}</h2>
              {isLoggedInUserProfile ? (
                <Link to="/account/edit">
                  <Button variant="secondary" className="h-8">
                    Edit Profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    onClick={handleFollowToggle}
                    variant="secondary"
                    className="h-8"
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                  <Button variant="secondary" className="h-8">
                    Message
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-300">
              <p>
                <span className="font-bold">{userProfile?.posts?.length}</span> Posts
              </p>
              <p>
                <span className="font-bold">{userProfile?.followers?.length}</span> Followers
              </p>
              <p>
                <span className="font-bold">{userProfile?.following?.length}</span> Following
              </p>
            </div>

            <div>
              <p className="font-medium">{userProfile?.bio || "No bio yet"}</p>
              <Badge variant="secondary" className="mt-1 bg-yellow-600 text-black">
                <AtSign className="w-4 h-4 mr-1" /> {userProfile?.username}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex justify-center gap-10 text-sm mb-6">
            <span
              className={`cursor-pointer transition-all ${
                activeTab === "posts"
                  ? "font-bold text-yellow-400 border-b-2 border-yellow-400 pb-1"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("posts")}
            >
              POSTS
            </span>
            <span
              className={`cursor-pointer transition-all ${
                activeTab === "saved"
                  ? "font-bold text-yellow-400 border-b-2 border-yellow-400 pb-1"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("saved")}
            >
              SAVED
            </span>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {displayedPosts?.map((post) => (
              <div
                key={post?._id}
                className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <img
                  src={post.image}
                  alt="post"
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="flex items-center gap-6 text-white drop-shadow-lg">
                    <div className="flex items-center gap-1">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.likes.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
