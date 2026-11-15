import crypto from "crypto";
import { cookies } from "next/headers";

const secret = () => process.env.AUTH_SECRET || "dev-secret";

export const sign = (v) => v + "." + crypto.createHmac("sha256", secret()).update(v).digest("hex");

export function verify(t) {
  if (!t || typeof t !== "string") return null;
  const i = t.lastIndexOf(".");
  if (i <= 0) return null;
  const v = t.slice(0, i);
  const expected = sign(v);
  if (expected.length !== t.length) return null;
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(t)) ? v : null;
  } catch {
    return null;
  }
}

export const setCookie = (res, name, value) =>
  res.cookies.set(name, sign(value), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

export const deleteCookie = (res, name) => {
  res.cookies.set(name, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
};

export const customerPhone = () => {
  try {
    const val = cookies().get("sw_user")?.value;
    return verify(val);
  } catch {
    return null;
  }
};

export const isAdmin = () => {
  try {
    const val = cookies().get("sw_admin")?.value;
    return verify(val) === "admin";
  } catch {
    return false;
  }
};

