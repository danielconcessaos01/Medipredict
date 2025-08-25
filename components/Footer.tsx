// components/Footer.tsx
import Link from 'next/link';

export function Footer() {
  // Added id="contact-us" to the footer tag
  return (
    <footer id="contact-us">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><Link href="#">About Us</Link></li>
              <li><Link href="#">Team</Link></li>
              <li><Link href="#">Careers</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><Link href="#">System Overview</Link></li>
              <li><Link href="#">Use Cases</Link></li>
              <li><Link href="#">Technology</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><Link href="#">Contact Us</Link></li>
              <li><Link href="#">FAQ</Link></li>
              <li><Link href="#">Help Center</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Subscribe</h4>
            <p>Stay up-to-date with the latest advancements in multi-disease prediction.</p>
            <form className="subscribe-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit" className="btn btn-primary-footer">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Multi-Disease Prediction System. All rights reserved.</p>
          <div className="footer-links">
            <Link href="#">Terms-and-conditions</Link>
            <Link href="#">Privacy-policy</Link>
          </div>
          <div className="social-icons">
            <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
            <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.793 4.649-.418.113-.86.172-1.314.172-.304 0-.598-.03-.886-.084.63 1.953 2.455 3.374 4.623 3.415-1.621 1.274-3.666 2.032-5.89 2.032-.382 0-.76-.022-1.13-.067 2.099 1.348 4.594 2.129 7.283 2.129 8.745 0 13.528-7.247 13.528-13.528 0-.206-.005-.411-.013-.615.928-.67 1.733-1.512 2.37-2.457z"/></svg></a>
          </div>
        </div>
      </div>
    </footer>
  );
}