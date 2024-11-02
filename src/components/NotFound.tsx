import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-burgundy mb-4">404</h1>
        <p className="text-2xl text-brown mb-8">Page Not Found</p>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-burgundy text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors"
          >
            <Home className="mr-2" size={20} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center bg-green text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 