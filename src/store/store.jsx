// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice'
import languageReducer from '../store/slices/languageSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageReducer,
  },
});

export default store;