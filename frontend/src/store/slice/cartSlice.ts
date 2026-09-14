import { CartItem } from "@/lib/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface CartItem {
//   _id: string;
//   product: Product;
//   quantity: number;
// }

export interface CartState {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// useSelector((state: RootState) => state.cart)
const initialState: CartState = {
  _id: "",
  user: "",
  items: [],
  createdAt: "",
  updatedAt: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<any>) => {
      return { ...state, ...action.payload };
    },
    addToCart: (state, action: PayloadAction<any>) => {
      return { ...state, ...action.payload };
    },
    clearCart: () => initialState,
    // clearCart() does not remember the previous Redux data.
  },
});

export const {setCart, addToCart, clearCart} = cartSlice.actions
export default cartSlice.reducer
