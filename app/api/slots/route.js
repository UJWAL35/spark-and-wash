import { NextResponse } from "next/server";
import { connect, BookingModel } from "@/lib/db";
import { SLOTS, CAPACITY } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connect();
    const date = new URL(req.url).searchParams.get("date");
    if (!date) {
      return NextResponse.json(SLOTS.map((s) => ({ slot: s, left: CAPACITY })));
    }
    const rows = await BookingModel.aggregate([{ $match: { date } }, { $group: { _id: "$slot", n: { $sum: 1 } } }]);
    const used = Object.fromEntries(rows.map((r) => [r._id, r.n]));
    return NextResponse.json(SLOTS.map((s) => ({ slot: s, left: Math.max(0, CAPACITY - (used[s] || 0)) })));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
