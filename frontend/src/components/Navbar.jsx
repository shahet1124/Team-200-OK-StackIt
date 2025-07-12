import React, { useState, useEffect } from 'react';
import { Menu, X, Home, User, Briefcase, Mail, Settings, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const GlassNavbar = ({
   logo = "GlassNav",
   logoIcon = "G",
   navItems = [],
   ctaText = "Get Started",
   onCtaClick = () => { },
   className = ""
}) => {
   const [isScrolled, setIsScrolled] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [activeDropdown, setActiveDropdown] = useState(null);
   const [isLoaded, setIsLoaded] = useState(false);

   useEffect(() => {
      setIsLoaded(true);
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   // Default nav items - only Home
   const defaultNavItems = [
      { name: 'Home', icon: Home, href: '#home' }
   ];

   const menuItems = navItems.length > 0 ? navItems : defaultNavItems;

   const handleDropdownToggle = (index) => {
      setActiveDropdown(activeDropdown === index ? null : index);
   };

   const handleNavClick = (item) => {
      if (item.onClick) {
         item.onClick();
      }
      setIsMobileMenuOpen(false);
   };

   return (
      <nav
         className={`fixed top-3 left-3 right-3 z-50 transition-all duration-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            } ${isScrolled ? 'backdrop-blur-md bg-white/10' : 'backdrop-blur-sm bg-white/5'} ${className}`}
         style={{
            borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
            boxShadow: isScrolled ? '0 8px 32px rgba(0, 0, 0, 0.3)' : 'none',
            borderRadius: '15px 15px 15px 15px'
         }}
      >
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
               {/* Logo */}
               <div className={`flex items-center space-x-2 transition-all duration-700 delay-200 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                  }`}>
                  <div
                     className="w-8 h-8 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 cursor-pointer"
                     style={{
                        background: 'linear-gradient(135deg, #0bab7d, #c9f5c4)',
                        borderRadius: '5px'
                     }}
                  >
                     <span className="text-white font-bold text-lg">{logoIcon}</span>
                  </div>
                  <span className="text-white font-bold text-xl hover:text-emerald-300 transition-colors duration-300 cursor-pointer">
                     {logo}
                  </span>
               </div>

               {/* Desktop Navigation - Hidden since only Home */}

               {/* CTA Button */}
               <div className={`hidden md:flex items-center space-x-4 transition-all duration-700 delay-500 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                  }`}>
                  <Link to="/login">
                     <button
                        onClick={onCtaClick}
                        className="px-6 py-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-1 active:scale-95 transform"
                        style={{
                           background: 'linear-gradient(135deg, #0bab7d, #c9f5c4)',
                           color: '#111827',
                           borderRadius: '5px'
                        }}
                        onMouseEnter={(e) => {
                           e.target.style.background = 'linear-gradient(135deg, #0bab7d, #c9f5c4, #bfb5fe)';
                        }}
                        onMouseLeave={(e) => {
                           e.target.style.background = 'linear-gradient(135deg, #0bab7d, #c9f5c4)';
                        }}
                     >
                        Login
                     </button>
                  </Link>
               </div>

               {/* Mobile Menu Button */}
               <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`md:hidden p-2 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95 transform ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                     } delay-500`}
                  style={{ borderRadius: '5px' }}
               >
                  <div className="relative">
                     <div className={`transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}>
                        <Menu size={24} color="#ffffff" />
                     </div>
                     <div className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}>
                        <X size={24} color="#ffffff" />
                     </div>
                  </div>
               </button>
            </div>
         </div>

         {/* Mobile Menu */}
         <div className={`md:hidden backdrop-blur-md bg-white/10 border-t border-white/20 overflow-hidden transition-all duration-500 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
            <div className="px-4 py-2 space-y-1">
               {menuItems.map((item, index) => (
                  <div
                     key={index}
                     className={`transition-all duration-500 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                        }`}
                     style={{ transitionDelay: `${index * 100}ms` }}
                  >
                     <button
                        onClick={() => {
                           if (item.dropdown) {
                              handleDropdownToggle(index);
                           } else {
                              handleNavClick(item);
                           }
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/10 hover:text-emerald-300 transition-all duration-300 hover:scale-105 hover:translate-x-2 active:scale-95 transform"
                        style={{ borderRadius: '5px' }}
                     >
                        <item.icon size={20} className="transition-transform duration-300 hover:scale-110" />
                        <span className="font-medium">{item.name}</span>
                        {item.dropdown && (
                           <ChevronDown
                              size={16}
                              className={`ml-auto transform transition-all duration-300 ${activeDropdown === index ? 'rotate-180 text-emerald-300' : ''
                                 }`}
                           />
                        )}
                     </button>

                     {item.dropdown && (
                        <div className={`ml-8 mt-2 space-y-1 transition-all duration-300 ${activeDropdown === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                           }`}>
                           {item.dropdown.map((dropItem, dropIndex) => (
                              <button
                                 key={dropIndex}
                                 onClick={() => {
                                    if (typeof dropItem === 'object' && dropItem.onClick) {
                                       dropItem.onClick();
                                    }
                                    setActiveDropdown(null);
                                    setIsMobileMenuOpen(false);
                                 }}
                                 className={`w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300 hover:scale-105 hover:translate-x-2 transform ${activeDropdown === index ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
                                    }`}
                                 style={{
                                    borderRadius: '5px',
                                    transitionDelay: `${dropIndex * 50}ms`
                                 }}
                              >
                                 {typeof dropItem === 'string' ? dropItem : dropItem.name}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>
               ))}

               <div className={`pt-4 border-t border-white/20 transition-all duration-700 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`} style={{ transitionDelay: '400ms' }}>
                  <button
                     onClick={() => {
                        onCtaClick();
                        setIsMobileMenuOpen(false);
                     }}
                     className="w-full px-4 py-3 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 transform"
                     style={{
                        background: 'linear-gradient(135deg, #0bab7d, #c9f5c4)',
                        color: '#111827',
                        borderRadius: '5px'
                     }}
                  >
                     {ctaText}
                  </button>
               </div>
            </div>
         </div>
      </nav>
   );
};

export default GlassNavbar;