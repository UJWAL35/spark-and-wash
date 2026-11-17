"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/pricing";

const CAROUSEL_IMAGES = [
  {
    src: "/images/main-board.jpg",
    tag: "Main Workshop",
    title: '"AMMA" Spark N\' Wash Centre & Reception',
    desc: "Our primary facility with customer reception, bike & car detailing, Amaron battery service, and accessories.",
    position: "center top",
  },
  {
    src: "/images/wash-bay.jpg",
    tag: "Washing Bay",
    title: "High-Pressure Multi-Vehicle Bay",
    desc: "Equipped with dual elevated wash ramps, underbody wash pits, and commercial-grade high-pressure washing guns.",
    position: "center center",
  },
  {
    src: "/images/car-foam.jpg",
    tag: "Snow Foam Wash",
    title: "Deep Snow Foam Car Treatment",
    desc: "Active pH-neutral thick foam soak that dissolves traffic film, grime, and grease without scratching clear coat.",
    position: "center center",
  },
  {
    src: "/images/bike-foam.jpg",
    tag: "Two-Wheeler Detail",
    title: "Motorcycle & Scooter Foam Wash",
    desc: "Complete engine degreasing, deep spoke and wheel scrub, foam blanket, and high-pressure finishing rinse.",
    position: "center 30%",
  },
];

const WASH_RATES = [
  { name: "Bike Only Water Wash", type: "Two Wheeler", price: 100, badge: "bike", key: "bike_water" },
  { name: "Bike Normal Wash", type: "Two Wheeler", price: 200, badge: "bike", key: "bike_normal" },
  { name: "Bike Diesel Wash", type: "Two Wheeler", price: 300, badge: "bike", key: "bike_diesel" },
  { name: "Car Only Water Wash", type: "Normal / Big Car", price: 200, badge: "car5", key: "car_water" },
  { name: "Car Only Out Side Wash", type: "Normal Car (5 Seater)", price: 300, badge: "car5", key: "car_outside" },
  { name: "Car Out Side Wash Big Vehicle", type: "Big Car (7 Seater / SUV)", price: 400, badge: "car7", key: "car_outside_big" },
  { name: "Car Body Wash 5 Seater", type: "Normal Car (5 Seater)", price: 500, badge: "car5", key: "car_body_5s" },
  { name: "Car Body Wash Diesel Wash 5 Seater", type: "Normal Car (5 Seater)", price: 600, badge: "car5", key: "car_body_diesel_5s" },
  { name: "Car Body Wash 7 Seater", type: "Big Car (7 Seater / SUV)", price: 600, badge: "car7", key: "car_body_7s" },
  { name: "Car Body Wash Diesel Wash 7 Seater", type: "Big Car (7 Seater / SUV)", price: 700, badge: "car7", key: "car_body_diesel_7s" },
  { name: "Car Full Wash 5 Seater", type: "Normal Car (5 Seater)", price: 600, badge: "car5", key: "car_full_5s" },
  { name: "Car Full Wash Diesel Wash (5 Seater)", type: "Normal Car (5 Seater)", price: 700, badge: "car5", key: "car_full_diesel_5s" },
  { name: "Car Full Wash 7 Seater", type: "Big Car (7 Seater / SUV)", price: 700, badge: "car7", key: "car_full_7s" },
  { name: "Car Full Diesel Wash 7 Seater", type: "Big Car (7 Seater / SUV)", price: 800, badge: "car7", key: "car_full_diesel_7s" },
];

const POLISH_RATES = [
  { name: "Normal Polish", normal: 2500, big: 3500, key: "polish_normal" },
  { name: "Interior Polish", normal: 1500, big: 2500, key: "polish_interior" },
  { name: "Teflon Polish", normal: 3500, big: 5500, key: "polish_teflon" },
  { name: "Ceramic Polish", normal: 12500, big: 17500, key: "polish_ceramic" },
  { name: "All Glass Polish", normal: 2500, big: 2500, key: "polish_glass_all" },
  { name: "Front Glass Polish", normal: 1000, big: 1000, key: "polish_glass_front" },
  { name: "Head Light Polish", normal: 600, big: 600, key: "polish_headlight" },
  { name: "Roof Cleaning", normal: 1000, big: 1000, key: "clean_roof" },
  { name: "Seat Cleaning", normal: 1000, big: 1000, key: "clean_seat" },
];

