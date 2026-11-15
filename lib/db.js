import mongoose from "mongoose";

let cached = global._mongo || (global._mongo = { conn: null, promise: null });

export async function connect() {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Please check your .env.local file.");
  }

  if (!cached.promise || mongoose.connection.readyState === 0) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    }).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }

  return cached.conn;
}

const vehicle = new mongoose.Schema({ number: String, wheeler: String, label: String }, { _id: false });
const User = new mongoose.Schema({
  name: String, phone: { type: String, unique: true }, email: String, address: String, vehicles: [vehicle],
}, { timestamps: true });
const Booking = new mongoose.Schema({
  phone: String, name: String, vehicleNumber: String, wheeler: String,
  service: String, amount: Number, date: String, slot: String,
  status: { type: String, default: "pending" }, // pending | washing | done
  paid: { type: Boolean, default: false }, method: String, paidAt: Date,
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model("User", User);
export const BookingModel = mongoose.models.Booking || mongoose.model("Booking", Booking);
