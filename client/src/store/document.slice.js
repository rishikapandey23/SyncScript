import { createSlice } from '@reduxjs/toolkit';

const initialState = { docs : [] };

const documentSlice = createSlice({
  name: 'document_created_by_user',
  initialState,
  reducers: {
    addDocs : (state, action) => {
      return { docs : action.payload };
     },
     addSingleDoc : (state, action) => {
        return { docs : [ ...state.docs, action.payload ] };
     }
}});

export const { addDocs, addSingleDoc } = documentSlice.actions;
export default documentSlice.reducer;