import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface checkoutState {
  step: "cart" | "address" | "payment";
  orderId: string | null;
  orderAmount: number | null;
}

const initialState: checkoutState = {
  step: "cart",
  orderId: null,
  orderAmount: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutStep: (
      state,
      action: PayloadAction<"cart" | "address" | "payment">,
    ) => {
      console.log("action of setCheckoutStep ==>", action);
      state.step = action.payload;
    },
    setOrderId: (state, action: PayloadAction<string | null>) => {
      state.orderId = action.payload;
    },
    // PayloadAction<T> is roughly:
    // type PayloadAction<T> = {
    //   type: string;
    //   payload: T;
    // };
    // It is known as Generic type alias , type: string;
    //////////////////////////////////////
    // dispatch(setOrderId("ORD123")) , setOrderId("ORD123") is Action creator and then returns object ==>
    // {
    //   type: "checkout/setOrderId", == > slice name + reducer name , Redux Toolkit generates it for you
    //   payload: "ORD123"
    // }
    // then Dispatch sends it to Redux store , Store forwards action to reducers and Reducer updates state (new state)
    setOrderAmount: (state, action: PayloadAction<number | null>) => {
      state.orderAmount = action.payload;
    },
    resetCheckout: (state) => {
      state.step = "cart";
      state.orderAmount = null;
    },
  },
});

export const { setCheckoutStep, setOrderAmount, setOrderId, resetCheckout } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;

// type PayloadAction<T> = {
//   type: string;
//   payload: T;
// };

// const action1: PayloadAction<number> = {
//   type: "increment",
//   payload: 5,
// };

