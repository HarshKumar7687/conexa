import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { IoSend } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector(store => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to comment.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="min-w-5xl max-w-7xl max-h-[72vh] h-[500px] p-0 flex flex-col bg-[#121212] text-white"
      >
        <DialogTitle className="sr-only">Comment Modal</DialogTitle>

        <div className="flex flex-1">
          {/* Left: Image */}
          <div className="w-1/2">
            <img
              src={selectedPost?.image}
              alt="post_image"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          {/* Right: Comments Section */}
          <div className="w-1/2 flex flex-col justify-between bg-[#1a1a1a] rounded-r-lg">
            {/* Top: Post Author */}
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar className="ring-1 ring-yellow-400">
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <DialogTitle>
                  <Link className="font-semibold text-sm text-yellow-400 hover:underline">
                    {selectedPost?.author?.username}
                  </Link>
                </DialogTitle>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer text-gray-400 hover:text-yellow-400" />
                </DialogTrigger>
                <DialogContent className="bg-[#222] border border-gray-700 text-white">
                  <DialogTitle className="sr-only">More Options</DialogTitle>
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold hover:bg-red-800 px-2 py-1 rounded">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full hover:bg-yellow-800 px-2 py-1 rounded">
                    Add To Favourite
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <hr className="border-gray-700" />

            {/* Middle: Comments List */}
            <div className="flex-1 overflow-y-auto max-h-96 p-4 scrollbar-thin scrollbar-thumb-yellow-600 scrollbar-track-transparent">
              {comment.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>

            {/* Bottom: Add Comment */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment"
                  className="w-full text-sm outline-none bg-[#2a2a2a] border border-gray-600 text-white placeholder-gray-400 p-2 rounded"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  className="bg-yellow-500 hover:bg-yellow-600 p-2 text-black"
                >
                  <IoSend className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
