import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistItem {
  _id: string;
  products: string[];
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<any>) => {
      state.items = action.payload;
    },
    clearWishlist: (state) => {
      state.items = [];
    },
    addToWishlistAction: (state, action: PayloadAction<WishlistItem>) => {},
    removeFromWishListAction: (state, action: PayloadAction<string>) => {},
  },
});

export const {
  setWishlist,
  clearWishlist,
  addToWishlistAction,
  removeFromWishListAction,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
