// store/slices/languageSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Get saved language from localStorage or default to English
const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('language');
  return savedLanguage || 'en';
};

// Set initial document direction
const setDocumentDirection = (language) => {
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;
  document.documentElement.lang = language;
  
  // Add/remove RTL class to body for additional styling if needed
  if (language === 'ar') {
    document.body.classList.add('rtl');
    document.body.classList.remove('ltr');
  } else {
    document.body.classList.add('ltr');
    document.body.classList.remove('rtl');
  }
};

const initialLanguage = getInitialLanguage();

// Set initial direction on load
if (typeof document !== 'undefined') {
  setDocumentDirection(initialLanguage);
}

const initialState = {
  language: initialLanguage,
  direction: initialLanguage === 'ar' ? 'rtl' : 'ltr',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      const newLanguage = action.payload;
      state.language = newLanguage;
      state.direction = newLanguage === 'ar' ? 'rtl' : 'ltr';
      
      // Save to localStorage
      localStorage.setItem('language', newLanguage);
      
      // Update document direction
      if (typeof document !== 'undefined') {
        setDocumentDirection(newLanguage);
      }
    },
    toggleLanguage: (state) => {
      const newLanguage = state.language === 'en' ? 'ar' : 'en';
      state.language = newLanguage;
      state.direction = newLanguage === 'ar' ? 'rtl' : 'ltr';
      
      // Save to localStorage
      localStorage.setItem('language', newLanguage);
      
      // Update document direction
      if (typeof document !== 'undefined') {
        setDocumentDirection(newLanguage);
      }
    }
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;