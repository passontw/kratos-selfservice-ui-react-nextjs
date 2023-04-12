import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import layoutReducer from './slice/layoutSlice';

export default configureStore({
  reducer: {
    layout: layoutReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