const SERVICES_LIST = [
  {
    num: "01",
    name: "Washing",
    img: "/images/car-foam.jpg",
    desc: "Exterior snow foam hand wash to remove road dirt, mud, and dust for a pristine, streak-free mirror finish.",
    linkText: "Book Wash",
  },
  {
    num: "02",
    name: "Detailing",
    img: "/images/wash-bay.jpg",
    desc: "Full-body machine buffing, gloss restoration, tyre dressing, and paint protection to keep your vehicle in top condition.",
    linkText: "Book Detailing",
  },
  {
    num: "03",
    name: "Cleaning",
    img: "/images/bike-foam.jpg",
    desc: "High-power interior vacuuming, dashboard sanitization, and seat upholstery cleaning for a fresh cabin experience.",
    linkText: "Book Cleaning",
  },
  {
    num: "04",
    name: "Battery & Care",
    img: "/images/main-board.jpg",
    desc: "Authorized Amaron battery sales & health diagnostics, seat cover fitments, and quick two-wheeler repairs.",
    linkText: "Explore More",
  },
];

const REVIEWS = [
  {
    name: "Johan R.",
    role: "Hyundai Creta Owner",
    avatar: "JR",
    stars: 5,
    text: "Fantastic service! My car looks brand new after every foam wash. The dual ramps and high pressure washers make the process quick and thorough.",
  },
  {
    name: "Mr. Johnson",
    role: "Business Owner (Toyota Qualis)",
    avatar: "MJ",
    stars: 5,
    text: "Very professional team and affordable pricing. Booking the time slot online saved me 45 minutes of waiting in line. Highly recommended!",
  },
  {
    name: "Emily R.",
    role: "Regular Customer (Royal Enfield)",
    avatar: "ER",
    stars: 5,
    text: "Quick service with great results! They take extra care with the engine bay, chain degreasing, and alloy polish. I always bring my bike here.",
  },
];

