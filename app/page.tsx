// page.tsx
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <>
      {/* Hero Section (background is in globals.css) */}
      <section className="hero">
        <div className="hero-content container">
          <h1>Predict Multiple Diseases<br />with Confidence</h1>
          <p>Our cutting-edge system uses advanced AI to predict multiple diseases from a single platform, enabling early intervention and personalized treatment plans. Improve patient outcomes and reduce healthcare costs.</p>
          <div className="hero-buttons">
            <Link href="/#system-overview">
                <Button variant="outline" className="btn-outline-light">Get Started</Button>
            </Link>
            <Link href="/#contact-us">
              <Button className="bg-white text-black hover:bg-gray-200">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="system-overview" className="solutions-section">
        <div className="container">
          <div className="solutions-text">
            <h2>Our Solutions for a Healthier Future with Predictive Analytics</h2>
            <p>Discover how our multi-disease prediction system can revolutionize healthcare. We offer advanced solutions that provide early and accurate disease predictions, seamlessly integrating with existing healthcare systems. Our platform supports real-time analytics, enhancing diagnostic confidence and improving patient outcomes. Explore our key offerings below to learn more.</p>
          </div>
          <div className="card-grid-three">
            <div className="card">
              {/* Image Updated */}
              <Image src="/solution-parkinsons.jpeg" alt="Parkinson's Disease Prediction" width={600} height={400} />
              <h3>Parkinson's Disease Prediction</h3>
              <p>Assess your Parkinson's risk early. Our tool uses AI to identify subtle indicators, empowering you with crucial health insights.</p>
              <Link href="/parkinsons"><Button variant="outline" className="btn-card-outline">Get Started</Button></Link>
            </div>
            <div className="card">
              {/* Image Updated */}
              <Image src="/solution-heart.jpeg" alt="Heart Disease Prediction" width={600} height={400} />
              <h3>Heart Disease Prediction</h3>
              <p>Predict your heart disease risk in seconds. Our model analyzes key health markers to give you an early warning, helping you take control of your cardiovascular health.</p>
              <Link href="/heart-disease"><Button variant="outline" className="btn-card-outline">Get Started</Button></Link>
            </div>
            <div className="card">
              {/* Image Updated */}
              <Image src="/solution-diabetes.jpeg" alt="Diabetes Risk Assessment Tool" width={600} height={400} />
              <h3>Diabetes Risk Assessment Tool</h3>
              <p>Our AI-powered tool assesses your risk of developing diabetes based on your health data. This supports crucial preventive care and allows for timely intervention.</p>
              <Link href="/diabetes"><Button variant="outline" className="btn-card-outline">Get Started</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="card-grid-four">
            <div className="feature-card">
              <Image src="/feature-predictions.jpeg" alt="Early Predictions" width={600} height={400} />
              <h3>Early and Accurate Predictions</h3>
              <p>Our system ensures early and accurate disease detection.</p>
            </div>
            <div className="feature-card">
              <Image src="/feature-integration.jpeg" alt="Data Integration" width={600} height={400} />
              <h3>Seamless Data Integration</h3>
              <p>Integrate our system seamlessly with your existing healthcare data systems.</p>
            </div>
            <div className="feature-card">
              <Image src="/feature-analytics.jpeg" alt="Real-Time Analytics" width={600} height={400} />
              <h3>Real-Time Analytics Support</h3>
              <p>Our platform supports real-time analytics for faster insights.</p>
            </div>
            <div className="feature-card">
              <Image src="/feature-diagnostics.jpeg" alt="Enhanced Diagnostics" width={600} height={400} />
              <h3>Enhanced Diagnostic Confidence</h3>
              <p>Enhance diagnostic confidence with our system's comprehensive analysis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="about-us" className="mission-section">
        <div className="container mission-content">
          <div className="mission-image">
            <Image src="/mission-history.jpeg" alt="Team of doctors collaborating" width={800} height={600} />
          </div>
          <div className="mission-text">
            <h2>Our Mission & History</h2>
            <p>Founded in 2023, Multi-Disease Prediction System aims to revolutionize early diagnosis with AI-driven insights. Our team of experts has collaborated with top healthcare institutions to develop reliable, accessible health prediction tools.</p>
            <div className="stats-grid">
              <div className="stat-item"><span className="stat-number">150 k</span><span className="stat-label">Patients Empowered</span></div>
              <div className="stat-item"><span className="stat-number">5000 +</span><span className="stat-label">Trusted Users Worldwide</span></div>
              <div className="stat-item"><span className="stat-number">120 %</span><span className="stat-label">Accuracy Improvement</span></div>
              <div className="stat-item"><span className="stat-number">98 %</span><span className="stat-label">Prediction Accuracy</span></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}