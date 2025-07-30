import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import React, { useRef, useState } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) {
      formData.append("image", file);
    }
    try {
      setLoading(true);
      const res = await axios.post('https://connexa-0mua.onrender.com/api/v1/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Post creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="bg-[#0a0a0a] text-white border border-[#2a2a2a] rounded-xl"
      >
        <DialogTitle className="sr-only">Create a Post</DialogTitle>
        <DialogHeader className="text-lg font-bold text-yellow-400 text-center">
          Create New Post
        </DialogHeader>

        <div className="flex gap-3 items-center mb-4">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm text-yellow-300">{user?.username}</h1>
            <span className="text-xs text-gray-400">Bio here...</span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="bg-[#1b1b1b] border border-[#333] placeholder:text-gray-500 text-sm text-white focus-visible:ring-yellow-400 focus-visible:ring-2"
          placeholder="Write a caption..."
        />

        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center border border-[#333] rounded-md mt-4 overflow-hidden">
            <img src={imagePreview} alt="preview" className="object-cover h-full w-full" />
          </div>
        )}

        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />

        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
        >
          Select from Computer
        </Button>

        {imagePreview && (
          loading ? (
            <Button className="w-full mt-3 bg-[#222] text-white hover:bg-[#333]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
              onClick={createPostHandler}
            >
              Post
            </Button>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
