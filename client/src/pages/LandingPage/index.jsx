import Hero from '@components/landing-page/Hero';
import Features from '@components/landing-page/Features';
import Footer from '@components/landing-page/Footer';

const LandingPage = () => (
  <div data-testid="landing-page">
    <Hero />
    <Features />
    <Footer />
  </div>
);

export default LandingPage;
