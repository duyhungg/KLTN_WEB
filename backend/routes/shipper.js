import express from "express";
const router = express.Router();

import {
  authorizeRoles,
  isAuthenticatedUser,
  isAuthenticatedMobileUser,
} from "../middlewares/auth.js";
import {
  getOrderByShippingUnit,
  addShippertoShippingUnit,
  deliveredSuccess,
  getShipper,
} from "../controllers/shipperControllers.js";
//app shipping
router
  .route("/shipping/getOrderByShippingUnit")
  .get(
    isAuthenticatedMobileUser,
    authorizeRoles("shipper"),
    getOrderByShippingUnit
  );

router
  .route("/shipper/addShippertoShippingUnit")
  .post(isAuthenticatedUser, authorizeRoles("admin"), addShippertoShippingUnit);
router
  .route("/shipper/deliveredSuccess/:id")
  .get(isAuthenticatedMobileUser, authorizeRoles("shipper"), deliveredSuccess);
router
  .route("/shipper")
  .get(isAuthenticatedMobileUser, authorizeRoles("shipper"), getShipper);
export default router;
