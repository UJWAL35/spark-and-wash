import { NextResponse } from "next/server";
import { connect, BookingModel } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connect();
    const date = new URL(req.url).searchParams.get("date");
    return NextResponse.json(await BookingModel.find(date ? { date } : {}).sort({ date: 1, slot: 1 }).lean());
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to load bookings" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connect();
    const { id, status, paid, method } = await req.json().catch(() => ({}));
    if (!id) return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });

    const set = {};
    if (status) set.status = status;
    if (paid) { set.paid = true; set.method = method || "UPI"; set.paidAt = new Date(); }
    await BookingModel.updateOne({ _id: id }, { $set: set });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to update booking" }, { status: 500 });
  }
}
