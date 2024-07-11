import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shippingApi = createApi({
  reducerPath: "shippingApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Shipping", "AdminShipping"],
  endpoints: (builder) => ({
    getShipping: builder.query({
      query: () => "/shipping/getShippingUnit",
      providesTags: ["Shipping"],
    }),
    createShipping: builder.mutation({
      query(body) {
        return {
          url: `/shipping/createShippingUnit`,
          method: "POST",
          body,
        };
      },
    }),
    updateShipping: builder.mutation({
      query({ id, body }) {
        return {
          url: `/shipping/updateShippingUnit/${id}`,
          method: "PUT",
          body,
        };
      },
    }),
    deleteShipping: builder.mutation({
      query(id) {
        return {
          url: `/shipping/deleteShippingUnit/${id}`,
          method: "DELETE",
        };
      },
    }),
    getShippingUnitById: builder.query({
      query: (id) => `/shipping/getShippingUnitById/${id}`,
      providesTags: ["Shipping"],
    }),
    addShipper: builder.mutation({
      query(body) {
        return {
          url: `shipper/addShippertoShippingUnit`,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const {
  useGetShippingQuery,
  useCreateShippingMutation,
  useUpdateShippingMutation,
  useDeleteShippingMutation,
  useAddShipperMutation,
} = shippingApi;
