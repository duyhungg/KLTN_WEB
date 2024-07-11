import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const voucherApi = createApi({
  reducerPath: "voucherApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Voucher", "AdminVoucher"],
  endpoints: (builder) => ({
    getVoucher: builder.query({
      query: () => "/voucher/getAllVoucher",
      providesTags: ["AdminVoucher"],
    }),
    deleteVoucher: builder.mutation({
      query(id) {
        return {
          url: `/voucher/deleteVoucher/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AdminVoucher"],
    }),
    createVoucher: builder.mutation({
      query(body) {
        return {
          url: "/voucher/createVoucher",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["AdminVoucher"],
    }),
    addVoucher: builder.mutation({
      query(id) {
        return {
          url: `/voucher/addVoucher/${id}`,
          method: "GET",
        };
      },
      invalidatesTags: ["Voucher"],
    }),
    getVoucherById: builder.mutation({
      query(id) {
        return {
          url: `/voucher/getVoucherbyId/${id}`,
          method: "GET",
        };
      },
      invalidatesTags: ["Voucher"],
    }),
    useVoucher: builder.mutation({
      query(id) {
        return {
          url: `/voucher/useVoucher/${id}`,
          method: "GET",
        };
      },
      invalidatesTags: ["Voucher"],
    }),
  }),
});

export const {
  useGetVoucherQuery,
  useDeleteVoucherMutation,
  useCreateVoucherMutation,
  useAddVoucherMutation,
  useGetVoucherByIdMutation,
  useUseVoucherMutation,
} = voucherApi;
