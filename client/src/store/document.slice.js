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
     },
     deleteDoc: (state, action) => {
        return { docs : state.docs.filter(doc => doc._id !== action.payload) };
     }
}});

export const { addDocs, addSingleDoc, deleteDoc } = documentSlice.actions;
export default documentSlice.reducer;