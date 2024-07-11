import express from "express";
const router = express.Router();
import {
  authorizeRoles,
  isAuthenticatedUser,
  isAuthenticatedMobileUser,
} from "../middlewares/auth.js";
import {
  createVoucher,
  getAllVoucher,
  updateVoucher,
  deleteVoucher,
  addVoucher,
  useVoucher,
  getVoucherbyId,
} from "../controllers/voucherControllers.js";
router.route("/voucher/createVoucher").post(createVoucher);
router.route("/voucher/getAllVoucher").get(getAllVoucher);
router.route("/voucher/updateVoucher/:voucherId").put(updateVoucher);
router.route("/voucher/deleteVoucher/:voucherId").delete(deleteVoucher);
router
  .route("/voucher/addVoucher/:voucherId")
  .get(isAuthenticatedUser, addVoucher);
router
  .route("/voucher/useVoucher/:voucherId")
  .get(isAuthenticatedUser, useVoucher);
router
  .route("/voucher/getVoucherbyId/:voucherId")
  .get(isAuthenticatedUser, getVoucherbyId);
// mobile route
router.route("/mobile/voucher/createVoucher").post(createVoucher);
router.route("/mobile/voucher/getAllVoucher").get(getAllVoucher);
router.route("/mobile/voucher/updateVoucher/:voucherId").put(updateVoucher);
router.route("/mobile/voucher/deleteVoucher/:voucherId").delete(deleteVoucher);
router
  .route("/mobile/voucher/addVoucher/:voucherId")
  .get(isAuthenticatedMobileUser, addVoucher);
router
  .route("/mobile/voucher/useVoucher/:voucherId")
  .get(isAuthenticatedMobileUser, useVoucher);
router
  .route("/mobile/voucher/getVoucherbyId/:voucherId")
  .get(isAuthenticatedMobileUser, getVoucherbyId);
export default router;
