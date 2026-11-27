"use client";
import { useEffect, useState } from "react";
import { WHEELERS, SERVICES, priceFor } from "@/lib/pricing";

const api = async (url, method = "GET", body) => {
  const r = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || "Something went wrong");
  return d;
};

// Accurate local date (YYYY-MM-DD) avoiding UTC timezone shifts
const today = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Customer() {
  const [user, setUser] = useState(undefined);
  const load = () => api("/api/me").then(setUser).catch(() => setUser(null));

  useEffect(() => {
    load();
  }, []);

  if (user === undefined) return <p className="wrap">Loading…</p>;

  return user ? (
    <Dashboard user={user} reload={load} />
  ) : (
    <Auth onDone={(userData) => (userData ? setUser(userData) : load())} />
  );
}

function Auth({ onDone }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({
    name: "",
    phone: "",
    number: "",
    wheeler: "4",
    email: "",
    address: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => {
    const val = e.target.value;
    setF((prev) => ({ ...prev, [k]: val }));
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErr("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api("/api/auth", "POST", { ...f, action: mode });
      onDone(res.user);
    } catch (x) {
      setErr(x.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card panel" onSubmit={submit}>
      <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
      <p className="note">
        {mode === "login" ? "Log in with your phone number." : "You only fill this in once."}
      </p>

      {mode === "register" && (
        <label key="field-name">
          Full name
          <input
            required
            placeholder="Your name"
            value={f.name}
            onChange={set("name")}
            disabled={loading}
          />
        </label>
      )}

      <label key="field-phone">
        Phone number
        <input
          required
          type="tel"
          inputMode="numeric"
          placeholder="10-digit mobile number"
          maxLength={15}
          value={f.phone}
          onChange={set("phone")}
          disabled={loading}
        />
      </label>

      {mode === "register" && (
        <>
          <label key="field-number">
            Vehicle number
            <input
              required
              placeholder="e.g. KA19AB1234"
              value={f.number}
              onChange={set("number")}
              disabled={loading}
            />
          </label>
          <label key="field-wheeler">
            Vehicle type
            <select
              value={f.wheeler}
              onChange={set("wheeler")}
              disabled={loading}
            >
              {Object.entries(WHEELERS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label key="field-email">
            Email (optional)
            <input
              type="email"
              placeholder="name@example.com"
              value={f.email}
              onChange={set("email")}
              disabled={loading}
            />
          </label>
          <label key="field-address">
            Address (optional)
            <input
              placeholder="City, area"
              value={f.address}
              onChange={set("address")}
              disabled={loading}
            />
          </label>
        </>
      )}

      {err && <p className="err" role="alert">{err}</p>}

      <p style={{ marginTop: 18 }}>
        <button className="btn" disabled={loading}>
          {loading
            ? mode === "login"
              ? "Logging in…"
              : "Registering…"
            : mode === "login"
            ? "Log in"
            : "Register"}
        </button>
      </p>
      <p className="note" style={{ marginTop: 14 }}>
        <button
          type="button"
          className="btn alt sm"
          disabled={loading}
          onClick={() => switchMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "New here? Register" : "Have an account? Log in"}
        </button>
      </p>
    </form>
  );
}

function Dashboard({ user, reload }) {
  const [tab, setTab] = useState("book");
  const [loggingOut, setLoggingOut] = useState(false);
  const [liveList, setLiveList] = useState([]);

  useEffect(() => {
    let mounted = true;
    const checkLive = () => {
      api("/api/bookings")
        .then((data) => {
          if (mounted && Array.isArray(data)) setLiveList(data);
        })
        .catch(() => {});
    };
    checkLive();
    const timer = setInterval(checkLive, 4000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const washingBooking = liveList.find((b) => b.status === "washing");

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api("/api/auth", "DELETE");
    } finally {
      reload();
    }
  };

  return (
    <main className="wrap">
      <div className="row">
        <h2>Hi, {user.name || "Customer"}</h2>
        <button className="btn alt sm" disabled={loggingOut} onClick={handleLogout}>
          {loggingOut ? "Logging out…" : "Log out"}
        </button>
      </div>
      <div className="tabs" role="tablist">
        {[
          ["book", "Book a wash"],
          [
            "bookings",
            washingBooking ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                My bookings{" "}
                <span
                  className="pill washing-live"
                  style={{ padding: "2px 8px", fontSize: "0.74rem", lineHeight: 1.2 }}
                >
                  <span className="live-dot">●</span> 1 Washing
                </span>
              </span>
            ) : (
              "My bookings"
            ),
          ],
          ["profile", "Profile and vehicles"],
        ].map(([k, l]) => (
          <button
            key={k}
            role="tab"
            className={tab === k ? "on" : ""}
            onClick={() => setTab(k)}
          >
            {l}
          </button>
        ))}
      </div>

      {washingBooking && tab !== "bookings" && (
        <div className="live-wash-alert-banner" onClick={() => setTab("bookings")}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="live-dot">●</span>
            <span>
              <b>Wash In Progress:</b> Vehicle <b>{washingBooking.vehicleNumber}</b> is currently on the ramp being washed in {washingBooking.bay || "Bay 1"}!
            </span>
          </div>
          <span className="btn sm" style={{ padding: "4px 14px", fontSize: "0.82rem" }}>
            Track Live →
          </span>
        </div>
      )}

      {tab === "book" && <Book user={user} onBooked={() => setTab("bookings")} />}
      {tab === "bookings" && <Bookings />}
      {tab === "profile" && <Profile user={user} reload={reload} />}
    </main>
  );
}

function Book({ user, onBooked }) {
  const vehicles = user.vehicles || [];
  const [vehicle, setVehicle] = useState(vehicles[0]?.number || "");
  const [service, setService] = useState("car_full_5s");
  const [date, setDate] = useState(today());
  const [slots, setSlots] = useState([]);
  const [slot, setSlot] = useState("");
  const [err, setErr] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Pre-select service from URL if provided
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("service");
      if (s && SERVICES[s]) {
        setService(s);
      }
    }
  }, []);

  // Automatically keep vehicle selection valid if vehicles change
  useEffect(() => {
    if ((!vehicle || !vehicles.some((x) => x.number === vehicle)) && vehicles.length > 0) {
      setVehicle(vehicles[0].number);
    }
  }, [vehicles, vehicle]);

  const v = vehicles.find((x) => x.number === vehicle) || vehicles[0];

  useEffect(() => {
    setSlot("");
    api(`/api/slots?date=${date}`)
      .then(setSlots)
      .catch(() => setSlots([]));
  }, [date]);

  const past = (s) => {
    if (date < today()) return true;
    if (date === today()) {
      const now = new Date();
      const currentHM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      return s <= currentHM;
    }
    return false;
  };

  const book = async () => {
    if (!v) {
      setErr("Please select or add a vehicle first.");
      return;
    }
    setBookingLoading(true);
    setErr("");
    try {
      await api("/api/bookings", "POST", {
        vehicleNumber: vehicle || v.number,
        service,
        date,
        slot,
      });
      onBooked();
    } catch (x) {
      setErr(x.message);
      api(`/api/slots?date=${date}`)
        .then(setSlots)
        .catch(() => {});
    } finally {
      setBookingLoading(false);
    }
  };

  if (!vehicles.length) {
    return (
      <div className="card" style={{ maxWidth: 640 }}>
        <p className="note">
          No vehicles registered on your account. Please add a vehicle in &ldquo;Profile and vehicles&rdquo; first.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <label>
        Vehicle
        <select value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
          {vehicles.map((x) => (
            <option key={x.number} value={x.number}>
              {x.number} ({WHEELERS[x.wheeler] || x.wheeler})
            </option>
          ))}
        </select>
      </label>
      <label>
        Service
        <select value={service} onChange={(e) => setService(e.target.value)}>
          <optgroup label="Car & Bike Wash Payment">
            {Object.entries(SERVICES)
              .filter(([_, s]) => s.category === "wash")
              .map(([k, s]) => (
                <option key={k} value={k}>
                  {s.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="Car Polish Payment">
            {Object.entries(SERVICES)
              .filter(([_, s]) => s.category === "polish")
              .map(([k, s]) => (
                <option key={k} value={k}>
                  {s.name}
                </option>
              ))}
          </optgroup>
        </select>
      </label>
      <label>
        Date
        <input
          type="date"
          min={today()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <label>Available slots</label>
      <div className="slots">
        {slots.map(({ slot: s, left }) => (
          <button
            key={s}
            type="button"
            className={`slot ${slot === s ? "on" : ""}`}
            disabled={!left || past(s)}
            onClick={() => setSlot(s)}
          >
            {s}
            <small>{past(s) ? "Passed" : left ? `${left} left` : "Full"}</small>
          </button>
        ))}
      </div>
      <div className="row" style={{ marginTop: 16 }}>
        <div>
          <span className="note">Amount to pay</span>
          <div className="price">₹{v ? priceFor(service, v.wheeler) : 0}</div>
        </div>
        <button
          className="btn"
          disabled={!slot || bookingLoading}
          onClick={book}
        >
          {bookingLoading ? "Booking…" : "Confirm booking"}
        </button>
      </div>
      {err && <p className="err" role="alert">{err}</p>}
    </div>
  );
}

function Bookings() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchBookings = () => {
      api("/api/bookings")
        .then((data) => {
          if (mounted && Array.isArray(data)) setRows(data);
        })
        .catch(() => {
          if (mounted) setRows((prev) => prev || []);
        });
    };

    fetchBookings();
    // Auto-poll every 3.5 seconds to instantly reflect admin acceptance or wash updates
    const interval = setInterval(fetchBookings, 3500);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!rows) return <p className="wrap">Loading your bookings…</p>;
  if (!rows.length)
    return <p className="note">No bookings yet. Use “Book a wash” to pick a slot.</p>;

  const upi = process.env.NEXT_PUBLIC_UPI_ID || "sparkandwash@upi";

  // Identify any active wash in progress or pending acceptance
  const activeWash = rows.find((b) => b.status === "washing");
  const pendingWash = !activeWash && rows.find((b) => b.status === "pending");
  const featured = activeWash || pendingWash || (rows[0]?.status === "done" ? rows[0] : null);

  return (
    <div>
      {/* ========================================================
          LIVE WASH TRACKER CARD (User Request: Track vehicle being washed)
          ======================================================== */}
      {featured && (
        <div className={`live-tracker-card ${featured.status === "washing" ? "active-wash-glow" : ""}`}>
          <div className="tracker-top-header">
            <div className="tracker-headline">
              <span
                className={`pill ${
                  featured.status === "washing"
                    ? "washing-live"
                    : featured.status === "done"
                    ? "done"
                    : "pending"
                }`}
              >
                {featured.status === "washing" ? (
                  <>
                    <span className="live-dot">●</span> 🚿 LIVE IN {featured.bay || "BAY 1"} (BEING WASHED)
                  </>
                ) : featured.status === "done" ? (
                  "✅ WASH COMPLETED · READY FOR PICKUP"
                ) : (
                  "⏳ AWAITING WASH BAY ACCEPTANCE"
                )}
              </span>
              <h3 className="tracker-title">
                {featured.status === "washing"
                  ? "Your vehicle is currently on the ramp being washed!"
                  : featured.status === "done"
                  ? "Your vehicle is sparkling clean and ready for pickup!"
                  : "Booking confirmed! Waiting for bay operator assignment."}
              </h3>
              <p className="tracker-subtitle">
                {featured.status === "washing"
                  ? `Admin has accepted your service. High-pressure wash, snow foam & underbody rinse active in ${featured.bay || "Bay 1"}.`
                  : featured.status === "done"
                  ? "Washing and inspection are complete. Please collect your vehicle from the bay."
                  : "Operator will accept and place your vehicle on the wash ramp shortly."}
              </p>
            </div>
            <div className="tracker-vehicle-badge">
              <b>{featured.vehicleNumber}</b>
              <span>{WHEELERS[featured.wheeler] || featured.wheeler}</span>
            </div>
          </div>

          {/* 3-Step Visual Progress Stepper */}
          <div className="wash-stepper">
            <div className="step-item completed">
              <div className="step-circle">✓</div>
              <div className="step-info">
                <b>1. Confirmed</b>
                <small>{featured.slot} · {featured.date}</small>
              </div>
            </div>

            <div className={`step-line ${featured.status === "washing" || featured.status === "done" ? "active" : ""}`} />

            <div className={`step-item ${featured.status === "washing" ? "current-wash" : featured.status === "done" ? "completed" : ""}`}>
              <div className="step-circle">
                {featured.status === "done" ? "✓" : "🚿"}
              </div>
              <div className="step-info">
                <b>2. Wash Bay Ramp</b>
                <small>
                  {featured.status === "washing"
                    ? `Washing in ${featured.bay || "Bay 1"}`
                    : featured.status === "done"
                    ? "Washed"
                    : "In Queue"}
                </small>
              </div>
            </div>

            <div className={`step-line ${featured.status === "done" ? "active" : ""}`} />

            <div className={`step-item ${featured.status === "done" ? "completed" : ""}`}>
              <div className="step-circle">
                {featured.status === "done" ? "✨" : "3"}
              </div>
              <div className="step-info">
                <b>3. Ready for Pickup</b>
                <small>{featured.status === "done" ? "Clean & ready" : "Pending completion"}</small>
              </div>
            </div>
          </div>

          {/* Animated Horizontal Progress Bar */}
          <div className="wash-bar-wrap">
            <div
              className={`wash-bar-fill ${featured.status === "washing" ? "animated-wash-bar" : ""}`}
              style={{
                width:
                  featured.status === "done"
                    ? "100%"
                    : featured.status === "washing"
                    ? "66%"
                    : "33%",
              }}
            />
          </div>

          <div className="tracker-footer">
            <div>
              <span className="note">Service Type</span>
              <div style={{ fontWeight: 700, color: "var(--navy)" }}>
                {SERVICES[featured.service]?.name}
              </div>
            </div>
            <div>
              <span className="note">Amount</span>
              <div className="price" style={{ fontSize: "1.3rem" }}>
                ₹{featured.amount}
              </div>
            </div>
            <div>
              {featured.paid ? (
                <span className="pill paid">Paid via {featured.method}</span>
              ) : (
                <a
                  className="btn sm"
                  href={`upi://pay?pa=${upi}&pn=${encodeURIComponent('"AMMA" SPARK N\' WASH')}&am=${featured.amount}&cu=INR&tn=${encodeURIComponent('Wash ' + featured.vehicleNumber)}`}
                >
                  Pay ₹{featured.amount} with UPI
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ALL VEHICLE BOOKING CARDS
          ======================================================== */}
      <h3 style={{ margin: "24px 0 16px", color: "var(--navy)", fontSize: "1.25rem" }}>
        Booking History &amp; Status
      </h3>
      <div className="grid3">
        {rows.map((b) => (
          <div
            className={`card tilt ${b.status === "washing" ? "card-washing-active" : ""}`}
            key={b._id}
          >
            <div className="row">
              <b>{b.vehicleNumber}</b>
              {b.status === "washing" ? (
                <span className="pill washing-live">
                  <span className="live-dot">●</span> 🚿 In {b.bay || "Bay 1"}
                </span>
              ) : b.status === "done" ? (
                <span className="pill done">✅ Completed</span>
              ) : (
                <span className="pill pending">⏳ Queued</span>
              )}
            </div>
            <p style={{ fontWeight: 600, marginTop: 6 }}>{SERVICES[b.service]?.name}</p>
            <p className="note" style={{ fontSize: "0.85rem", marginTop: 2 }}>
              {b.date} at {b.slot}
            </p>

            {/* Mini Progress Bar inside card */}
            <div style={{ width: "100%", height: 6, background: "#e9f0fc", borderRadius: 99, margin: "14px 0 10px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  background: b.status === "done" ? "#10b981" : "var(--blue)",
                  width: b.status === "done" ? "100%" : b.status === "washing" ? "66%" : "33%",
                  transition: "width 0.4s",
                }}
              />
            </div>

            <div className="price">₹{b.amount}</div>
            <div style={{ marginTop: 12 }}>
              {b.paid ? (
                <span className="pill paid">Paid via {b.method}</span>
              ) : (
                <a
                  className="btn sm"
                  style={{ width: "100%", textAlign: "center", display: "block" }}
                  href={`upi://pay?pa=${upi}&pn=${encodeURIComponent('"AMMA" SPARK N\' WASH')}&am=${b.amount}&cu=INR&tn=${encodeURIComponent('Wash ' + b.vehicleNumber)}`}
                >
                  Pay with GPay / PhonePe / Paytm
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile({ user, reload }) {
  const [f, setF] = useState({ number: "", wheeler: "4" });
  const [p, setP] = useState({
    name: user.name || "",
    email: user.email || "",
    address: user.address || "",
  });
  const [msg, setMsg] = useState("");
  const [vehicleMsg, setVehicleMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [addingVehicle, setAddingVehicle] = useState(false);
  const vehicles = user.vehicles || [];

  useEffect(() => {
    setP({
      name: user.name || "",
      email: user.email || "",
      address: user.address || "",
    });
  }, [user]);

  const handleSaveProfile = async () => {
    if (!p.name.trim()) {
      setMsg("Name cannot be empty");
      return;
    }
    setSaving(true);
    setMsg("");
    try {
      await api("/api/me", "PATCH", p);
      setMsg("Saved successfully");
      setTimeout(() => setMsg(""), 3000);
      reload();
    } catch (x) {
      setMsg(x.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddVehicle = async () => {
    const num = f.number.trim().toUpperCase().replace(/\s/g, "");
    if (!num) return;
    setAddingVehicle(true);
    setVehicleMsg("");
    try {
      await api("/api/me", "POST", { number: num, wheeler: f.wheeler });
      setF({ number: "", wheeler: "4" });
      setVehicleMsg("Vehicle added successfully");
      setTimeout(() => setVehicleMsg(""), 3000);
      reload();
    } catch (x) {
      setVehicleMsg(x.message);
    } finally {
      setAddingVehicle(false);
    }
  };

  return (
    <div className="grid3" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
      <div className="card">
        <h3>Your details</h3>
        <label>
          Name
          <input
            value={p.name}
            onChange={(e) => setP({ ...p, name: e.target.value })}
            disabled={saving}
          />
        </label>
        <label>
          Email
          <input
            value={p.email}
            onChange={(e) => setP({ ...p, email: e.target.value })}
            disabled={saving}
          />
        </label>
        <label>
          Address
          <input
            value={p.address}
            onChange={(e) => setP({ ...p, address: e.target.value })}
            disabled={saving}
          />
        </label>
        <p style={{ marginTop: 14 }}>
          <button
            className="btn sm"
            disabled={saving}
            onClick={handleSaveProfile}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>{" "}
          <span className="note">{msg}</span>
        </p>
      </div>
      <div className="card">
        <h3>Your vehicles</h3>
        <ul style={{ margin: "10px 0 0 18px" }}>
          {vehicles.map((v) => (
            <li key={v.number}>
              {v.number} · {WHEELERS[v.wheeler] || v.wheeler}
            </li>
          ))}
          {!vehicles.length && <li className="note">No vehicles registered.</li>}
        </ul>
        <label>
          Add a vehicle
          <input
            placeholder="Vehicle number"
            value={f.number}
            onChange={(e) => setF({ ...f, number: e.target.value })}
            disabled={addingVehicle}
          />
        </label>
        <label>
          Type
          <select
            value={f.wheeler}
            onChange={(e) => setF({ ...f, wheeler: e.target.value })}
            disabled={addingVehicle}
          >
            {Object.entries(WHEELERS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <p style={{ marginTop: 14 }}>
          <button
            className="btn sm"
            disabled={!f.number.trim() || addingVehicle}
            onClick={handleAddVehicle}
          >
            {addingVehicle ? "Adding…" : "Add vehicle"}
          </button>{" "}
          <span className="note">{vehicleMsg}</span>
        </p>
      </div>
    </div>
  );
}
