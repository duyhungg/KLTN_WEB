import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./features/userSlice";
import cartReducer from "./features/cartSlice";

import { productApi } from "./api/productsApi";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { orderApi } from "./api/orderApi";
import { voucherApi } from "./api/voucherApi";
import { shippingApi } from "./api/shippingApi";
export const store = configureStore({
  reducer: {
    auth: userReducer,
    cart: cartReducer,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [voucherApi.reducerPath]: voucherApi.reducer,
    [shippingApi.reducerPath]: shippingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productApi.middleware,
      authApi.middleware,
      userApi.middleware,
      orderApi.middleware,
      voucherApi.middleware,
      shippingApi.middleware,
    ]),
});
