import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PURGE,
  PERSIST,
  REGISTER,
} from "redux-persist";
import userReducer from "./slice/userSlice";
import cartReducer from "./slice/cartSlice";
import wishlistReducer from "./slice/wishlistSlice";
import checkoutReducer from "./slice/checkoutSlice";
import { api } from "./api";

const userPersistConfig = {
  key: "user",
  storage, // localStorage (browser storage)
  whitelist: ["user", "isEmailVerified", "isLoggedIn"],
};

const cartPersistConfig = {
  key: "cart", // In browser storage (like localStorage), data is saved as: cart: { items: [...] }
  storage,
  whitelist: ["items"], //Only save these selected fields from Redux state into storage (like localStorage).”
};

const wishlistPersistConfig = {
  key: "wishlist",
  storage,
};
// If you don’t use whitelist, redux-persist will save the entire reducer state.

const checkoutPersistConfig = {
  key: "checkout",
  storage,
};
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(
  wishlistPersistConfig,
  wishlistReducer,
);
const persistedCheckoutReducer = persistReducer(
  checkoutPersistConfig,
  checkoutReducer,
);

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: persistedUserReducer,
    cart: persistedCartReducer,
    wishlist: persistedWishlistReducer,
    checkout: persistedCheckoutReducer,
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
