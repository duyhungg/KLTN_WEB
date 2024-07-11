import Voucher from "../models/voucher.js";
import User from "../models/user.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
export const createVoucher = catchAsyncErrors(async (req, res, next) => {
  const { name, description, deliveryFee, discount, quantity } = req.body;
  const voucher = await Voucher.create({
    name,
    description,
    deliveryFee,
    discount,
    quantity,
  });
  res.status(200).json({
    voucher: voucher,
  });
});
export const getAllVoucher = catchAsyncErrors(async (req, res, next) => {
  const voucher = await Voucher.find();
  res.status(200).json({
    voucher: voucher,
  });
});
export const getVoucherbyId = catchAsyncErrors(async (req, res, next) => {
  const voucher = await Voucher.findById(req?.params?.voucherId);
  if (!voucher) {
    return next(new ErrorHandler("voucher not found"));
  }
  res.status(200).json({
    voucher: voucher,
  });
});
export const updateVoucher = catchAsyncErrors(async (req, res, next) => {
  let voucher = await Voucher.findById(req?.params?.voucherId);
  if (!voucher) {
    return next(new ErrorHandler("Voucher not found", 404));
  }
  voucher = await Voucher.findByIdAndUpdate(req?.params?.voucherId, req.body, {
    new: true,
  });
  res.status(200).json({ voucher: voucher });
});
export const deleteVoucher = catchAsyncErrors(async (req, res, next) => {
  let voucher = await Voucher.findById(req?.params?.voucherId);
  if (!voucher) {
    return next(new ErrorHandler("Voucher not found", 404));
  }
  voucher = await Voucher.findByIdAndDelete(req?.params?.voucherId);
  res.status(200).json({ success: true });
});

export const addVoucher = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const voucherId = req.params.voucherId;

  const voucher = await Voucher.findById(voucherId);
  if (!voucher) {
    return next(new ErrorHandler("Voucher not found", 404));
  }

  const check = await User.findOne({ _id: userId, voucher: voucherId });
  if (check) {
    return next(new ErrorHandler("Voucher already exists for this user", 400));
  }

  if (voucher.quantity <= 0) {
    return next(new ErrorHandler("Voucher out of stock", 400));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { voucher: voucherId } },
    { new: true }
  );

  voucher.quantity -= 1;
  await voucher.save();

  res.status(200).json({
    success: true,
    user,
  });
});

export const useVoucher = catchAsyncErrors(async (req, res, next) => {
  const voucherId = req.params.voucherId;

  const voucher = await Voucher.findById(voucherId);
  if (!voucher) {
    return next(new ErrorHandler("Voucher not found", 404));
  }

  if (voucher.quantity <= 0) {
    return next(new ErrorHandler("Voucher out of stock", 400));
  }

  voucher.quantity -= 1;
  await voucher.save();

  res.status(200).json({
    success: true,
  });
});
