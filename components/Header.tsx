// components/Header.tsx
import Link from 'next/link';

export function Header() {
  return (
    <header className="header">
      <nav className="container">
        <Link href="/" className="logo">
          mps
        </Link>
        <ul className="nav-links">
          {/* These now link to sections on the page */}
          <li><Link href="/#system-overview">System Overview</Link></li>
          <li><Link href="/#about-us">About Us</Link></li>
          <li><Link href="/#contact-us">Contact Us</Link></li>
        </ul>
        <div className="nav-buttons">
          {/* These are now links that look like buttons */}
          <Link href="/#system-overview" className="btn btn-outline">
            Get Started
          </Link>
          <Link href="/#contact-us" className="btn btn-primary">
            Contact Us
          </Link>
        </div>
      </nav>
    </header>
  );
}