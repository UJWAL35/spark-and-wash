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
