"use client";
import { useEffect, useState, useCallback } from "react";
import { SERVICES, WHEELERS } from "@/lib/pricing";

// Accurate local date (YYYY-MM-DD) avoiding UTC timezone shifts
const today = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const call = async (url, method = "GET", body) => {
  const r = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || "Request failed");
  return d;
};

// urgent = still pending/washing and its slot started more than 15 minutes ago, or starts within 30 minutes
const urgent = (b) => {
  if (b.status === "done" || b.date !== today()) return false;
  if (!b.slot || !b.slot.includes(":")) return false;
  const [h, m] = b.slot.split(":").map(Number);
  const n = new Date();
  const diff = h * 60 + m - (n.getHours() * 60 + n.getMinutes());
  return diff <= 30;
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(today());
  const [rows, setRows] = useState(null);

  const load = useCallback(
    () =>
      call(`/api/admin/bookings?date=${date}`)
        .then((d) => {
          setRows(d);
          setAuthed(true);
        })
        .catch(() => setAuthed(false)),
    [date]
  );

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await call("/api/admin/login", "POST", { password: pw });
      setPw("");
      load();
    } catch (x) {
      setErr(x.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await call("/api/admin/login", "DELETE");
    } finally {
      setAuthed(false);
      setRows(null);
    }
  };

  if (!authed)
    return (
      <form className="card panel" onSubmit={handleLogin}>
        <h2>&ldquo;AMMA&rdquo; SPARK N&apos; WASH · Admin</h2>
        <label>
          Password
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            disabled={loading}
          />
        </label>
        {err && <p className="err" role="alert">{err}</p>}
        <p style={{ marginTop: 16 }}>
          <button className="btn" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>
        </p>
      </form>
    );

  const list = (rows || []).slice().sort((a, b) => (urgent(b) - urgent(a)) || (a.slot || "").localeCompare(b.slot || ""));
  const paidTotal = list.filter((b) => b.paid).reduce((s, b) => s + (b.amount || 0), 0);
  const dueTotal = list.filter((b) => !b.paid).reduce((s, b) => s + (b.amount || 0), 0);
  const update = (id, patch) => call("/api/admin/bookings", "PATCH", { id, ...patch }).then(load);

  const handleRecordPayment = (id) => {
    const m = window.prompt("Paid via (GPay, PhonePe, Paytm, Cash)?", "GPay");
    if (m && m.trim()) {
      update(id, { paid: true, method: m.trim() });
    }
  };

  return (
    <main className="wrap">
      <div className="row">
        <h2>&ldquo;AMMA&rdquo; SPARK N&apos; WASH · Wash Control</h2>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input type="date" style={{ width: "auto" }} value={date} onChange={(e) => setDate(e.target.value)} />
          <button className="btn alt sm" onClick={handleLogout}>Log out</button>
        </div>
      </div>
      <div className="stats">
        <div className="card stat"><span className="note">Washing now</span><b>{list.filter((b) => b.status === "washing").length}</b></div>
        <div className="card stat"><span className="note">Needs attention</span><b>{list.filter(urgent).length}</b></div>
        <div className="card stat"><span className="note">Collected</span><b>₹{paidTotal}</b></div>
        <div className="card stat"><span className="note">Pending payment</span><b>₹{dueTotal}</b></div>
      </div>
      <div className="card scroll"><table>
        <thead><tr><th>Time</th><th>Vehicle</th><th>Customer</th><th>Service</th><th>Live Wash Status</th><th>Payment</th><th>Actions</th></tr></thead>
        <tbody>
          {list.map((b) => (
            <tr key={b._id} className={`${urgent(b) ? "urgent" : ""} ${b.status === "washing" ? "row-washing" : ""}`}>
              <td><b>{b.slot}</b></td>
              <td><b>{b.vehicleNumber}</b><br /><span className="note">{WHEELERS[b.wheeler] || b.wheeler}</span></td>
              <td>{b.name}<br /><span className="note">{b.phone}</span></td>
              <td><b>{SERVICES[b.service]?.name}</b></td>
              <td>
                {b.status === "washing" ? (
                  <span className="pill washing-live">
                    <span className="live-dot">●</span> 🚿 In {b.bay || "Bay 1"} (Washing)
                  </span>
                ) : b.status === "done" ? (
                  <span className="pill done">✅ Wash Complete</span>
                ) : (
                  <span className={`pill ${urgent(b) ? "urgent" : "pending"}`}>
                    {urgent(b) ? "⏳ Urgent Queued" : "⏳ Awaiting Bay"}
                  </span>
                )}
              </td>
              <td>{b.paid ? <span className="pill paid">₹{b.amount} · {b.method}</span> : <>₹{b.amount} due</>}</td>
              <td>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                  {b.status === "pending" && (
                    <>
                      <button
                        className="btn sm"
                        title="Accept service and place on Bay 1 ramp"
                        onClick={() => update(b._id, { status: "washing", bay: "Bay 1" })}
                      >
                        🚿 Accept &amp; Bay 1
                      </button>
                      <button
                        className="btn alt sm"
                        title="Accept service and place on Bay 2 ramp"
                        onClick={() => update(b._id, { status: "washing", bay: "Bay 2" })}
                      >
                        Bay 2
                      </button>
                    </>
                  )}
                  {b.status === "washing" && (
                    <button
                      className="btn sm"
                      style={{ background: "#10b981", borderColor: "#10b981" }}
                      title="Mark wash as completed"
                      onClick={() => update(b._id, { status: "done" })}
                    >
                      ✅ Mark Done
                    </button>
                  )}
                  {!b.paid && (
                    <button className="btn alt sm" onClick={() => handleRecordPayment(b._id)}>
                      Record payment
                    </button>
                  )}
                </div>
              </td>
            </tr>))}
          {!list.length && <tr><td colSpan={7} className="note">No bookings for this date.</td></tr>}
        </tbody></table></div>
    </main>
  );
}
