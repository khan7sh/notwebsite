import React from 'react';
import BackButton from './BackButton';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const AllergenInformation: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <h1 className="text-4xl font-bold text-burgundy mb-8">Allergen Information</h1>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-400 mr-2" size={24} />
            <p className="text-sm">
              If you have any food allergies or special dietary requirements, please inform our staff before placing your order.
            </p>
          </div>
        </div>

        <div className="prose prose-burgundy">
          <h2>Common Allergens in Our Kitchen</h2>
          <p>Our dishes may contain the following allergens:</p>
          <ul>
            <li>Nuts and Peanuts</li>
            <li>Milk and Dairy Products</li>
            <li>Gluten (in our breads and some sauces)</li>
            <li>Eggs</li>
            <li>Soya</li>
            <li>Sesame Seeds</li>
          </ul>

          <h2>Cross-Contamination</h2>
          <p>While we take precautions to avoid cross-contamination, our kitchen handles all of the above allergens and we cannot guarantee that any dish is completely free from any allergen.</p>
        </div>
      </div>
    </div>
  );
};

export default AllergenInformation; 