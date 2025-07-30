import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likeNotification: [],
    },
    reducers: {
        setLikeNotification: (state, action) => {
            const payload = action.payload;

            if (payload.type === 'like') {
                // Avoid duplicate notifications (based on userId + postId)
                const exists = state.likeNotification.some(
                    (item) => item.userId === payload.userId && item.postId === payload.postId
                );

                if (!exists) {
                    state.likeNotification.push(payload);
                }
            } else if (payload.type === 'dislike') {
                // Remove specific notification by userId + postId
                state.likeNotification = state.likeNotification.filter(
                    (item) => !(item.userId === payload.userId && item.postId === payload.postId)
                );
            }
        },

        resetLikeNotification: (state) => {
            state.likeNotification = [];
        },
    },
});

export const { setLikeNotification, resetLikeNotification } = rtnSlice.actions;
export default rtnSlice.reducer;
