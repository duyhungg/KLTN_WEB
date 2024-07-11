import express from "express";
const router = express.Router();
import {
  authorizeRoles,
  isAuthenticatedUser,
  isAuthenticatedMobileUser,
} from "../middlewares/auth.js";
import {
  createShippingInfo,
  getShippingInfo,
  deleteAddressInfo,
  updateAddressInfo,
  addressDefault,
  getAddressDefault,
} from "../controllers/addressControllers.js";
// web route
router
  .route("/me/createShippingInfo")
  .post(isAuthenticatedUser, createShippingInfo);
router.route("/me/getShippingInfo").get(isAuthenticatedUser, getShippingInfo);
router
  .route("/me/deleteShippingInfo/:addressId")
  .delete(isAuthenticatedUser, deleteAddressInfo);
router
  .route("/me/updateShippingInfo/:addressId")
  .put(isAuthenticatedUser, updateAddressInfo);
router.route("/me/addressDefault/:id").get(isAuthenticatedUser, addressDefault);
router
  .route("/me/getAddressDefault")
  .get(isAuthenticatedUser, getAddressDefault);

// mobile routes
router
  .route("/mobile/me/createShippingInfo")
  .post(isAuthenticatedMobileUser, createShippingInfo);
router
  .route("/mobile/me/getShippingInfo")
  .get(isAuthenticatedMobileUser, getShippingInfo);
router
  .route("/mobile/me/deleteShippingInfo/:addressId")
  .delete(isAuthenticatedMobileUser, deleteAddressInfo);
router
  .route("/mobile/me/updateShippingInfo/:addressId")
  .put(isAuthenticatedMobileUser, updateAddressInfo);
router
  .route("/mobile/me/addressDefault/:id")
  .get(isAuthenticatedMobileUser, addressDefault);
router
  .route("/mobile/me/getAddressDefault")
  .get(isAuthenticatedMobileUser, getAddressDefault);
export default router;
