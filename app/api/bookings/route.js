import { NextResponse } from "next/server";
import { connect, BookingModel, UserModel } from "@/lib/db";
import { customerPhone } from "@/lib/auth";
import { priceFor, CAPACITY, SLOTS, SERVICES } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connect();
    const phone = customerPhone();
    if (!phone) return NextResponse.json([], { status: 401 });
    return NextResponse.json(await BookingModel.find({ phone }).sort({ date: -1, slot: -1 }).lean());
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connect();
    const phone = customerPhone();
    if (!phone) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    const b = await req.json().catch(() => ({}));
    const user = await UserModel.findOne({ phone });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const reqVehicle = String(b.vehicleNumber || "").toUpperCase().replace(/\s/g, "");
    const v = user.vehicles?.find((x) => x.number === reqVehicle);
    if (!v) return NextResponse.json({ error: "Please select a valid registered vehicle" }, { status: 400 });
    if (!SLOTS.includes(b.slot)) return NextResponse.json({ error: "Invalid slot time" }, { status: 400 });
    if (!b.date) return NextResponse.json({ error: "Booking date is required" }, { status: 400 });
    if (!SERVICES[b.service]) return NextResponse.json({ error: "Invalid service selected" }, { status: 400 });

    const count = await BookingModel.countDocuments({ date: b.date, slot: b.slot });
    if (count >= CAPACITY) {
      return NextResponse.json({ error: "That slot is already fully booked. Please pick another." }, { status: 409 });
    }

    const duplicate = await BookingModel.findOne({ phone, vehicleNumber: v.number, date: b.date, slot: b.slot });
    if (duplicate) {
      return NextResponse.json({ error: "You already have a booking for this vehicle at that time" }, { status: 409 });
    }

    const booking = await BookingModel.create({
      phone,
      name: user.name,
      vehicleNumber: v.number,
      wheeler: v.wheeler,
      service: b.service,
      amount: priceFor(b.service, v.wheeler),
      date: b.date,
      slot: b.slot,
    });
    return NextResponse.json(booking);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
