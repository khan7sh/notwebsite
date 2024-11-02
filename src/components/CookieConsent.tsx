import React, { useState } from 'react';

const CookieConsent: React.FC = () => {
  const [accepted, setAccepted] = useState(() => {
    return localStorage.getItem('cookieConsent') === 'true';
  });

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setAccepted(true);
  };

  const shouldShowCookieConsent = () => {
    const currentPath = window.location.pathname;
    return !currentPath.includes('/admin') && 
           !currentPath.includes('/notin') && 
           !currentPath.includes('/notsiyar');
  };

  if (accepted || !shouldShowCookieConsent()) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t-2 border-burgundy">
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-sm text-gray-700">
            <p>
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
              <a 
                href="/privacy-policy" 
                className="text-burgundy hover:text-opacity-80 underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Learn more
              </a>
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleAccept}
              className="bg-burgundy text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors duration-200 text-sm font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 