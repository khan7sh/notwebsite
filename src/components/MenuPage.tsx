import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ShoppingBag } from 'lucide-react';
import AOS from 'aos';
import menuPDF from '../assets/menu.pdf';
import BackButton from './BackButton';

const MenuPage: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.refresh();
    
    // Convert PDF to base64
    fetch(menuPDF)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPdfUrl(reader.result as string);
        };
        reader.readAsDataURL(blob);
      });
  }, []);

  const handleOrderClick = () => {
    setIsLoading(true);
    window.location.href = 'https://noshe-orders.pharmix.co.uk/';
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <h1 className="text-5xl font-bold text-burgundy mb-4 text-center" data-aos="fade-down">Our Menu</h1>
        <p className="text-xl text-gray-600 mb-8 text-center" data-aos="fade-up" data-aos-delay="200">Discover our delightful selection of coffee and treats</p>
        
        <div className="w-full mb-8 rounded-lg overflow-hidden shadow-xl menu-pdf-container" data-aos="zoom-in" data-aos-delay="400">
          {pdfUrl && (
            <iframe 
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-none pdf-iframe"
              title="Kenza Coffee Menu"
            >
              This browser does not support PDFs. Please download the PDF to view it.
            </iframe>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12" data-aos="fade-up" data-aos-delay="600">
          <a 
            href={menuPDF}
            download 
            className="inline-flex items-center justify-center bg-burgundy text-white py-3 px-6 rounded-full hover:bg-green transition-colors shadow-md w-full sm:w-auto"
          >
            <Download className="mr-2" size={20} />
            Download Menu
          </a>
          <a 
            onClick={handleOrderClick}
            className={`inline-flex items-center justify-center ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green hover:bg-burgundy'
            } text-white py-3 px-6 rounded-full transition-colors shadow-md w-full sm:w-auto`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              <>
                <ShoppingBag className="mr-2" size={20} />
                Order Online
              </>
            )}
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-burgundy mb-4 text-center">Additional Information</h2>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Please note: A 10% service charge is automatically added to your bill.
          </p>
          <p className="text-lg text-gray-700 text-center">
            <span className="font-semibold">(Vg)</span> - Vegan | <span className="font-semibold">(V)</span> - Vegetarian | <span className="font-semibold">*</span> - Gluten Free
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
