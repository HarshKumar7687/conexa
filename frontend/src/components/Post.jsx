import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart, FaBookmark } from "react-icons/fa";
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Badge } from './ui/badge';

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);

  if (!user || !user._id) return null;

  const [liked, setLiked] = useState(post.likes.includes(user._id));
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const [isFollowing, setIsFollowing] = useState(post.author?.followers?.includes(user._id));
  const [bookmarked, setBookmarked] = useState(post?.bookmarks?.includes(user._id));

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`https://connexa-0mua.onrender.com/api/v1/post/${post._id}/${action}`, { withCredentials: true });
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map(
          p => p._id === post._id ? {
            ...p,
            likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating like status");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://connexa-0mua.onrender.com/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`https://connexa-0mua.onrender.com/api/v1/post/delete/${post._id}`, { withCredentials: true });
      if (res.data.success) {
        const updatedPostData = posts.filter((postItem) => postItem._id !== post._id);
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const bookMarkHandler = async () => {
  try {
    const res = await axios.get(`https://connexa-0mua.onrender.com/api/v1/post/${post._id}/bookmark`, { withCredentials: true });

    if (res.data.success) {
      const isBookmarked = !bookmarked; // the new state after toggling

      setBookmarked(isBookmarked);

      const updatedPosts = posts.map(p => {
        if (p._id === post._id) {
          const updatedBookmarks = isBookmarked
            ? [...(p.bookmarks || []), user._id]
            : p.bookmarks.filter(id => id !== user._id);

          return { ...p, bookmarks: updatedBookmarks };
        }
        return p;
      });

      dispatch(setPosts(updatedPosts));
      toast.success(res.data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Something went wrong');
  }
};


  const handleFollowToggle = async () => {
    try {
      const res = await axios.post(
        `https://connexa-0mua.onrender.com/api/v1/user/followorunfollow/${post.author._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsFollowing(res.data.user.followers.includes(user._id));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Follow/Unfollow failed");
    }
  };

  return (
    <div className="w-full sm:max-w-2xl mx-auto px-2 sm:px-0">
      <div className="w-full bg-[#111] p-4 sm:p-5 rounded-xl border border-[#2a2a2a] text-white
                      transition-all duration-300 hover:shadow-[0_0_14px_#facc15aa] active:shadow-[0_0_18px_#facc15cc]
                      hover:scale-[1.01] active:scale-[0.99]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex gap-3">
              <h1 className="font-semibold text-yellow-400">{post.author?.username}</h1>
              {user._id === post.author?._id && <Badge variant="secondary" className="text-xs">Author</Badge>}
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer text-gray-400 hover:text-yellow-400" />
            </DialogTrigger>
            <DialogContent className="bg-[#1b1b1b] border border-[#2a2a2a] text-white rounded-xl space-y-3 py-5">
              <DialogTitle className="sr-only">More Options</DialogTitle>
              {user._id !== post.author?._id && (
                <Button variant="ghost" onClick={handleFollowToggle} className="text-white hover:text-white font-medium hover:bg-[#333]">
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
              <Button variant="ghost" onClick={bookMarkHandler} className="text-yellow-400 hover:text-yellow-400 font-semibold hover:bg-[#222]">
                {bookmarked ? 'Remove from Favourite' : 'Add to Favourite'}
              </Button>
              {user._id === post.author?._id && (
                <Button onClick={deletePostHandler} variant="ghost" className="text-red-600 font-semibold hover:bg-[#222]">
                  Delete
                </Button>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <img
          className="rounded-md mb-4 w-full aspect-video object-cover border border-[#2a2a2a]"
          src={post.image}
          alt="post"
        />

        <div className="flex items-center justify-between text-lg mb-3">
          <div className="flex items-center gap-5">
            {liked ? (
              <FaHeart onClick={likeOrDislikeHandler} size={22} className="cursor-pointer text-red-500 hover:scale-110 transition" />
            ) : (
              <FaRegHeart onClick={likeOrDislikeHandler} size={22} className="cursor-pointer hover:text-yellow-400 hover:scale-110 transition" />
            )}
            <MessageCircle onClick={() => { dispatch(setSelectedPost(post)); setOpen(true); }} size={22} className="cursor-pointer hover:text-yellow-400" />
            <Send size={20} className="cursor-pointer hover:text-yellow-400" />
          </div>
          {bookmarked
            ? <FaBookmark size={20} onClick={bookMarkHandler} className="cursor-pointer text-yellow-400" />
            : <Bookmark size={20} onClick={bookMarkHandler} className="cursor-pointer text-gray-400 hover:text-yellow-400" />}
        </div>

        <span className="text-sm text-yellow-300 font-medium block">{postLike} likes</span>
        <p className="text-sm mt-1 mb-2">
          <span className="text-yellow-400 font-semibold mr-2">{post.author?.username}</span>
          {post.caption}
        </p>
        <span
          onClick={() => { dispatch(setSelectedPost(post)); setOpen(true); }}
          className="cursor-pointer text-xs text-gray-400 hover:underline"
        >
          View all {comment.length} comments
        </span>
        <CommentDialog open={open} setOpen={setOpen} />

        <div className="flex items-center justify-between mt-3 border-t border-[#2a2a2a] pt-2">
          <input
            type="text"
            value={text}
            onChange={changeEventHandler}
            placeholder="Add a comment..."
            className="bg-transparent outline-none text-sm text-white w-full placeholder:text-gray-500"
          />
          {text && (
            <span
              onClick={commentHandler}
              className="text-yellow-400 text-sm font-medium cursor-pointer ml-2 hover:underline"
            >
              Post
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
