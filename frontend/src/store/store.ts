import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";

import storage from "redux-persist/lib/storage";
// This imports the storage adapter that Redux Persist will use to save data.
// adapter is something that connects two things that don't directly fit or work together.

import {
  persistReducer, // Wraps your normal Redux reducer to make it persistent.
  persistStore, // Start persistence for the persisted reducers inside this store

  FLUSH,
  REHYDRATE,
  PAUSE,
  PURGE,
  PERSIST,
  REGISTER,
} from "redux-persist";
// redux-persist saves your Redux state so it can survive a page refresh.
// After refresh : redux-persist reads localStorage and Restores Redux state

// reducers 
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
  key: "cart", // In browser storage (like localStorage), data is saved as ==> cart: { items: [ {},{}] }
  storage,
  whitelist: ["items"], // For the cart slice, save only items into browser storage
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
const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);
const persistedCheckoutReducer = persistReducer( checkoutPersistConfig, checkoutReducer);

export const store = configureStore({

  reducer: {
    // RTK Query stores the API response in Redux state, specifically in the api section managed by api.reducer.
    [api.reducerPath]: api.reducer,

    user: persistedUserReducer,
    cart: persistedCartReducer,
    wishlist: persistedWishlistReducer,
    checkout: persistedCheckoutReducer,
  },

  middleware : (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PURGE, PERSIST, REGISTER],
      },
    }).concat(api.middleware)

});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Redux Store
// │
// ├── user
// ├── cart
// ├── wishlist
// ├── checkout
// └── api
//      └── cached API data
