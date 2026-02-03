import Header from './components/Header';
import Footer from './components/Footer';
import Router from './Router';
import CookieConsent from './components/CookieConsent';
import BookingTracker from './components/BookingTracker';
import HtmlLangUpdater from './components/HtmlLangUpdater';

export default function App() {
  return (
    <>
      <HtmlLangUpdater />
      <BookingTracker />
      <Header />

      {/* Full-width routes like the homepage banner */}
      <div style={{ paddingTop: '5rem' }}>
        <Router />
      </div>

      <Footer />
      <CookieConsent />
    </>
  );
}
