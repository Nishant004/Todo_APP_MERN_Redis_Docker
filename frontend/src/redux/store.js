import { combineReducers } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import alertsReducer from './alertsSlice'// Corrected import
import userReducer from './userSlice';    // Corrected import

const rootReducer = combineReducers({
  alerts : alertsReducer, // Ensure these are correct
  user : userReducer,
});

export const store = configureStore({
  reducer: rootReducer
});

