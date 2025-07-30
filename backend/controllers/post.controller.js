import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { Comment } from '../models/comment.model.js';
import { getReceiverSocketId,io } from '../socket/socket.js';

// add new post
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({ message: 'Image Required', success: false });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: 'author', select: '-password' });

    return res.status(201).json({
      message: 'New Post Added',
      post,
      success: true,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error while creating post',
      error: err.message
    });
  }
};

// get all posts
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'username profilePicture' })
      .populate({ path: 'comments', sort: { createdAt: -1 }, populate: { path: 'author', select: 'username profilePicture' } });

    return res.status(200).json({
      posts,
      success: true,
    });

  } catch (err) {
    return res.status(500).json({ message: 'Error fetching posts', success: false });
  }
};

// get my posts
export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'username,profilePicture' })
      .populate({ path: 'comments', sort: { createdAt: -1 }, populate: { path: 'author', select: 'username,profilePicture' } });

    return res.status(200).json({
      posts,
      success: true,
    });

  } catch (err) {
    return res.status(500).json({ message: 'Error fetching user posts', success: false });
  }
};

// like post
export const likePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: 'Post not Found!',
        success: false,
      });
    }

    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
    await post.save();

    //socket io
    const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
    const postOwnerId = post.author.toString();
    if(postOwnerId !== likeKrneWalaUserKiId){
      //send notification
      const notification = {
        type: "like",
        userId: likeKrneWalaUserKiId,
        userDetails: user,
        postId,
        message: "Your post was liked!"
      }
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit('notification',notification)
    }


    return res.status(200).json({ message: 'Post Liked!', success: true });

  } catch (err) {
    return res.status(500).json({ message: 'Error liking post', success: false });
  }
};

// dislike post
export const dislikePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: 'Post not Found!',
        success: false,
      });
    }

    await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
    await post.save();

    //socket io
    const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
    const postOwnerId = post.author.toString();
    if(postOwnerId !== likeKrneWalaUserKiId){
      //send notification
      const notification = {
        type: "dislike",
        userId: likeKrneWalaUserKiId,
        userDetails: user,
        postId,
        message: "Your post was disliked!"
      }
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit('notification',notification)
    }

    return res.status(200).json({ message: 'Post DisLiked!', success: true });

  } catch (err) {
    return res.status(500).json({ message: 'Error disliking post', success: false });
  }
};

// add comment
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKrneWalaUserKiId = req.id;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!text) {
      return res.status(400).json({ message: 'text is required', success: false });
    }

    const comment = await Comment.create({
      text,
      author: commentKrneWalaUserKiId,
      post: postId,
    })
    await comment.populate({
      path: 'author',
      select: 'username profilePicture',
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: 'Comment was Added!',
      comment,
      success: true,
    });

  } catch (err) {
    return res.status(500).json({ message: 'Error adding comment', success: false });
  }
};

// get comments of a post
export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate({ path: 'author', select: 'username profilePicture' });

    if (!comments) {
      return res.status(404).json({ message: 'No Comments for this post', success: false });
    }

    return res.status(200).json({ success: true, comments });

  } catch (err) {
    return res.status(500).json({ message: 'Error fetching comments', success: false });
  }
};

// delete post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found', success: false });
    }

    if (post.author.toString() != authorId) {
      return res.status(403).json({ message: 'Unauthorized user' });
    }

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(authorId);
    user.posts = user.posts.filter(id => id.toString() != postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: 'Post Deleted!'
    });

  } catch (err) {
    return res.status(500).json({ message: 'Error deleting post', success: false });
  }
};

// post bookmark
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: 'post not found!',
        success: false,
      });
    }

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: 'unsaved',
        message: 'Post removed from bookmark',
        success: true,
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: 'saved',
        message: 'Post added to bookmark',
        success: true,
      });
    }

  } catch (err) {
    return res.status(500).json({ message: 'Error bookmarking post', success: false });
  }
};
