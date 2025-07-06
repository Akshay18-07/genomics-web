import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./loginSlice";
import fileUploadReducer from "./fileUploadSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['login', 'files'], // persist these slices
};

const rootReducer = {
  login: counterReducer,
  files: fileUploadReducer,
};

const persistedReducer = persistReducer(persistConfig, (state, action) => {
  // combine reducers manually
  return {
    login: rootReducer.login(state?.login, action),
    files: rootReducer.files(state?.files, action),
  };
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
