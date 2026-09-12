import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistProduct {
  _id: string;
  title: string;
  category: string;
  condition: string;
}

interface WishlistItem {
  _id: string;
  products: WishlistProduct[];
}

interface WishlistState {
  items: WishlistItem[];
}

// useSelector((state: RootState) => state.wishlist.items)

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  
  name: "wishlist",
  initialState, // is state inside reducer

  reducers: {
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },

    clearWishlist: (state) => {
      state.items = [];
    },

    addToWishlistAction: (state, action: PayloadAction<WishlistItem>) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === action.payload._id,
      );

      if (existingItemIndex !== -1) {
        // UPDATE  ==> -1 !== -1 ==> true
        state.items[existingItemIndex] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },

    removeFromWishListAction: (state, action: PayloadAction<string>) => {
      state.items = state.items
        .map((item) => ({
          ...item,
          products: item.products.filter(
            (product) => product._id !== action.payload,
          ),
        }))
        .filter((item) => item.products.length > 0);
    },
  },
});

export const { setWishlist, clearWishlist, addToWishlistAction, removeFromWishListAction } = wishlistSlice.actions;
export default wishlistSlice.reducer;
