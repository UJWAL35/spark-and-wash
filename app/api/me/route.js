import { NextResponse } from "next/server";
import { connect, UserModel } from "@/lib/db";
import { customerPhone } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connect();
    const phone = customerPhone();
    if (!phone) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    const user = await UserModel.findOne({ phone }).lean();
    return user
      ? NextResponse.json(user, { headers: { "Cache-Control": "no-store, max-age=0" } })
      : NextResponse.json({ error: "User not found" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Database connection error" }, { status: 500 });
  }
}

export async function POST(req) { // add a vehicle
  try {
    await connect();
    const phone = customerPhone();
    const b = await req.json().catch(() => ({}));
    if (!phone) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    const num = String(b.number || "").toUpperCase().replace(/\s/g, "");
    if (!num || !b.wheeler) return NextResponse.json({ error: "Vehicle number and type are required" }, { status: 400 });

    const existing = await UserModel.findOne({ phone, "vehicles.number": num });
    if (existing) {
      return NextResponse.json({ error: "This vehicle is already added to your account" }, { status: 409 });
    }

    await UserModel.updateOne({ phone }, { $push: { vehicles: { number: num, wheeler: b.wheeler } } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to add vehicle" }, { status: 500 });
  }
}

export async function PATCH(req) { // edit profile details
  try {
    await connect();
    const phone = customerPhone();
    const b = await req.json().catch(() => ({}));
    if (!phone) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    const name = String(b.name || "").trim();
    if (!name) return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });

    await UserModel.updateOne(
      { phone },
      { $set: { name, email: String(b.email || "").trim(), address: String(b.address || "").trim() } }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 });
  }
}
