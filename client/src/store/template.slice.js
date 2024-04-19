import { createSlice } from '@reduxjs/toolkit';

const initialState = { isTemplate: false };

const templateSlice = createSlice({
  name: 'document_created_by_user',
  initialState,
  reducers: {
    changeIsTemplate: (state, action) => {
      return { isTemplate: action.payload };
    },
}});

export const { changeIsTemplate } = templateSlice.actions;
export default templateSlice.reducer;