import { createSlice } from '@reduxjs/toolkit';

const initialState = { id : null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUserId: (state, action) => {
      return { id : action.payload };
    },
    addUser: (state, action) => {
      return action.payload;
    },
  },
});

export const { addUserId, addUser } = userSlice.actions;
export default userSlice.reducer;