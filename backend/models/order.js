import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      phoneNo: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      longitude: {
        type: String,
      },
      latitude: {
        type: String,
      },
      shipping: {
        shippingUnit: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shipping",
        },
        code: {
          type: String,
          unique: true, // Đảm bảo code là duy nhất
        },
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],

    paymentMethod: {
      type: String,
      required: [true, "Please select payment method"],
      enum: {
        values: ["COD", "Card"],
        message: "Please select: COD or Card",
      },
    },
    paymentInfo: {
      id: String,
      status: String,
    },
    itemsPrice: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    voucherInfo: {
      name: {
        type: String,
        // required: true,
      },
      deliveryFee: {
        type: Boolean,
        // required: true,
      },
      discount: {
        type: Number,
        // required: true,
      },
      voucherId: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "Voucher",
      },
    },
    orderStatus: {
      type: String,
      enum: {
        values: [
          "NewOrder",
          "Confirmed",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancel",
        ],
        message: "Please select correct order status",
      },
      default: "NewOrder",
    },
    shippingAmount: {
      type: Number,
      required: true,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

function generateRandomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    let isUnique = false;
    let randomCode = "";
    while (!isUnique) {
      randomCode = generateRandomCode();
      const existingOrder = await mongoose
        .model("Order")
        .findOne({ "shippingInfo.shipping.code": randomCode });
      if (!existingOrder) {
        isUnique = true;
      }
    }

    this.shippingInfo.shipping.code =
      (this.shippingInfo.shipping.code || "") + randomCode;
  }
  next();
});

export default mongoose.model("Order", orderSchema);
