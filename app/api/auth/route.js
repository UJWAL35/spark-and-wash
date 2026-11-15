import { NextResponse } from "next/server";
import { connect, UserModel } from "@/lib/db";
import { setCookie, deleteCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connect();
    const b = await req.json().catch(() => ({}));
    const phone = String(b.phone || "").replace(/\D/g, "").slice(-10);
    if (phone.length !== 10) {
      return NextResponse.json({ error: "Enter a valid 10-digit phone number" }, { status: 400 });
    }

    let user = await UserModel.findOne({ phone }).lean();

    if (b.action === "login") {
      if (!user) {
        return NextResponse.json({ error: "No account found for this number. Please register first." }, { status: 404 });
      }
    } else {
      if (user) {
        return NextResponse.json({ error: "This number is already registered. Please log in." }, { status: 409 });
      }
      const name = String(b.name || "").trim();
      const vehicleNumber = String(b.number || "").toUpperCase().replace(/\s/g, "");
      const wheeler = String(b.wheeler || "4").trim();

      if (!name) {
        return NextResponse.json({ error: "Full name is required" }, { status: 400 });
      }
      if (!vehicleNumber) {
        return NextResponse.json({ error: "Vehicle number is required" }, { status: 400 });
      }
      if (!wheeler) {
        return NextResponse.json({ error: "Vehicle type is required" }, { status: 400 });
      }

      const email = String(b.email || "").trim();
      const address = String(b.address || "").trim();

      const created = await UserModel.create({
        name,
        phone,
        email,
        address,
        vehicles: [{ number: vehicleNumber, wheeler }],
      });
      user = JSON.parse(JSON.stringify(created));
    }

    const res = NextResponse.json({ ok: true, user });
    setCookie(res, "sw_user", phone);
    return res;
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json({ error: err.message || "Authentication failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  deleteCookie(res, "sw_user");
  return res;
}
