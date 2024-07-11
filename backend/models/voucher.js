import mongoose from "mongoose";

const voucherSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deliveryFee: {
    type: Boolean,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
export default mongoose.model("Voucher", voucherSchema);
