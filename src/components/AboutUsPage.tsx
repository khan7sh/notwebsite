import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Coffee, Utensils, Globe, Users, Star, Heart, ArrowRight, MapPin, Clock, Phone, Instagram } from 'lucide-react';
import BackButton from './BackButton';

const AboutUsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <h2 className="text-3xl font-bold text-burgundy mb-6 flex items-center">
      {icon}
      <span className="ml-3">{title}</span>
    </h2>
  );

  const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <section className={`mb-16 ${className}`} data-aos="fade-up">
      <div className="relative">
        {children}
      </div>
    </section>
  );

  const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-lg shadow-lg p-8 space-y-6 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <BackButton />
          <h1 className="text-5xl font-bold text-burgundy mb-8 text-center" data-aos="fade-up">
            About Noshe Cambridge
          </h1>
          
          <div className="relative h-[400px] mb-12 rounded-xl overflow-hidden" data-aos="fade-up">
            <img 
              src="/images/restaurant-interior.jpg" 
              alt="Noshe Cambridge Interior" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <p className="text-4xl text-white font-serif italic">Where Tradition Meets Innovation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section className="mb-0">
            <div className="bg-cream/30 rounded-2xl shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="order-2 md:order-1">
                  <SectionTitle icon={<Users size={32} />} title="Our Story" />
                  <Card className="bg-white h-full transform hover:scale-[1.02] transition-transform duration-300">
                    <p className="text-gray-700 leading-relaxed">
                      Noshe Cambridge was born from a deep-rooted passion for sharing authentic Afghan flavors and hospitality. Founded in 2024 by a team of food enthusiasts with Afghan heritage, we set out to create a unique space where traditional recipes meet modern culinary techniques.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Our name, "Noshe" (نوش), means "sweet" or "delicious" in Dari, reflecting our commitment to providing a delightful dining experience that captures the essence of Afghan cuisine.
                    </p>
                  </Card>
                </div>
                <div className="order-1 md:order-2 grid grid-cols-2 gap-4 relative">
                  <div className="absolute -inset-4 bg-burgundy opacity-5 rounded-lg transform -rotate-2"></div>
                  <img 
                    src="/images/food-1.jpg" 
                    alt="Traditional Afghan Dish" 
                    className="rounded-lg shadow-lg object-cover h-full"
                  />
                  <img 
                    src="/images/food-2.jpg" 
                    alt="Modern Afghan Cuisine" 
                    className="rounded-lg shadow-lg object-cover h-full"
                  />
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section className="mb-0">
            <div className="bg-burgundy rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cream/20 to-transparent"></div>
                <div className="p-8 lg:p-12 text-center">
                  <div className="absolute top-0 right-0 opacity-5">
                    <Coffee size={200} />
                  </div>
                  <h2 className="text-3xl font-bold text-beige mb-6 flex items-center justify-center">
                    <Coffee size={32} />
                    <span className="ml-3">Kenza Coffee</span>
                  </h2>
                  <p className="mb-6 leading-relaxed text-beige">
                    At the heart of Noshe Cambridge lies our pride and joy - Kenza Coffee. We carefully source the finest beans from Afghanistan and neighboring regions, working directly with farmers to ensure fair practices and exceptional quality.
                  </p>
                  <p className="mb-8 leading-relaxed text-beige">
                    Our master roasters craft each batch to perfection, creating a coffee experience that's uniquely Noshe. Whether you're enjoying a cup in our restaurant or taking beans home, Kenza Coffee promises an authentic taste of Afghan hospitality.
                  </p>
                  <Link 
                    to="/kenza-coffee" 
                    className="inline-flex items-center bg-cream text-burgundy px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5"
                  >
                    Explore Kenza Coffee
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                </div>
                <div className="relative h-[400px]">
                  <img 
                    src="/images/coffee-roasting.jpg" 
                    alt="Kenza Coffee Roasting" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <div className="bg-burgundy/5 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section className="mb-0">
            <div className="bg-white/90 rounded-2xl shadow-lg p-8">
              <SectionTitle icon={<Utensils size={32} />} title="Our Culinary Philosophy" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-white transform hover:scale-[1.02] transition-transform duration-300 hover:shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-5 transform -translate-y-1/4 translate-x-1/4">
                    <Utensils size={120} />
                  </div>
                  <h3 className="text-xl font-bold text-burgundy mb-4">Traditional Recipes</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our menu celebrates time-honored Afghan recipes, passed down through generations. Each dish tells a story of our rich culinary heritage.
                  </p>
                </Card>
                <Card className="bg-white">
                  <h3 className="text-xl font-bold text-burgundy mb-4">Local Ingredients</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We partner with local Cambridge suppliers while sourcing authentic Afghan spices to create dishes that are both sustainable and authentic.
                  </p>
                </Card>
                <Card className="bg-white">
                  <h3 className="text-xl font-bold text-burgundy mb-4">Modern Techniques</h3>
                  <p className="text-gray-700 leading-relaxed">
                    While respecting tradition, we embrace modern culinary techniques to enhance flavors and presentation.
                  </p>
                </Card>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section className="mb-0">
            <div className="bg-burgundy text-cream rounded-xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cream/20 to-transparent"></div>
              <div className="p-8 lg:p-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  {/* Left side content */}
                  <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold mb-4">Reserve Your Table</h2>
                    <p className="text-lg text-cream/90">
                      Join us for an authentic Afghan dining experience at Noshe Cambridge
                    </p>
                  </div>

                  {/* Right side buttons - slightly more centered */}
                  <div className="flex flex-col items-center md:items-center gap-6 md:w-1/2">
                    <Link 
                      to="/booking" 
                      className="inline-flex items-center bg-cream text-burgundy px-10 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5 shadow-lg"
                    >
                      Book a Table
                    </Link>
                    <div className="text-center">
                      <p className="text-cream/80 text-sm mb-1">or call us</p>
                      <a 
                        href="tel:07964624055" 
                        className="inline-flex items-center text-cream hover:text-cream/80 transition-colors font-semibold text-lg group"
                      >
                        <Phone className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                        07964 624055
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <div className="bg-burgundy/5 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section className="mb-0">
            <div className="bg-green rounded-2xl shadow-lg p-8 text-cream">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                <div className="p-8 lg:p-12">
                  <h2 className="text-3xl font-bold mb-8 text-center md:text-left">Visit Us</h2>
                  <div className="space-y-8">
                    <div className="flex items-start space-x-4 group hover:transform hover:translate-x-2 transition-transform">
                      <MapPin size={24} className="flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-xl mb-2">Location</h3>
                        <p className="text-cream/90 text-lg">123 Mill Road, Cambridge, CB1 2AZ</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 group hover:transform hover:translate-x-2 transition-transform">
                      <Clock size={24} className="flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-xl mb-2">Opening Hours</h3>
                        <p className="text-cream/90 text-lg">Tuesday - Sunday: 8:00 AM - 10:00 PM</p>
                        <p className="text-cream/90 text-lg">Monday: Closed</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 group hover:transform hover:translate-x-2 transition-transform">
                      <Phone size={24} className="flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-xl mb-2">Contact</h3>
                        <p className="text-cream/90 text-lg">Phone: 07964 624055</p>
                        <p className="text-cream/90 text-lg">Email: noshecambridge@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative h-[400px] transform hover:scale-[1.02] transition-transform duration-300">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2445.3129501550743!2d0.1311223766618259!3d52.201360171979424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d87113c2ea91c3%3A0x5fac87fbc317691f!2sNoshe%20Afghan%20Restaurant%20Coffee%20House!5e0!3m2!1sen!2suk!4v1730580544809!5m2!1sen!2suk"
                    className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <div className="bg-cream py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section className="mb-0">
            <div className="bg-white/80 rounded-xl shadow-lg text-center py-8">
              <h2 className="text-2xl font-bold text-burgundy mb-4">Follow Our Journey</h2>
              <div className="flex justify-center">
                <a 
                  href="https://www.instagram.com/noshecambridge" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-burgundy hover:text-green transition-colors bg-cream/50 px-6 py-3 rounded-lg"
                >
                  <Instagram size={28} />
                  <span className="ml-2">@noshecambridge</span>
                </a>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

export default AboutUsPage;
