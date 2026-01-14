import LandingNavbar from "../components/landing/LandingNavbar.jsx";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-bgApp-light dark:bg-bgApp-dark text-textMain-light dark:text-textMain-dark">
      {/* Landing Navbar (public) */}
      <LandingNavbar />

      {/* Hero Section */}
      <main className="overflow-hidden">
        <Hero />

        {/* Features Section Wrapper */}
        <section className="container py-24">
          <Features />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
