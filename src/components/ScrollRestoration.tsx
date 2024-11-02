import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollRestoration: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

export default ScrollRestoration; 