import express from "express";
import {
  allUsers,
  deleteUser,
  forgotPassword,
  getUserDetails,
  getUserProfile,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile,
  updateUser,
  uploadAvatar,
  checkOTP,
  forgotPasswordMobile,
  resetPasswordWithOTP,
  checkOtpChangeEmail,
  checkOtpNewEmail,
  updatePoint,
  findUser,
} from "../controllers/userControllers.js";
const router = express.Router();

import {
  authorizeRoles,
  isAuthenticatedUser,
  isAuthenticatedMobileUser,
} from "../middlewares/auth.js";

router.route("/register").post(registerUser);
router.route("/check").post(checkOTP);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/password/forgot/mobile").post(forgotPasswordMobile);
router.route("/password/reset").put(resetPasswordWithOTP);

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router
  .route("/me/checkOtpChangeEmail")
  .post(isAuthenticatedUser, checkOtpChangeEmail);
router
  .route("/me/checkOtpNewEmail")
  .post(isAuthenticatedUser, checkOtpNewEmail);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/upload_avatar").put(isAuthenticatedUser, uploadAvatar);
router.route("/updatePoint").put(isAuthenticatedUser, updatePoint);
router.route("/findUser/:id").get(isAuthenticatedUser, findUser);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);

router
  .route("/admin/users/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
// mobile route
router.route("/mobile/register").post(registerUser);
router.route("/mobile/check").post(checkOTP);
router.route("/mobile/login").post(loginUser);
router.route("/mobile/logout").get(logout);

router.route("/mobile/password/forgot").post(forgotPassword);
router.route("/mobile/password/reset/:token").put(resetPassword);

router.route("/mobile/password/forgot/mobile").post(forgotPasswordMobile);
router.route("/mobile/password/reset").put(resetPasswordWithOTP);

router.route("/mobile/me").get(isAuthenticatedMobileUser, getUserProfile);
router.route("/mobile/me/update").put(isAuthenticatedMobileUser, updateProfile);
router
  .route("/mobile/me/checkOtpChangeEmail")
  .post(isAuthenticatedMobileUser, checkOtpChangeEmail);
router
  .route("/mobile/me/checkOtpNewEmail")
  .post(isAuthenticatedMobileUser, checkOtpNewEmail);
router
  .route("/mobile/password/update")
  .put(isAuthenticatedMobileUser, updatePassword);
router
  .route("/mobile/me/upload_avatar")
  .put(isAuthenticatedMobileUser, uploadAvatar);
router.route("/mobile/updatePoint").put(isAuthenticatedMobileUser, updatePoint);
router.route("/mobile/findUser/:id").get(isAuthenticatedMobileUser, findUser);
export default router;