export default function Home() {
  // Circular Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [rateTab, setRateTab] = useState("all");
  const totalSlides = CAROUSEL_IMAGES.length;

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-rotate circular carousel every 4.5 seconds unless user hovers
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  // Compute 3D circular transformation styles for card index
  const getSlideStyle = (index) => {
    const diff = (index - activeSlide + totalSlides) % totalSlides;

    if (diff === 0) {
      // Active Front
      return {
        transform: "translateX(0%) translateZ(0px) rotateY(0deg) scale(1)",
        opacity: 1,
        zIndex: 10,
        pointerEvents: "auto",
        boxShadow: "0 28px 70px rgba(10, 42, 94, 0.28), 0 0 0 2px rgba(21, 101, 232, 0.2)",
      };
    } else if (diff === 1) {
      // Right in 3D circle
      return {
        transform: "translateX(54%) translateZ(-90px) rotateY(-22deg) scale(0.84)",
        opacity: 0.65,
        zIndex: 5,
        cursor: "pointer",
        boxShadow: "0 15px 40px rgba(10, 42, 94, 0.14)",
      };
    } else if (diff === totalSlides - 1) {
      // Left in 3D circle
      return {
        transform: "translateX(-54%) translateZ(-90px) rotateY(22deg) scale(0.84)",
        opacity: 0.65,
        zIndex: 5,
        cursor: "pointer",
        boxShadow: "0 15px 40px rgba(10, 42, 94, 0.14)",
      };
    } else {
      // Back / Opposite
      return {
        transform: "translateX(0%) translateZ(-190px) rotateY(180deg) scale(0.68)",
        opacity: 0,
        zIndex: 1,
        pointerEvents: "none",
      };
    }
  };

  return (
    <main>
      {/* ========================================================
          HERO SECTION (Inspired by Image 1)
          ======================================================== */}
      <section className="hero-wrapper">
        <div className="hero-frame">
          {/* Watermark header */}
          <div className="hero-watermark">
            <span>&ldquo;AMMA&rdquo; SPARK</span>
            <span className="outline-text">WASH</span>
          </div>

          {/* Social icons pill strip */}
          <div className="hero-social-strip">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="social-pill"
              title="Instagram"
              aria-label="Instagram"
            >
              📸
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="social-pill"
              title="Facebook"
              aria-label="Facebook"
            >
              📘
            </a>
            <a
              href="https://wa.me/917975185585"
              target="_blank"
              rel="noreferrer"
              className="social-pill"
              title="WhatsApp"
              aria-label="WhatsApp"
            >
              💬
            </a>
          </div>

          <div className="hero-inner">
            {/* Left Media Box */}
            <div className="hero-media-box">
              <img
                src="/images/car-foam.jpg"
                alt="Active foam wash treatment at AMMA Spark N' Wash"
              />
              <div className="hero-media-overlay" />
              <div className="hero-media-tag">🚗 Touchless Snow Foam</div>
              <div className="hero-media-bottom">
                <div>
                  <b>&ldquo;AMMA&rdquo; Spark N&apos; Wash Bay 1</b>
                  <small>Dual Ramps · High Pressure Guns</small>
                </div>
                <span className="pill done">Live &amp; Ready</span>
              </div>
            </div>

            {/* Right Typography & CTA */}
            <div className="hero-content">
              <h1 className="hero-headline">
                Drive Clean.<br />
                Shine <span className="blue-text">Everywhere.</span>
              </h1>
              <p className="hero-subtext">
                Professional car wash and detailing services that make your vehicle look
                brand new fast, reliable, and eco-friendly. Transparent rates before you arrive.
              </p>
              <div className="hero-ctas">
                <Link className="btn" href="/customer">
                  Book Now
                </Link>
                <Link className="btn alt" href="#pricing">
                  Official Rates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          METRICS & LIVE STATUS (Inspired by Image 4 Typography)
          ======================================================== */}
      <section className="metrics-section wrap" style={{ paddingTop: 0, paddingBottom: 20 }}>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-chip active">Wash Bays</span>
              <span style={{ color: "var(--ok)", fontSize: "1.2rem" }}>●</span>
            </div>
            <div>
              <div className="metric-value">02</div>
              <div className="metric-label">Dual Ramps Ready for Action</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-chip">Avg Service</span>
              <span style={{ color: "var(--blue)", fontSize: "1.1rem" }}>⚡</span>
            </div>
            <div>
              <div className="metric-value">25<span style={{ fontSize: "1.4rem" }}>min</span></div>
              <div className="metric-label">Rapid Wash &amp; Dry Turnaround</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-chip active">Customer Rating</span>
              <span style={{ color: "#f59e0b", fontSize: "1.1rem" }}>★</span>
            </div>
            <div>
              <div className="metric-value">4.9<span style={{ fontSize: "1.4rem" }}>/5</span></div>
              <div className="metric-label">Based on 1,200+ Clean Rides</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-chip">Foam Tech</span>
              <span style={{ color: "var(--blue)", fontSize: "1.1rem" }}>🫧</span>
            </div>
            <div>
              <div className="metric-value">100<span style={{ fontSize: "1.4rem" }}>%</span></div>
              <div className="metric-label">pH-Neutral Active Snow Lift</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CIRCULAR CAROUSEL SECTION (User Request)
          ======================================================== */}
      <section
        id="facility"
        className="carousel-section"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="section-header-center">
          <span className="pill" style={{ marginBottom: 12 }}>
            Interactive Facility Tour
          </span>
          <h2>Our Centre in <span className="blue-text">Action</span></h2>
          <p>
            Explore our actual workshop, customer reception, and dual wash bays.
            Use the circular controls or click any photo to rotate through our centre.
          </p>
        </div>

        {/* 3D Circular Stage */}
        <div className="carousel-stage-container">
          <div className="carousel-stage">
            {CAROUSEL_IMAGES.map((item, idx) => {
              const style = getSlideStyle(idx);
              const isCenter = idx === activeSlide;

              return (
                <div
                  key={item.src}
                  className="carousel-card"
                  style={style}
                  onClick={() => {
                    if (!isCenter) setActiveSlide(idx);
                  }}
                >
                  <div className="carousel-card-img-wrap">
                    <img
                      src={item.src}
                      alt={item.title}
                      style={{ objectPosition: item.position }}
                    />
                    <span className="carousel-card-tag">{item.tag}</span>
                  </div>
                  <div className="carousel-card-body">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="carousel-nav-row">
            <button
              className="circle-nav-btn"
              onClick={prevSlide}
              aria-label="Previous image"
            >
              ←
            </button>

            <div className="carousel-dots">
              {CAROUSEL_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-dot ${idx === activeSlide ? "active" : ""}`}
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Jump to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              className="circle-nav-btn"
              onClick={nextSlide}
              aria-label="Next image"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          OUR SERVICES (Inspired by Image 2 - Dark Navy & White Cards)
          ======================================================== */}
      <section id="services" className="services-dark-wrapper">
        <div className="services-dark-header">
          <h2>Our <span className="blue-text">Services</span></h2>
          <p>
            Complete car &amp; bike care solutions for every need. From quick foam washes
            to full detailing, we&apos;ve got you covered.
          </p>
        </div>

        <div className="services-cards-grid wrap" style={{ padding: 0 }}>
          {SERVICES_LIST.map((s) => (
            <div className="service-white-card" key={s.num}>
              <div className="service-card-img-wrap">
                <img src={s.img} alt={s.name} />
              </div>
              <div className="service-card-body">
                <div>
                  <div className="service-num-title">
                    {s.num}. {s.name}
                  </div>
                  <p className="service-desc">{s.desc}</p>
                </div>
                <Link className="service-card-link" href="/customer">
                  {s.linkText} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          OFFICIAL RATE CARD (From Official Amma Spark N' Wash Board)
          ======================================================== */}
      <section id="pricing" className="pricing-section wrap">
        <div className="section-header-center">
          <span className="pill" style={{ marginBottom: 12 }}>
            Official Rate Card · &ldquo;AMMA&rdquo; SPARK N&apos; WASH
          </span>
          <h2>
            Clear Rates for <span className="blue-text">Washing &amp; Polishing</span>
          </h2>
          <p>
            Standardized rates as displayed at our centre. No hidden charges.
            Select any service to instantly reserve your preferred bay and time slot.
          </p>
        </div>

        <div className="rate-card-container">
          <div className="rate-card-header">
            <div className="rate-card-title">
              <h3>
                <img
                  src="/images/emblem.png"
                  alt="Logo"
                  style={{ height: 32, width: "auto" }}
                />
                &ldquo;AMMA&rdquo; SPARK N&apos; WASH
              </h3>
              <p>Two · Three · Four Wheelers · Car Wash · Polish · Detailing</p>
            </div>
            <div className="rate-tabs" role="tablist">
              <button
                className={`rate-tab-btn ${rateTab === "all" ? "active" : ""}`}
                onClick={() => setRateTab("all")}
              >
                All Rates
              </button>
              <button
                className={`rate-tab-btn ${rateTab === "wash" ? "active" : ""}`}
                onClick={() => setRateTab("wash")}
              >
                Car &amp; Bike Wash (14)
              </button>
              <button
                className={`rate-tab-btn ${rateTab === "polish" ? "active" : ""}`}
                onClick={() => setRateTab("polish")}
              >
                Car Polish (9)
              </button>
            </div>
          </div>

          {(rateTab === "all" || rateTab === "wash") && (
            <div style={{ padding: "26px 28px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h4 style={{ fontSize: "1.2rem", color: "var(--navy)", fontWeight: 700 }}>
                  🚿 Car &amp; Bike Wash Payment
                </h4>
                <span className="pill">14 Wash Services</span>
              </div>
              <div className="rate-table-responsive">
                <table className="rate-table">
                  <thead>
                    <tr>
                      <th>Service Name</th>
                      <th>Category / Vehicle</th>
                      <th>Official Price</th>
                      <th style={{ textAlign: "right" }}>Reserve Bay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WASH_RATES.map((w) => (
                      <tr key={w.key}>
                        <td>
                          <div className="rate-service-name">
                            <span>{w.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`rate-pill ${w.badge}`}>{w.type}</span>
                        </td>
                        <td>
                          <span className="rate-price-tag">₹{w.price}</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <Link href={`/customer`} className="btn sm">
                            Book Slot
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(rateTab === "all" || rateTab === "polish") && (
            <div style={{ padding: "28px 28px 16px", borderTop: rateTab === "all" ? "2px dashed var(--line)" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h4 style={{ fontSize: "1.2rem", color: "var(--navy)", fontWeight: 700 }}>
                  ✨ Car Polish &amp; Detailing Payment
                </h4>
                <span className="pill">9 Polish Treatments</span>
              </div>
              <div className="rate-table-responsive">
                <table className="rate-table">
                  <thead>
                    <tr>
                      <th>Polish Treatment</th>
                      <th>Normal Car (5 Seater)</th>
                      <th>Big Car (7 Seater / SUV)</th>
                      <th style={{ textAlign: "right" }}>Reserve Bay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {POLISH_RATES.map((p) => (
                      <tr key={p.key}>
                        <td>
                          <div className="rate-service-name">
                            <span className="rate-pill polish">Polish</span>
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="rate-price-tag">₹{p.normal.toLocaleString()}</span>
                        </td>
                        <td>
                          <span className="rate-price-tag" style={{ color: "var(--navy)" }}>
                            ₹{p.big.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <Link href={`/customer`} className="btn sm">
                            Book Slot
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="rate-card-footer">
            <div className="rate-card-footer-info">
              <span>💳 <b>Accepted Payments:</b> GPay · PhonePe · Paytm · UPI · Cash</span>
              <span>·</span>
              <span>⚡ <b>Instant Confirmation</b></span>
            </div>
            <Link href="/customer" className="btn">
              Book Any Service Online →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          TESTIMONIALS (Inspired by Image 3)
          ======================================================== */}
      <section id="reviews" className="testimonials-section">
        <div className="wrap" style={{ padding: 0 }}>
          <div className="testimonials-header-row">
            <div>
              <h2>What Our <span className="blue-text">Customers Say</span></h2>
              <p>Trusted by hundreds of happy vehicle owners in the area.</p>
            </div>
            <div className="testimonials-arrows">
              <Link href="/customer" className="btn sm">
                Book Your Wash
              </Link>
            </div>
          </div>

          <div className="testimonials-grid">
            {REVIEWS.map((r, i) => (
              <div className="test-card" key={i}>
                <div>
                  <div className="test-stars">
                    {"★".repeat(r.stars)}
                  </div>
                  <p className="test-quote">&ldquo;{r.text}&rdquo;</p>
                </div>
                <div className="test-author-row">
                  <div className="test-avatar">{r.avatar}</div>
                  <div className="test-author-info">
                    <b>{r.name}</b>
                    <span>{r.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          CONTACT & LOCATION (From Official Business Card)
          ======================================================== */}
      <section id="contact" className="contact-section wrap">
        <div className="contact-card-box">
          <div>
            <div className="contact-title">
              <img
                src="/images/logo.png"
                alt="AMMA Spark N' Wash"
                style={{ height: 46, width: "auto" }}
              />
              <div>
                <h3>&ldquo;AMMA&rdquo; SPARK N&apos; WASH</h3>
                <p style={{ color: "var(--mute-light)", fontSize: "0.9rem" }}>
                  Car Wash &amp; Polish Centre · Bondel, Mangalore
                </p>
              </div>
            </div>

            <div className="contact-detail-row">
              <div className="contact-icon">📍</div>
              <div>
                <b>Workshop Address:</b>
                <p>
                  Door No. : 3-T-7/2 (1), Near Guthige House,<br />
                  Pachanady Village, Near Railway Bridge,<br />
                  Bondel Post, Mangalore Taluk, D.K. - 575008
                </p>
              </div>
            </div>

            <div className="contact-detail-row">
              <div className="contact-icon">📞</div>
              <div>
                <b>Direct Call &amp; Customer Support:</b>
                <div className="contact-phone-links">
                  <a href="tel:7975185585" className="contact-phone-chip">
                    📞 +91 79751 85585
                  </a>
                  <a href="tel:9845846009" className="contact-phone-chip">
                    📞 +91 98458 46009
                  </a>
                  <a
                    href="https://wa.me/917975185585?text=Hello%20AMMA%20Spark%20N%20Wash,%20I%20want%20to%20book%20a%20wash"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-phone-chip"
                    style={{ background: "#25D366", borderColor: "#25D366" }}
                  >
                    💬 WhatsApp Chat
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-hours-box">
            <div>
              <span className="pill done" style={{ marginBottom: 12 }}>
                Open 7 Days a Week
              </span>
              <h4 style={{ color: "#ffffff", fontSize: "1.2rem", marginTop: 8 }}>
                Operating Hours
              </h4>
              <p style={{ color: "#d8e4f8", fontSize: "0.95rem", marginTop: 4 }}>
                Monday – Sunday: 8:00 AM – 7:30 PM
              </p>
            </div>
            <div style={{ marginTop: 24 }}>
              <p style={{ color: "var(--mute-light)", fontSize: "0.85rem", marginBottom: 12 }}>
                Services for Two Wheeler, Three Wheeler, Four Wheeler &amp; Heavy Vehicles.
              </p>
              <Link href="/customer" className="btn" style={{ width: "100%", textAlign: "center", display: "block" }}>
                Reserve Your Time Slot
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
