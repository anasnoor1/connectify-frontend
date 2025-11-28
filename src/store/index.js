import { configureStore } from '@reduxjs/toolkit';
import landingReducer from '../features/home/landingSlice';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const landingPersistConfig = {
  key: 'landing',
  storage,
  blacklist: ['status', 'error'],
};

const persistedLandingReducer = persistReducer(landingPersistConfig, landingReducer);

export const store = configureStore({
  reducer: {
    landing: persistedLandingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
