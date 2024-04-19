import { configureStore } from '@reduxjs/toolkit';
import userSlice from './user.slice';
import documentSlice from './document.slice';
import templateSlice from './template.slice';

export const store = configureStore({
  reducer: {
    user : userSlice,
    document : documentSlice,
    template: templateSlice,
  },
});