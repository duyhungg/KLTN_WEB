import express from "express";
const router = express.Router();

import {
  isAuthenticatedUser,
  isAuthenticatedMobileUser,
} from "../middlewares/auth.js";
import {
  stripeCheckoutSession,
  stripeWebhook,
  stripeCheckoutSessionMobile,
  stripeCheckoutSessionShipper,
} from "../controllers/paymentControllers.js";

router
  .route("/payment/checkout_session")
  .post(isAuthenticatedUser, stripeCheckoutSession);
router
  .route("/payment/checkout_session/mobile")
  .post(isAuthenticatedMobileUser, stripeCheckoutSessionMobile);

router
  .route("/shipper/payment/checkout_session")
  .post(isAuthenticatedMobileUser, stripeCheckoutSessionShipper);
router.route("/payment/webhook").post(stripeWebhook);
export default router;
