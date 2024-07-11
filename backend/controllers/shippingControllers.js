import Shipping from "../models/shipping.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
// create shipping unit
export const createShippingUnit = catchAsyncErrors(async (req, res, next) => {
  const { name, code, description, price } = req.body;
  const shipping = await Shipping.create({
    name,
    code,
    description,
    price,
  });
  res.status(200).json({
    shipping,
  });
});
// get shipping unit
export const getShippingUnit = catchAsyncErrors(async (req, res, next) => {
  const shipping = await Shipping.find();
  res.status(200).json({
    shipping: shipping,
  });
});
// get shipping unit by id
export const getShippingUnitById = catchAsyncErrors(async (req, res, next) => {
  const shipping = await Shipping.findById(req?.params?.id);
  res.status(200).json({
    shipping: shipping,
  });
});
// update shipping unit
export const updateShippingUnit = catchAsyncErrors(async (req, res, next) => {
  let shipping = await Shipping.findById(req?.params?.id);
  if (!shipping) {
    return next(new ErrorHandler("Shipping unit not found", 404));
  }
  shipping = await Shipping.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });
  res.status(200).json({
    shipping: shipping,
  });
});
// delete shipping
export const deleteShippingUnit = catchAsyncErrors(async (req, res, next) => {
  let shipping = await Shipping.findById(req?.params?.id);
  if (!shipping) {
    return next(new ErrorHandler("Shipping unit not found", 404));
  }
  shipping = await Shipping.findByIdAndDelete(req?.params?.id);
  res.status(200).json({
    success: true,
  });
});
//
