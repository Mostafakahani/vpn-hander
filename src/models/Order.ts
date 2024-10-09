// models/Order.ts
import mongoose, { Schema, model, Model } from "mongoose";
// تابع برای ساخت کلید تصادفی 6 کاراکتری
function generateAccessKey() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < 6; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}
export interface IOrder {
  product: {
    id: string;
    volume: string;
    duration: string;
    price: number;
  };
  phone: string;
  email?: string;
  status: "pending" | "completed";
  paymentStatus: "pending" | "completed";
  accessLink: string | null;
  accessKey: string | null;

  expireAt: Date;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  product: {
    id: { type: String, required: true },
    volume: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
  },
  phone: {
    type: String,
    required: true,
  },
  email: String,
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  accessLink: { type: String, default: null },
  accessKey: { type: String, unique: true, default: null }, // تعریف accessKey
  expireAt: {
    type: Date,
    default: Date.now, // تنظیم زمان فعلی
    index: { expires: "30d" }, // حذف سند پس از 24 ساعت
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook برای ساختن accessKey در صورت نبود
OrderSchema.pre("save", async function (next) {
  if (!this.accessKey) {
    let uniqueKey = false;
    while (!uniqueKey) {
      const newKey = generateAccessKey();
      const existingOrder = await mongoose.models.OrderVPN.findOne({
        accessKey: newKey,
      });
      if (!existingOrder) {
        this.accessKey = newKey; // قرار دادن کلید یونیک
        uniqueKey = true;
      }
    }
  }
  next();
});
const OrderModel: Model<IOrder> =
  mongoose.models.OrderVPN || model<IOrder>("OrderVPN", OrderSchema);

export default OrderModel;
