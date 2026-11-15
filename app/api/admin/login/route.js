import { NextResponse } from "next/server";
import { setCookie, deleteCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD)
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  setCookie(res, "sw_admin", "admin");
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  deleteCookie(res, "sw_admin");
  return res;
}

