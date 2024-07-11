import express from "express";
const router = express.Router();
import {
  authorizeRoles,
  isAuthenticatedUser,
  isAuthenticatedMobileUser,
} from "../middlewares/auth.js";
import {
  createShippingUnit,
  getShippingUnit,
  getShippingUnitById,
  updateShippingUnit,
  deleteShippingUnit,
} from "../controllers/shippingControllers.js";
router
  .route("/shipping/createShippingUnit")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createShippingUnit);
router.route("/shipping/getShippingUnit").get(getShippingUnit);

router.route("/shipping/getShippingUnitById/:id").get(getShippingUnitById);

router
  .route("/shipping/updateShippingUnit/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateShippingUnit);

router
  .route("/shipping/deleteShippingUnit/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteShippingUnit);
export default router;
