// App.jsx
import React from 'react';
import GlassNavbar from './Navbar';
import HomePage from './Home';
import About from './About';
import Services from './Services';
import Contact from './Contact';
import { Home, User, Briefcase, Mail, Settings, Star } from 'lucide-react';
import StackItUI from './Home2';

const Main = () => {
   // Custom navigation items
   const customNavItems = [
      {
         name: 'Home',
         icon: Home,
         href: '#home',
         onClick: () => console.log('Home clicked')
      },
      {
         name: 'About',
         icon: User,
         href: '#about',
         onClick: () => console.log('About clicked')
      },
      {
         name: 'Services',
         icon: Briefcase,
         href: '#services',
         dropdown: [
            { name: 'Web Design', onClick: () => console.log('Web Design clicked') },
            { name: 'Development', onClick: () => console.log('Development clicked') },
            { name: 'Consulting', onClick: () => console.log('Consulting clicked') },
            { name: 'Support', onClick: () => console.log('Support clicked') }
         ]
      },
      {
         name: 'Contact',
         icon: Mail,
         href: '#contact',
         onClick: () => console.log('Contact clicked')
      },
      {
         name: 'Reviews',
         icon: Star,
         href: '#reviews',
         onClick: () => console.log('Reviews clicked')
      }
   ];

   const handleCtaClick = () => {
      console.log('Get Started clicked');
      // Add your CTA logic here
   };

   return (
      <div className="min-h-screen" style={{ backgroundColor: '#040404' }}>
         <GlassNavbar
            logo="StackIt"
            logoIcon="S"
            navItems={customNavItems}
            ctaText="Get Started"
            onCtaClick={handleCtaClick}
         />

         {/* Main Content */}
         <div className="pt-16">
            {/* <HomePage /> */}
            <StackItUI/>
            <About />
         </div>
      </div>
   );
};

export default Main;