import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistItem {
  _id: string;
  products: string[]; // array of string id's
}

interface WishlistState {
  items: WishlistItem[];
  // items : [ { _id : "1" , products : ["kjhggc", "kjhgfd"] } ]
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({

  name: "wishlist",
  initialState, // is state inside reducer

  reducers: {

    setWishlist: (state, action: PayloadAction<any>) => {
      state.items = action.payload;
    },

    clearWishlist: (state) => {
      state.items = [];
    },

    addToWishlistAction: (state, action: PayloadAction<WishlistItem>) => {

      const existingItemIndex = state.items.findIndex( (item) => item._id === action.payload._id );

      if (existingItemIndex !== -1) { // UPDATE  ==> -1 !== -1 ==> true
        state.items[existingItemIndex] = action.payload;
      } else {
        state.items.push(action.payload);
      }

    },

    removeFromWishListAction: (state, action: PayloadAction<string>) => {

      state.items = state.items.map( item => ( { ...item, products: item.products.filter( productId => productId !== action.payload ) } ) )
      .filter((item) => item.products.length > 0)
      // outside filter() runs on the resulting array of map.
      // In filter ,  If no items pass the condition, it returns an empty array []
    },

  }
});

export const { setWishlist, clearWishlist, addToWishlistAction, removeFromWishListAction } = wishlistSlice.actions;
export default wishlistSlice.reducer;
