import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import {
  setPosts,
  setSelectedPost,
} from "@/redux/postSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Button } from "./ui/button";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.realTimeNotification);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("https://connexa-0mua.onrender.com/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Logout failed");
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") logoutHandler();
    else if (textType === "Home") navigate("/");
    else if (textType === "Create") setOpen(true);
    else if (textType === "Profile") navigate(`/profile/${user._id}`);
    else if (textType === "Messages") navigate("/chat");
    else if (textType === "Search") navigate("/search");
    else if (textType === "Explore") navigate("/explore");
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="h-6 w-6">
          <AvatarImage src={user?.profilePicture} alt="@user" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 left-0 z-20 h-screen w-16 lg:w-[240px] bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#1a1a1a] border-r border-[#2a2a2a] text-white flex flex-col justify-between py-6 px-2 lg:px-4 transition-all">
      <div>
        <h1 className="hidden lg:block text-yellow-400 font-extrabold text-2xl mb-10 pl-2 tracking-wider">
          Conexa
        </h1>

        <div className="space-y-2">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="relative flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer group hover:bg-[#1f1f1f] transition"
            >
              <div className="text-white group-hover:text-yellow-400">
                {item.icon}
              </div>
              <span className="hidden lg:inline text-sm font-medium group-hover:text-yellow-400">
                {item.text}
              </span>

              {/* Notification Badge */}
              {item.text === "Notification" && likeNotification.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      className="absolute -top-1 left-4 h-5 w-5 rounded-full bg-red-600 text-white text-xs z-10"
                    >
                      {likeNotification.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-[#111] border border-[#2a2a2a] text-white w-64">
                    <div className="space-y-2">
                      {likeNotification.length === 0 ? (
                        <p className="text-sm">No notifications</p>
                      ) : (
                        likeNotification.map((notification) => (
                          <div key={notification.userId} className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={notification.userDetails?.profilePicture} />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="text-sm">
                              <span className="text-yellow-400 font-semibold">
                                {notification.userDetails?.username}
                              </span>{" "}
                              liked your post
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ))}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
