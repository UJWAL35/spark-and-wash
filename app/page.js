"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/pricing";

const CAROUSEL_IMAGES = [
  {
    src: "/images/main-board.jpg",
    tag: "Main Workshop",
    title: "Spark N' Wash Centre & Reception",
    desc: "Our primary workshop facility with customer reception, bike detailing, battery diagnostics, and accessories.",
    position: "center top",
  },
  {
    src: "/images/wash-bay.jpg",
    tag: "Washing Bay",
    title: "High-Pressure Multi-Vehicle Bay",
    desc: "Equipped with dual elevated wash ramps, underbody wash pits, and commercial-grade pressure washing guns.",
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
            <span>SPARK</span>
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
              href="https://wa.me"
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
                alt="Active foam wash treatment at Spark N' Wash"
              />
              <div className="hero-media-overlay" />
              <div className="hero-media-tag">🚗 Touchless Snow Foam</div>
              <div className="hero-media-bottom">
                <div>
                  <b>Spark N&apos; Wash Bay 1</b>
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
                brand new fast, reliable, and eco-friendly. Transparent prices before you arrive.
              </p>
              <div className="hero-ctas">
                <Link className="btn" href="/customer">
                  Book Now
                </Link>
                <Link className="btn alt" href="#services">
                  See Services
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
          PRICING TABLE (Transparent Rates)
          ======================================================== */}
      <section id="pricing" className="pricing-section wrap">
        <div className="section-header-center">
          <span className="pill" style={{ marginBottom: 12 }}>Transparent Rates</span>
          <h2>Clear Pricing for <span className="blue-text">Every Vehicle</span></h2>
          <p>
            Know exactly what you pay before booking. No surprise add-ons. Pay after completion with GPay, PhonePe, Paytm or Cash.
          </p>
        </div>

        <div className="grid3">
          {Object.values(SERVICES).map((s) => (
            <div className="card tilt" key={s.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>{s.name}</h3>
                <span className="pill">Standard</span>
              </div>
              <p className="note" style={{ margin: "10px 0 16px" }}>
                Price depends on vehicle category
              </p>
              <table>
                <tbody>
                  <tr>
                    <td>Two wheeler</td>
                    <td className="price" style={{ fontSize: "1.1rem" }}>₹{s.price["2"]}</td>
                  </tr>
                  <tr>
                    <td>Auto / 3 Wheeler</td>
                    <td>₹{s.price["3"]}</td>
                  </tr>
                  <tr>
                    <td>Four wheeler</td>
                    <td>₹{s.price["4"]}</td>
                  </tr>
                  <tr>
                    <td>Heavy vehicle</td>
                    <td>₹{s.price.heavy}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: 22 }}>
                <Link
                  className="btn sm"
                  style={{ width: "100%", display: "block", textAlign: "center" }}
                  href="/customer"
                >
                  Book {s.name}
                </Link>
              </div>
            </div>
          ))}
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
    </main>
  );
}
