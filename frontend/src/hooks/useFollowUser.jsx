import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserProfile, setSuggestedUsers } from "../redux/authSlice.js";

const useFollowUser = () => {
  const dispatch = useDispatch();
  const { user, userProfile, suggestedUsers } = useSelector((state) => state.auth);

  const followOrUnfollow = async (targetUserId) => {
    try {
      const res = await axios.post(
        `https://connexa-0mua.onrender.com/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // 1. Update local logged-in user's following list
        let updatedUser = { ...user };
        if (updatedUser.following.includes(targetUserId)) {
          updatedUser.following = updatedUser.following.filter((id) => id !== targetUserId);
        } else {
          updatedUser.following = [...updatedUser.following, targetUserId];
        }
        dispatch(setUser(updatedUser));

        // 2. Update visited user profile if it's the same user
        if (userProfile && userProfile._id === targetUserId) {
          let updatedProfile = { ...userProfile };
          if (updatedProfile.followers.includes(user._id)) {
            updatedProfile.followers = updatedProfile.followers.filter((id) => id !== user._id);
          } else {
            updatedProfile.followers = [...updatedProfile.followers, user._id];
          }
          dispatch(setUserProfile(updatedProfile));
        }

        // 3. Update suggested users list
        const updatedSuggestions = suggestedUsers.map((suggestedUser) => {
          if (suggestedUser._id === targetUserId) {
            const isAlreadyFollowing = suggestedUser.followers.includes(user._id);
            return {
              ...suggestedUser,
              followers: isAlreadyFollowing
                ? suggestedUser.followers.filter((id) => id !== user._id)
                : [...suggestedUser.followers, user._id],
            };
          }
          return suggestedUser;
        });
        dispatch(setSuggestedUsers(updatedSuggestions));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Follow/Unfollow failed");
    }
  };

  return { followOrUnfollow };
};

export default useFollowUser;
