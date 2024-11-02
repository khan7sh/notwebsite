import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-burgundy text-cream p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            <a href="/privacy-policy" className="underline ml-2 hover:text-beige">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAccept}
            className="bg-green hover:bg-opacity-90 text-white px-6 py-2 rounded-md transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-cream hover:text-beige"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 