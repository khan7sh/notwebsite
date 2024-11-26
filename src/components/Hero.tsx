import React from 'react'
import heroImage from '../assets/hero_image.jpg'
import { Link, useNavigate } from 'react-router-dom'

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleBookTable = () => {
    navigate('/booking');
  }

  return (
    <section className="relative bg-cover bg-center min-h-screen flex items-center" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6" data-aos="fade-up">
          <span className="text-beige">Welcome to</span>{' '}
          <span className="text-beige">Noshe Cambridge</span>
        </h1>
        <div className="max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          <p className="text-lg md:text-2xl mb-8 font-light text-cream">
            Discover the perfect blend of artisanal coffee house and Afghan restaurant
          </p>
        </div>
        <div className="flex justify-center mb-8" data-aos="fade-up" data-aos-delay="300">
          <div className="bg-burgundy bg-opacity-80 p-4 md:p-6 rounded-lg">
            <table className="text-cream text-sm md:text-base">
              <tbody>
                <tr>
                  <td className="px-2 md:px-4 py-1 md:py-2 border-b border-cream">Tuesday - Saturday</td>
                  <td className="px-2 md:px-4 py-1 md:py-2 border-b border-cream">8:00 AM - 11:00 PM</td>
                </tr>
                <tr>
                  <td className="px-2 md:px-4 py-1 md:py-2 border-b border-cream">Sunday</td>
                  <td className="px-2 md:px-4 py-1 md:py-2 border-b border-cream">9:00 AM - 10:00 PM</td>
                </tr>
                <tr>
                  <td className="px-2 md:px-4 py-1 md:py-2">Monday</td>
                  <td className="px-2 md:px-4 py-1 md:py-2">Closed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div 
          className="mb-8 relative max-w-3xl mx-auto" 
          data-aos="fade-up" 
          data-aos-delay="350"
        >
          <div className="bg-burgundy/80 backdrop-blur-sm p-8 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 animate-snowfall pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-50"></div>
            </div>
            <div className="relative z-10">
              <h3 className="text-cream font-serif text-2xl md:text-3xl lg:text-4xl mb-3">
                Book Your Winter Corporate Event
              </h3>
              <p className="text-cream/90 text-base md:text-lg">
                Perfect for business meetings, team dinners & festive celebrations
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4" data-aos="fade-up" data-aos-delay="400">
          <button onClick={handleBookTable} className="btn btn-primary w-full sm:w-auto px-4 sm:px-8">Book a Table</button>
          <a href="https://noshe-orders.pharmix.co.uk/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full sm:w-auto px-4 sm:px-8">Order Online</a>
        </div>
      </div>
    </section>
  )
}

export default Hero
