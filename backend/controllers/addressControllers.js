import User from "../models/user.js";
import Address from "../models/address.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
// create shipping info
export const createShippingInfo = catchAsyncErrors(async (req, res, next) => {
  const { address, city, phoneNo, zipCode, country, longitude, latitude } =
    req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (user) {
      const shippingInfo = {
        address: address,
        city: city,
        phoneNo: phoneNo,
        zipCode: zipCode,
        country: country,
        longitude: longitude,
        latitude: latitude,
      };
      let userAddress = await Address.findOne({ user: userId });

      if (!userAddress) {
        userAddress = new Address({
          user: userId,
          shippingInfo: [shippingInfo],
        });
      } else {
        userAddress.shippingInfo.push(shippingInfo);
      }

      await userAddress.save();

      res.status(201).json({
        success: true,
        message: "Shipping info created successfully",
        shippingInfo: shippingInfo,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
// read shipping info
export const getShippingInfo = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  try {
    const userAddress = await Address.findOne({ user: userId });

    if (userAddress) {
      res.status(200).json({
        success: true,
        shippingInfo: userAddress.shippingInfo,
      });
    } else {
      res.status(200).json({
        success: true,
        shippingInfo: [],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//delete
export const deleteAddressInfo = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const addressId = req.params.addressId;

  try {
    const userAddress = await Address.findOneAndUpdate({
      user: userId,
      $pull: { shippingInfo: { _id: addressId } },
      new: true,
    });

    if (userAddress) {
      res.status(200).json({
        success: true,
        message: "Address info deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Address not found for this user",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Update
export const updateAddressInfo = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const addressId = req.params.addressId;
  const { address, city, phoneNo, zipCode, country, longitude, latitude } =
    req.body;

  try {
    const userAddress = await Address.findOneAndUpdate(
      { user: userId, "shippingInfo._id": addressId },
      {
        $set: {
          "shippingInfo.$.address": address,
          "shippingInfo.$.city": city,
          "shippingInfo.$.phoneNo": phoneNo,
          "shippingInfo.$.zipCode": zipCode,
          "shippingInfo.$.country": country,
          "shippingInfo.$.longitude": longitude,
          "shippingInfo.$.latitude": latitude,
        },
      },
      { new: true }
    );

    if (userAddress) {
      res.status(200).json({
        success: true,
        message: "Address info updated successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
// address default
export const addressDefault = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const address = await Address.findOne({ "shippingInfo._id": id });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    address.shippingInfo.forEach((info) => {
      if (info._id.toString() === id) {
        info.isDefault = true;
      } else {
        info.isDefault = false;
      }
    });

    await address.save();

    res.status(200).json({ message: "Default shipping updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
// get address Default
export const getAddressDefault = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  try {
    const defaultAddress = await Address.findOne({
      user: userId,
    });

    const defaultShippingInfo = defaultAddress.shippingInfo.find(
      (info) => info.isDefault
    );

    if (!defaultShippingInfo) {
      return res
        .status(404)
        .json({ message: "Default shipping info not found" });
    }

    res.status(200).json(defaultShippingInfo);
  } catch (error) {
    console.error("Error fetching default address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
