// store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import deviceReducer from '../slices/deviceSlice';
import issueRequestReducer from '../slices/issueSlice';
import authReducer from '../slices/authSlice';
//import notificationReducer from './slices/notificationSlice';

// Redux-Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'], // Only persist authentication state
  blacklist: ['devices', 'issueRequests', 'notifications'] // Don't persist these slices
};

// Combine reducers with routing (if using connected-react-router)
const rootReducer = combineReducers({
  auth: authReducer,
  devices: deviceReducer,
  issueRequests: issueRequestReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Custom middleware for performance monitoring
const performanceMiddleware = store => next => action => {
  const start = performance.now();
  const result = next(action);
  const end = performance.now();
  const diff = end - start;
  
  if (diff > 10) { // Log slow actions
    console.warn(`Action ${action.type} took ${diff.toFixed(2)}ms`);
  }
  
  return result;
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: [
          'devices.entities', // Ignore device documents/files
          'issueRequests.entities' // Ignore issue request files
        ]
      },
      immutableCheck: {
        ignoredPaths: [
          'devices.entities',
          'issueRequests.entities'
        ]
      }
    }).concat([
      performanceMiddleware,
      // Add other custom middleware here
    ]),
  devTools: process.env.NODE_ENV !== 'production',
});

// Optional: Hot Module Replacement for development
