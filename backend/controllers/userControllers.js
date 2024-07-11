import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { delete_file, upload_file } from "../utils/cloudinary.js";

// Register user => /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate random OTP
  const otp = Math.floor(100000 + Math.random() * 900000); // generate a 6-digit OTP

  try {
    // Save OTP to user record
    user.otp = otp;
    user.newEmail = email;
    await user.save();

    // Send OTP to user via email
    await sendEmail({
      email: email,
      subject: "OTP Verification",
      message: `Your OTP for registration is: ${otp}`,
    });

    return res.status(200).json({
      message: `Email sent to: ${email}`,
      otp: otp,
    });
  } catch (error) {
    return next(new ErrorHandler(error?.message, 500));
  }
});

// Check OTP => /api/v1/check-otp
export const checkOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if OTP matches
  if (user.otp === otp) {
    user.verify = true;
    user.otp = undefined;
    await user.save();

    return res.status(200).json({ user, message: "OTP verified successfully" });
  } else {
    return res.status(401).json({ message: "Invalid OTP" });
  }
});

// Login user   =>  /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // Find user in the database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  if (!user.verify) {
    return next(new ErrorHandler("You have not verified your email yet"));
  }

  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Logout user   =>  /api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  // res.cookie('token', null, {
  //   expires: new Date(Date.now()),
  //   httpOnly: true,
  // })
  const user = await User.findByIdAndUpdate(req?.user?._id, {
    token: null,
    expires: new Date(Date.now()),
  });

  res.clearCookie("token", { httpOnly: true });

  res.status(200).json({
    message: "Logged Out",
  });
});

// Upload user avatar   =>  /api/v1/me/upload_avatar
export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  const avatarResponse = await upload_file(req.body.avatar, "TLCN/avatars");

  // Remove previous avatar
  if (req?.user?.avatar?.url) {
    await delete_file(req?.user?.avatar?.public_id);
  }

  const user = await User.findByIdAndUpdate(req?.user?._id, {
    avatar: avatarResponse,
  });

  res.status(200).json({
    user,
  });
});

// Forgot password   =>  /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // Find user in the database
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }
  if (!user.verify) {
    return next(new ErrorHandler("You have not verified your email yet"));
  }
  // Get reset password token
  const resetToken = user.getResetPasswordToken();
  const newOtp = Math.floor(100000 + Math.random() * 900000); // generate a 6-digit OTP
  user.otp = newOtp;
  await user.save();

  // Create reset password url
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = getResetPasswordTemplate(user?.name, resetUrl, newOtp);

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      message,
    });

    res.status(200).json({
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return next(new ErrorHandler(error?.message, 500));
  }
});
//
export const passwordChange = catchAsyncErrors(async (req, res, next) => {});
// Reset password   =>  /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash the URL Token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.otp !== user.otp) {
    return next(new ErrorHandler("your otp is not correct"));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords does not match", 400));
  }

  // Set the new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});

// Get current user profile  =>  /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);

  res.status(200).json({
    user,
  });
});

// Update Password  =>  /api/v1/password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select("+password");

  // Check the previous user password
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  user.password = req.body.password;
  user.save();

  res.status(200).json({
    success: true,
  });
});

// Update User Profile  =>  /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findById(req.user._id);

  if (user.email !== newUserData.email) {
    // Generate random OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // generate a 6-digit OTP
    try {
      // Save OTP to user record
      user.otp = otp;
      user.newName = req.body.name;
      user.newEmail = req.body.email;
      await user.save();

      // Send OTP to user via email
      await sendEmail({
        email: user.email,
        subject: "OTP Verification",
        message: `Your OTP for registration is: ${otp}`,
      });
      res.status(200).json({
        message: `Email sent to: ${user.email}`,
        email: user.email,
        otp: otp,
      });
    } catch (error) {
      return next(new ErrorHandler(error?.message, 500));
    }
  } else {
    const users = await User.findByIdAndUpdate(req.user._id, newUserData, {
      new: true,
    });
    res.status(200).json({
      users,
    });
  }
});
// check otp change email => api/v1/checkOtpChangeEmail
export const checkOtpChangeEmail = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const checkOtp = req.body.otp;
  if (checkOtp === user.otp) {
    const otp = Math.floor(100000 + Math.random() * 900000); // generate a 6-digit OTP
    user.otp = otp;
    await user.save();

    await sendEmail({
      email: user.newEmail,
      subject: "OTP Verification",
      message: `Your OTP for registration is: ${otp}`,
    });
    res.status(200).json({
      message: `Email sent to: ${user.newEmail}`,
      email: user.newEmail,
      otp: otp,
    });
  }
});
// check otp change email => api/v1/checkOtpNewEmail
export const checkOtpNewEmail = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const checkOtp = req.body.otp;
  const newUserData = {
    name: user.newName,
    email: user.newEmail,
  };
  if (checkOtp === user.otp) {
    const result = await User.findByIdAndUpdate(req.user._id, newUserData, {
      new: true,
    });
    user.otp = undefined;
    //user.newEmail = undefined;
    user.newName = undefined;
    await user.save();
    res.status(200).json({
      result,
    });
  } else {
    return next(new ErrorHandler("your OTP is nit correct", 400));
  }
});
// Get all Users - ADMIN  =>  /api/v1/admin/users
export const allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    users,
  });
});

// Get User Details - ADMIN  =>  /api/v1/admin/users/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    user,
  });
});

// Update User Details - ADMIN  =>  /api/v1/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
  });

  res.status(200).json({
    user,
  });
});

// Delete User - ADMIN  =>  /api/v1/admin/users/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }

  // Remove user avatar from cloudinary
  if (user?.avatar?.public_id) {
    await delete_file(user?.avatar?.public_id);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
});
// test api for mobile
// Forgot password endpoint  =>  /api/v1/password/forgot
export const forgotPasswordMobile = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  // Find the user with the provided email
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Generate a secure, random OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Set OTP and expiration on the user

  try {
    // Save OTP to user record
    user.otp = otp;
    await user.save();

    // Send OTP to user via email
    await sendEmail({
      email: email,
      subject: "OTP Verification",
      message: `Your OTP for registration is: ${otp}`,
    });

    return res.status(200).json({
      message: `Email sent to: ${email}`,
      otp: otp,
    });
  } catch (error) {
    return next(new ErrorHandler(error?.message, 500));
  }
});
// Reset password with OTP => /api/v1/password/reset/otp
export const resetPasswordWithOTP = catchAsyncErrors(async (req, res, next) => {
  const { otp, password, confirmPassword } = req.body;

  const user = await User.findOne({
    otp,
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  // Set new password
  user.password = password;

  // Clear OTP fields
  user.otp = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});
export const updatePoint = catchAsyncErrors(async (req, res, next) => {
  const { point } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: req?.user?._id },
    { point: point },
    { new: true }
  );

  res.status(200).json({
    user,
  });
});
// find User -   =>  /api/v1/admin/users/:id
export const findUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    name: user.name,
    avatar: user.avatar,
  });
});
