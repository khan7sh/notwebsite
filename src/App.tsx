import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import BookingPage from './components/BookingPage'
import KenzaCoffeePage from './components/KenzaCoffeePage'
import AboutUsPage from './components/AboutUsPage'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsOfService from './components/TermsOfService'
import MenuPage from './components/MenuPage'
import AdminLogin from './components/admin/AdminLogin'
import AdminPanel from './components/admin/AdminPanel'
import CookieConsent from './components/CookieConsent'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import AllergenInformation from './components/AllergenInformation'
import ScrollToTop from './components/ScrollToTop'
import ScrollRestoration from './components/ScrollRestoration'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollRestoration />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/kenza-coffee" element={<KenzaCoffeePage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/notin" element={<AdminLogin />} />
          <Route path="/notsiyar" element={<AdminPanel />} />
          <Route path="/allergen-information" element={<AllergenInformation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsent />
        <ScrollToTop />
      </Router>
    </ErrorBoundary>
  )
}

export default App
