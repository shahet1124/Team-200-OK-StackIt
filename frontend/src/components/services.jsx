// ServicesPage.jsx
import React from 'react';
import { Code, Palette, Smartphone, Zap } from 'lucide-react';

const ServicesPage = () => {
   const services = [
      {
         icon: Code,
         title: 'Web Development',
         description: 'Custom web applications built with modern technologies and best practices.',
         features: ['React & Next.js', 'Node.js Backend', 'Database Integration', 'API Development']
      },
      {
         icon: Palette,
         title: 'UI/UX Design',
         description: 'Beautiful, user-friendly interfaces that engage and convert visitors.',
         features: ['Glassmorphism Design', 'Responsive Layout', 'User Research', 'Prototyping']
      },
      {
         icon: Smartphone,
         title: 'Mobile Apps',
         description: 'Native and cross-platform mobile applications for iOS and Android.',
         features: ['React Native', 'Flutter', 'Native iOS/Android', 'Cross-platform']
      },
      {
         icon: Zap,
         title: 'Performance',
         description: 'Lightning-fast websites optimized for speed and search engines.',
         features: ['SEO Optimization', 'Speed Optimization', 'Core Web Vitals', 'Analytics Setup']
      }
   ];

   return (
      <section id="services" className="min-h-screen py-20 px-4">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{
                  background: 'linear-gradient(135deg, #0bab7d, #bfb5fe)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
               }}>
                  Our Services
               </h2>
               <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                  We offer comprehensive web solutions to help your business thrive in the digital world.
               </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
               {services.map((service, index) => (
                  <div key={index} className="backdrop-blur-md bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
                     <div className="mb-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{
                           background: 'linear-gradient(135deg, #0bab7d, #c9f5c4)'
                        }}>
                           <service.icon size={24} color="#111827" />
                        </div>
                     </div>

                     <h3 className="text-xl font-bold mb-3 text-white">
                        {service.title}
                     </h3>

                     <p className="text-white/80 mb-4 text-sm leading-relaxed">
                        {service.description}
                     </p>

                     <div className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                           <div key={featureIndex} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#c9f5c4' }}></div>
                              <span className="text-white/70 text-sm">{feature}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>

            <div className="text-center mt-16">
               <button className="px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg" style={{
                  background: 'linear-gradient(135deg, #0bab7d, #c9f5c4)',
                  color: '#111827'
               }}>
                  View All Services
               </button>
            </div>
         </div>
      </section>
   );
};

export default ServicesPage;