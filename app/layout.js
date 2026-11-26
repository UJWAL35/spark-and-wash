import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: '"AMMA" SPARK N\' WASH | Car & Bike Wash Centre',
  description: 'Official car & bike wash, touchless snow foam, and detailing centre. "AMMA" SPARK N\' WASH Mangalore.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="soap-bg-layer" aria-hidden="true">
          <span className="soap-vert-text left">&ldquo;AMMA&rdquo; SPARK N&apos; WASH &nbsp;|&nbsp; CAR &amp; BIKE WASH</span>
          <span className="soap-vert-text right">&ldquo;AMMA&rdquo; SPARK N&apos; WASH &nbsp;|&nbsp; FOAM &amp; POLISH</span>
          <span className="soap-bubble b1" />
          <span className="soap-bubble b2" />
          <span className="soap-bubble b3" />
          <span className="soap-bubble b4" />
          <span className="soap-bubble b5" />
          <span className="soap-bubble b6" />
          <span className="soap-bubble b7" />
          <span className="soap-bubble b8" />
          <span className="soap-bubble b9" />
          <span className="soap-bubble b10" />
        </div>
        <header className="nav">
          <Link href="/" className="logo">
            <img
              src="/images/emblem.png"
              alt="AMMA SPARK N' WASH Logo"
              className="nav-logo-img"
            />
            <span className="brand-badge">&ldquo;AMMA&rdquo;</span>
            <span>SPARK<b>N&apos;</b>WASH</span>
          </Link>
          <nav>
            <Link href="/#services">Services</Link>
            <Link href="/#facility">Our Centre</Link>
            <Link href="/#pricing">Official Rates</Link>
            <Link href="/#reviews">Reviews</Link>
            <Link href="/#contact">Contact</Link>
            <Link href="/customer" className="ghost">Book a Wash</Link>
            <Link href="/admin" style={{ opacity: 0.7, fontSize: "0.86rem", fontWeight: 500 }}>
              Admin
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
