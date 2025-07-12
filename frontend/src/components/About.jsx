// AboutPage.jsx
import React from 'react';

const AboutPage = () => {
   return (
      <section id="about" className="min-h-screen py-20 px-4">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{
                  background: 'linear-gradient(135deg, #c9f5c4, #bfb5fe)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
               }}>
                  About Us
               </h2>
               <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                  We're passionate about creating beautiful, modern web experiences that push the boundaries of design and technology.
               </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-white mb-4">Our Story</h3>
                  <p className="text-white/80 leading-relaxed">
                     Founded with a vision to revolutionize web design, we specialize in creating stunning glassmorphism interfaces that captivate users and deliver exceptional experiences.
                  </p>
                  <p className="text-white/80 leading-relaxed">
                     Our team combines creativity with cutting-edge technology to build websites that don't just look amazing – they perform flawlessly across all devices and platforms.
                  </p>
               </div>

               <div className="backdrop-blur-md bg-white/5 p-8 rounded-2xl border border-white/10">
                  <h3 className="text-2xl font-bold mb-6" style={{ color: '#c9f5c4' }}>
                     Why Choose Us?
                  </h3>
                  <div className="space-y-4">
                     {[
                        'Modern Design Approach',
                        'Responsive & Mobile-First',
                        'Performance Optimized',
                        'User-Centered Design',
                        'Cutting-Edge Technology'
                     ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0bab7d' }}></div>
                           <span className="text-white/90">{item}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default AboutPage;