import {User} from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';

//register user
export const register = async (req,res) => {
    try{
        const {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(401).json({
                message: "Something is missing please check!",
                success: false,
            });
        }
        const user = await User.findOne({email});
        if(user){
             return res.status(401).json({
                message: "Email already registered try different email",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            username,
            email,
            password: hashedPassword,
        });
            return res.status(201).json({
                message: "Account created sucessfully!",
                success: true,
            });
    }catch(err){
        console.log(err);  
    }
}

//login
export const login = async (req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                message: "Something is missing please check!",
                success: false,
            });
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password);

        if(!isPasswordMatch){
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const token = await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});

        //populate each posts if in populated array
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts,
        }

        return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge: 1*24*60*60*1000}).json({
            message: `Welcome back! ${user.username}`,
            success: true,
            user
        });

    }catch(err){
        console.log(err);
    }
};

//log-out
export const logout = async (req,res) => {
    try {
        return res.cookie("token","",{maxAge:0}).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (err) {
        console.log(err);
    }
}

//get profile
export const getProfile = async (req,res) => {
    try {
       const userId = req.params.id; 
       let user = await User.findById(userId).populate({path: 'posts',createdAt: -1}).populate('bookmarks');
       return res.status(200).json({
        user,
        success: true,
       });
    } catch (err) {
        console.log(err); 
    }
}

//edit profile
export const editProfile = async (req,res) => {
    try {
        const userId = req.id;
        const {bio,gender} = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }
        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({
                message: "User not found!",
                success: false,
            });
        };
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: "Profile Updated!",
            success: true,
            user
        });

    } catch (err) {
        console.log(err);    
    }
}

//get follow suggestions
export const getSuggestedUsers = async (req,res) => {
    try {
        const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status(400).json({
                message: "Currently do not have any users",
            });
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers,
        });
    } catch (err) {
        console.log(err);
    }
}


// followOrUnfollow
export const followOrUnfollow = async (req, res) => {
  try {
    const followKarneWala = req.id;
    const jiskoFollowKarnaHai = req.params.id;

    if (followKarneWala === jiskoFollowKarnaHai) {
      return res.status(400).json({
        message: "You cannot follow or unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(followKarneWala);
    const targetUser = await User.findById(jiskoFollowKarnaHai);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const isFollowing = user.following.includes(targetUser._id);

    if (isFollowing) {
      await Promise.all([
        User.updateOne({ _id: followKarneWala }, { $pull: { following: jiskoFollowKarnaHai } }),
        User.updateOne({ _id: jiskoFollowKarnaHai }, { $pull: { followers: followKarneWala } }),
      ]);
    } else {
      await Promise.all([
        User.updateOne({ _id: followKarneWala }, { $addToSet: { following: jiskoFollowKarnaHai } }),
        User.updateOne({ _id: jiskoFollowKarnaHai }, { $addToSet: { followers: followKarneWala } }),
      ]);
    }

    const updatedTarget = await User.findById(jiskoFollowKarnaHai).select("-password");
    const updatedUser = await User.findById(followKarneWala).select("-password");

    return res.status(200).json({
      success: true,
      message: isFollowing ? "Unfollowed Successfully!" : "Followed Successfully!",
      targetUser: updatedTarget,
      user: updatedUser,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
