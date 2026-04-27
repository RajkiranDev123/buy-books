import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const Base_URL = process.env.NEXT_PUBLIC_API_URL; //"http://localhost:8000/api/v1"

// | Feature   | providesTags 🟢      | invalidatesTags 🔴         |
// | --------- | -------------------- | -------------------------- |
// | Used in   | Query (GET)          | Mutation (POST/PUT/DELETE) |
// | Meaning   | Marks cached data    | Marks data as outdated     |
// | Effect    | Stores & labels data | Triggers refetch           |

// Cache = temporary memory in Redux
// Lives in RAM (memory)
// Fast access
// Lost when page refreshes

// invalidatesTags triggers refetch only for GET queries (not mutations) that used providesTags with the same tag.
// it re-render the component?  YES — but only if the component is using that (get) query hook

// | Feature          | RTK Query Cache    | LocalStorage    |
// | ---------------- | ----------------   | --------------- |
// | Where stored     | Redux (memory)     | Browser storage |
// | Survives refresh | ❌ No              | ✅ Yes           |
// | Speed            | ⚡ Very fast       | 🐢 slower       |
// | Auto-managed     | ✅ Yes             | ❌ Manual        |
// | Purpose          | API data caching    | persistent data |

const API_URLS = {
  // auth
  REGISTER: `${Base_URL}/auth/register`,
  LOGIN: `${Base_URL}/auth/login`,
  VERIFY_EMAIL: (token: string) => `${Base_URL}/auth/verify-email/${token}`,
  FORGOT_PASSWORD: `${Base_URL}/auth/forgot-password`,
  RESET_PASSWORD: (token: string) => `${Base_URL}/auth/reset-password/${token}`,
  VERIFY_AUTH: `${Base_URL}/auth/verify-auth`,
  LOGOUT: `${Base_URL}/auth/logout`,
  //
  UPDATE_USER_PROFILE: (userId: string) =>
    `${Base_URL}/user/profile/update/${userId}`,

  // product
  PRODUCTS: `${Base_URL}/product`,
  PRODUCT_BY_ID: (id: string) => `${Base_URL}/product/${id}`,
  GET_PRODUCT_BY_SELLER_ID: (sellerId: string) =>
    `${Base_URL}/product/seller/${sellerId}`,
  DELETE_PRODUCT_BY_PRODUCT_ID: (productId: string) =>
    `${Base_URL}/product/seller/${productId}`,

  //cart
  CART: (userId: string) => `${Base_URL}/cart/${userId}`,
  ADD_TO_CART: `${Base_URL}/cart/add`,
  REMOVE_FROM_CART: (productId: string) =>
    `${Base_URL}/cart/remove/${productId}`,

  //wishlist
  WISHLIST: (userId: string) => `${Base_URL}/wishlist/${userId}`,
  ADD_TO_WISHLIST: `${Base_URL}/wishlist/add`,
  REMOVE_FROM_WISHLIST: (productId: string) =>
    `${Base_URL}/wishlist/remove/${productId}`,

  //order
  ORDERS: `${Base_URL}/order`,
  ORDER_BY_ID: (orderId: string) => `${Base_URL}/order/${orderId}`,
  CREATE_RAZORPAY_PAYMENT: `${Base_URL}/order/payment-razorpay`,

  //address
  GET_ADDRESS: `${Base_URL}/user/address`,
  ADD_OR_UPDATE_ADDRESS: `${Base_URL}/user/address/create-or-update`,
};

///////////////////////////////////////// createApi /////////////////////////////////

// createApi({
//   reducerPath, not used then, default ==> reducerPath: "api"
//   baseQuery,
//   tagTypes,
//   endpoints: (builder) => ({
//     query → GET (auto fetch)
//     mutation → POST/PUT/DELETE (manual call)
//   })
// })

export const api = createApi({
  // baseQuery
  baseQuery: fetchBaseQuery({
    baseUrl: Base_URL,
    credentials: "include",
  }),
  // tagTypes
  tagTypes: ["User", "Product", "Cart", "Wishlist", "Order", "Address"],
  // endpoints
  endpoints: (builder) => ({
    //user endpoints
    register: builder.mutation({
      query: (userData) => ({
        url: API_URLS.REGISTER,
        method: "POST",
        body: userData,
      }),
    }),
    // login
    login: builder.mutation({
      query: (userData) => ({
        url: API_URLS.LOGIN,
        method: "POST",
        body: userData,
      }),
    }),
    //login ends
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: API_URLS.VERIFY_EMAIL(token),
        method: "GET",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: API_URLS.FORGOT_PASSWORD,
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: API_URLS.RESET_PASSWORD(token),
        method: "POST",
        body: newPassword,
      }),
    }),
    verifyAuth: builder.mutation({
      query: () => ({
        url: API_URLS.VERIFY_AUTH,
        method: "GET",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: API_URLS.LOGOUT,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: API_URLS.UPDATE_USER_PROFILE(userId),
        method: "PUT",
        body: userData,
      }),
    }),
    //product endpoints
    addProducts: builder.mutation({
      query: (productData) => ({
        url: API_URLS.PRODUCTS,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"], // “After adding product, refresh Product data”
    }),
    getProducts: builder.query({
      query: () => API_URLS.PRODUCTS,
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => API_URLS.PRODUCT_BY_ID(id),
      providesTags: ["Product"],
    }),
    getProductBySellerId: builder.query({
      query: (sellerId) => API_URLS.GET_PRODUCT_BY_SELLER_ID(sellerId),
      providesTags: ["Product"],
    }),
    deleteProductById: builder.mutation({
      query: (productId) => ({
        url: API_URLS.DELETE_PRODUCT_BY_PRODUCT_ID(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    // cart
    addToCart: builder.mutation({
      query: (productData) => ({
        url: API_URLS.ADD_TO_CART,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: API_URLS.REMOVE_FROM_CART(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    getCart: builder.query({
      query: (userId) => API_URLS.CART(userId),
      providesTags: ["Cart"],
    }),

    // wishlist endpoints
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: API_URLS.ADD_TO_WISHLIST,
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: API_URLS.REMOVE_FROM_WISHLIST(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
    getWishlist: builder.query({
      query: (userId) => API_URLS.WISHLIST(userId),
      providesTags: ["Wishlist"],
    }),
    // order
    getUserOrders: builder.query({
      query: () => API_URLS.ORDERS,
      providesTags: ["Order"],
    }),
    getOrderById: builder.query({
      query: (orderId) => API_URLS.ORDER_BY_ID(orderId),
      providesTags: ["Order"],
    }),
    createOrUpdateOrder: builder.mutation({
      query: ({ orderId, updates }) => ({
        url: API_URLS.ORDERS,
        method: orderId ? "PATCH" : "POST",
        body: updates,
      }),
      invalidatesTags: ["Order"],
    }),
    createRazorpayPayment: builder.mutation({
      query: (orderId) => ({
        url: API_URLS.CREATE_RAZORPAY_PAYMENT,
        method: "POST",
        body: { orderId },
      }),
    }),
    //address
    getAddress: builder.query<any[], void>({
      query: () => API_URLS.GET_ADDRESS,
      providesTags: ["Address"],
    }),
    addOrUpdateAddress: builder.mutation<any, any>({
      query: (address) => ({
        url: API_URLS.ADD_OR_UPDATE_ADDRESS,
        method: "POST",
        body: address,
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyAuthMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  useAddProductsMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySellerIdQuery,
  useDeleteProductByIdMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrUpdateOrderMutation,
  useCreateRazorpayPaymentMutation,
  useAddOrUpdateAddressMutation,
  useGetAddressQuery,
} = api;
