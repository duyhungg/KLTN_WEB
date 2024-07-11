import mongoose from "mongoose";

const shipperSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  shippingUnit: {
    shippingUnitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipping",
    },
    shippingCode: {
      type: String,
    },
  },
  totalPriceCOD: {
    type: Number,
    default: 0,
  },
  totalPriceCARD: {
    type: Number,
    default: 0,
  },
});
export default mongoose.model("Shipper", shipperSchema);
