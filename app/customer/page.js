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
          ["bookings", "My bookings"],
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
      {tab === "book" && <Book user={user} onBooked={() => setTab("bookings")} />}
      {tab === "bookings" && <Bookings />}
      {tab === "profile" && <Profile user={user} reload={reload} />}
    </main>
  );
}

function Book({ user, onBooked }) {
  const vehicles = user.vehicles || [];
  const [vehicle, setVehicle] = useState(vehicles[0]?.number || "");
  const [service, setService] = useState("basic");
  const [date, setDate] = useState(today());
  const [slots, setSlots] = useState([]);
  const [slot, setSlot] = useState("");
  const [err, setErr] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

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
          {Object.entries(SERVICES).map(([k, s]) => (
            <option key={k} value={k}>
              {s.name}
            </option>
          ))}
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
    api("/api/bookings")
      .then(setRows)
      .catch(() => setRows([]));
  }, []);
  if (!rows) return <p>Loading…</p>;
  if (!rows.length)
    return <p className="note">No bookings yet. Use “Book a wash” to pick a slot.</p>;
  const upi = process.env.NEXT_PUBLIC_UPI_ID || "sparkandwash@upi";
  return (
    <div className="grid3">
      {rows.map((b) => (
        <div className="card tilt" key={b._id}>
          <div className="row">
            <b>{b.vehicleNumber}</b>
            <span className={`pill ${b.status}`}>{b.status}</span>
          </div>
          <p>{SERVICES[b.service]?.name}</p>
          <p className="note">
            {b.date} at {b.slot}
          </p>
          <div className="price">₹{b.amount}</div>
          {b.paid ? (
            <span className="pill paid">Paid via {b.method}</span>
          ) : (
            <a
              className="btn sm"
              href={`upi://pay?pa=${upi}&pn=Spark%20and%20Wash&am=${b.amount}&cu=INR&tn=Wash%20${b.vehicleNumber}`}
            >
              Pay with GPay / PhonePe / Paytm
            </a>
          )}
        </div>
      ))}
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
