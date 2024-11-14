import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-brown text-cream py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-cream">Contact Us</h3>
          <ul className="space-y-2 text-base">
            <li className="flex items-center">
              <MapPin className="mr-2 flex-shrink-0" size={18} />
              <span>18 Mill Road, Cambridge, CB1 2AD</span>
            </li>
            <li className="flex items-center">
              <Phone className="mr-2 flex-shrink-0" size={18} />
              <span>07964 624055</span>
            </li>
            <li className="flex items-center">
              <Mail className="mr-2 flex-shrink-0" size={18} />
              <span>Noshecambridge@gmail.com</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-cream">Opening Hours</h3>
          <ul className="space-y-2 text-base">
            <li className="flex items-center">
              <Clock className="mr-2 flex-shrink-0" size={18} />
              <span>Monday: Closed</span>
            </li>
            <li className="flex items-center">
              <Clock className="mr-2 flex-shrink-0" size={18} />
              <span>Tuesday - Saturday: 8:00 AM - 11:00 PM</span>
            </li>
            <li className="flex items-center">
              <Clock className="mr-2 flex-shrink-0" size={18} />
              <span>Sunday: 9:00 AM - 10:00 PM</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-cream">Follow Us</h3>
          <a 
            href="https://www.instagram.com/noshecambridge" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center hover:text-green transition-colors text-base"
            aria-label="Follow us on Instagram"
          >
            <Instagram className="mr-2" size={18} />
            @noshecambridge
          </a>
          <div className="mt-8">
            <h4 className="font-semibold mb-2 text-cream">Legal</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-green transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-green transition-colors">Terms of Service</Link></li>
              <li><Link to="/allergen-information" className="hover:text-green transition-colors">Allergen Information</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-8 border-t border-cream border-opacity-20">
        <div className="text-center mb-8">
          <p className="text-sm">© {new Date().getFullYear()} Noshe Cambridge. All rights reserved.</p>
        </div>
        
        <div className="flex flex-col items-center justify-center space-y-4 py-8 px-4 bg-burgundy/30 rounded-xl backdrop-blur-sm">
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-2xl md:text-3xl lg:text-4xl font-serif tracking-wide text-cream/95">
              Crafted with passion by{' '}
              <a 
                href="https://thecraftweb.co.uk" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-beige hover:text-cream transition-colors duration-300 font-bold border-b-2 border-beige/20 hover:border-cream/40"
              >
                TheCraftWeb
              </a>
            </p>
            <div className="mt-4 max-w-2xl mx-auto">
              <p className="text-sm md:text-base text-beige/90 italic leading-relaxed">
                Where culinary artistry meets digital excellence — Transforming gastronomic visions into immersive digital experiences. 
                Elevating restaurants through bespoke web solutions that capture the essence of their unique flavors and traditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
