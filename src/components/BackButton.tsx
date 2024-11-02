import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC = () => {
  return (
    <Link to="/" className="inline-flex items-center text-burgundy hover:text-green transition-colors mb-8">
      <ArrowLeft className="mr-2" size={24} />
      Back to Home
    </Link>
  );
};

export default BackButton; 