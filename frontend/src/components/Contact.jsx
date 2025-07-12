// ContactPage.jsx
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      subject: '',
      message: ''
   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Form submitted:', formData);
      // Handle form submission here
      alert('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
   };

   const contactInfo = [
      {
         icon: Mail,
         title: 'Email',
         info: 'hello@glassnav.com',
         description: 'Send us an email anytime'
      },
      {
         icon: Phone,
         title: 'Phone',
         info: '+1 (555) 123-4567',
         description: 'Call us during business hours'
      },
      {
         icon: MapPin,
         title: 'Location',
         info: 'San Francisco, CA',
         description: 'Visit our office'
      }
   ];

   return (
      <section id="contact" className="min-h-screen py-20 px-4">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{
                  background: 'linear-gradient(135deg, #bfb5fe, #c9f5c4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
               }}>
                  Get In Touch
               </h2>
               <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                  Ready to start your project? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
               </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
               {/* Contact Form */}
               <div className="backdrop-blur-md bg-white/5 p-8 rounded-2xl border border-white/10">
                  <h3 className="text-2xl font-bold mb-6 text-white">Send Message</h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-white/80 mb-2 text-sm">Name</label>
                           <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#0bab7d] transition-colors duration-200"
                              placeholder="Your Name"
                           />
                        </div>
                        <div>
                           <label className="block text-white/80 mb-2 text-sm">Email</label>
                           <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#0bab7d] transition-colors duration-200"
                              placeholder="your@email.com"
                           />
                        </div>
                     </div>

                     <div>
                        <label className="block text-white/80 mb-2 text-sm">Subject</label>
                        <input
                           type="text"
                           name="subject"
                           value={formData.subject}
                           onChange={handleInputChange}
                           required
                           className="w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#0bab7d] transition-colors duration-200"
                           placeholder="Project Subject"
                        />
                     </div>

                     <div>
                        <label className="block text-white/80 mb-2 text-sm">Message</label>
                        <textarea
                           name="message"
                           value={formData.message}
                           onChange={handleInputChange}
                           required
                           rows={5}
                           className="w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#0bab7d] transition-colors duration-200 resize-none"
                           placeholder="Tell us about your project..."
                        />
                     </div>

                     <button
                        type="submit"
                        className="w-full flex items-center justify-center space-x-2 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
                        style={{
                           background: 'linear-gradient(135deg, #0bab7d, #c9f5c4)',
                           color: '#111827'
                        }}
                     >
                        <Send size={20} />
                        <span>Send Message</span>
                     </button>
                  </form>
               </div>

               {/* Contact Info */}
               <div className="space-y-8">
                  <div className="backdrop-blur-md bg-white/5 p-8 rounded-2xl border border-white/10">
                     <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>

                     <div className="space-y-6">
                        {contactInfo.map((item, index) => (
                           <div key={index} className="flex items-start space-x-4">
                              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                                 background: 'linear-gradient(135deg, #0bab7d, #c9f5c4)'
                              }}>
                                 <item.icon size={20} color="#111827" />
                              </div>
                              <div>
                                 <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                                 <p className="text-white/90 font-medium">{item.info}</p>
                                 <p className="text-white/60 text-sm">{item.description}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="backdrop-blur-md bg-white/5 p-8 rounded-2xl border border-white/10">
                     <h3 className="text-2xl font-bold mb-4 text-white">Office Hours</h3>
                     <div className="space-y-3">
                        <div className="flex justify-between">
                           <span className="text-white/80">Monday - Friday</span>
                           <span className="text-white">9:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-white/80">Saturday</span>
                           <span className="text-white">10:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-white/80">Sunday</span>
                           <span className="text-white/60">Closed</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default ContactPage;