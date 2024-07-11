import express from "express";
import {
  canUserReview,
  createProductReview,
  deleteProduct,
  deleteProductImage,
  deleteReview,
  getAdminProducts,
  getProductDetails,
  getProductReviews,
  getProducts,
  newProduct,
  updateProduct,
  uploadProductImages,
  getFavouriteProduct,
  Sort,
} from "../controllers/productControllers.js";
import {
  authorizeRoles,
  isAuthenticatedUser,
  isAuthenticatedMobileUser,
} from "../middlewares/auth.js";
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/sort").get(Sort);
router.route("/products/popular").get(getFavouriteProduct);
router
  .route("/admin/products")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct)
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

router.route("/products/:id").get(getProductDetails);

router
  .route("/admin/products/:id/upload_images")
  .put(isAuthenticatedUser, authorizeRoles("admin"), uploadProductImages);

router
  .route("/admin/products/:id/delete_image")
  .put(isAuthenticatedUser, authorizeRoles("admin"), deleteProductImage);

router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router
  .route("/admin/products/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router
  .route("/reviews")
  .get(isAuthenticatedUser, getProductReviews)
  .put(isAuthenticatedUser, createProductReview);

router
  .route("/admin/reviews")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

router.route("/can_review").get(isAuthenticatedUser, canUserReview);
// mobile route
router.route("/mobile/products").get(getProducts);
router.route("/mobile/sort").get(Sort);
router.route("/mobile/products/popular").get(getFavouriteProduct);

router.route("/mobile/products/:id").get(getProductDetails);

router
  .route("/mobile/reviews")
  .get(isAuthenticatedMobileUser, getProductReviews)
  .put(isAuthenticatedMobileUser, createProductReview);

router.route("/mobile/can_review").get(isAuthenticatedMobileUser, canUserReview);
export default router;
