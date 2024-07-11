import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import Dashboard from "../admin/Dashboard";
import ListProducts from "../admin/ListProducts";
import NewProduct from "../admin/NewProduct";
import UpdateProduct from "../admin/UpdateProduct";
import UploadImages from "../admin/UploadImages";
import ListOrders from "../admin/ListOrders";
import ProcessOrder from "../admin/ProcessOrder";
import ListUsers from "../admin/ListUsers";
import UpdateUser from "../admin/UpdateUser";
import ProductReviews from "../admin/ProductReviews";
import { Voucher } from "../admin/Voucher";
import NewVoucher from "../admin/NewVoucher";
import Shipping from "../admin/Shipping";
import NewShipping from "../admin/NewShipping";
import Shipper from "../admin/Shipper";
import UpdateShipper from "../admin/UpdateShipper";
const adminRoutes = () => {
  return (
    <>
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute admin={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute admin={true}>
            <ListProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/shipper"
        element={
          <ProtectedRoute admin={true}>
            <Shipper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/updateshipper/:id"
        element={
          <ProtectedRoute admin={true}>
            <UpdateShipper />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/product/new"
        element={
          <ProtectedRoute admin={true}>
            <NewProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/:id"
        element={
          <ProtectedRoute admin={true}>
            <UpdateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/:id/upload_images"
        element={
          <ProtectedRoute admin={true}>
            <UploadImages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute admin={true}>
            <ListOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders/:id"
        element={
          <ProtectedRoute admin={true}>
            <ProcessOrder />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute admin={true}>
            <ListUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute admin={true}>
            <UpdateUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute admin={true}>
            <ProductReviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/voucher"
        element={
          <ProtectedRoute admin={true}>
            <Voucher />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/new/voucher"
        element={
          <ProtectedRoute admin={true}>
            <NewVoucher />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/shipping"
        element={
          <ProtectedRoute admin={true}>
            <Shipping />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/new/shipping"
        element={
          <ProtectedRoute admin={true}>
            <NewShipping />
          </ProtectedRoute>
        }
      />
    </>
  );
};

export default adminRoutes;
