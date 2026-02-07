import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,persistStore,FLUSH,REHYDRATE,PAUSE,PURGE,PERSIST,REGISTER,
} from "redux-persist";
import userReducer from "./slice/userSlice";
import { api } from "./api";

const userPersistConfig = {
  key: "user",
  storage,
  whiteList: ["user", "isEmailVerified", "isLoggedIn"],
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PURGE, PERSIST, REGISTER],
      },
    }).concat(api.middleware),
});
setupListeners(store.dispatch);

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
