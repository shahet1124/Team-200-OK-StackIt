import React, { useState } from 'react';

export default function AskNewQuestion() {
   const [formData, setFormData] = useState({
      title: '',
      description: '',
      tags: ''
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
   };

   const toolbarButtons = [
      { type: 'B', label: 'Bold' },
      { type: 'I', label: 'Italic' },
      { type: 'S', label: 'Strikethrough' },
      { type: 'separator' },
      { type: '≡', label: 'Bullet List' },
      { type: '☰', label: 'Numbered List' },
      { type: 'separator' },
      { type: '¶', label: 'Paragraph' },
      { type: '⚙', label: 'Settings' },
      { type: 'separator' },
      { type: '🎯', label: 'Target' },
      { type: '🔗', label: 'Link' },
      { type: 'separator' },
      { type: '📎', label: 'Attachment' },
      { type: 'separator' },
      { type: '≣', label: 'Align Left' },
      { type: '≡', label: 'Align Center' },
      { type: '≣', label: 'Align Right' },
   ];

   return (
      <div className="min-h-screen relative overflow-hidden">
         {/* Animated Background */}
         <div className="absolute inset-0 bg-black">
            <div className="absolute top-0 left-0 w-full h-full">
               <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
               <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-pulse delay-1000"></div>
               <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-pulse delay-2000"></div>
            </div>
         </div>

         {/* Main Content */}
         <div className="relative z-10 min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
               {/* Header */}
               <div className="mb-8 text-center">
                  {/* <div className="text-lg text-white/60 mb-1 font-light">Screen 2</div> */}
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                     Ask Question
                  </div>
                  <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto"></div>
               </div>

               {/* Navigation Bar */}
               <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-4 mb-8 shadow-2xl">
                  <div className="flex justify-between items-center">
                     <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        StackIt
                     </div>
                     <div className="flex items-center gap-6">
                        <a href="#" className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105">
                           Home
                        </a>
                        <div className="flex gap-3">
                           <div className="w-10 h-10 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-110">
                              <span className="text-lg">🔔</span>
                           </div>
                           <div className="w-10 h-10 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-110">
                              <span className="text-lg">👤</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Form Container */}
               <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-8">
                     {/* Title Field */}
                     <div className="space-y-3">
                        <label htmlFor="title" className="block text-white font-semibold text-lg">
                           Title
                        </label>
                        <div className="relative group">
                           <input
                              type="text"
                              id="title"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              className="w-full px-4 py-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                              placeholder="Enter your question title..."
                           />
                           <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                     </div>

                     {/* Description Field */}
                     <div className="space-y-3">
                        <label htmlFor="description" className="block text-white font-semibold text-lg">
                           Description
                        </label>
                        <div className="relative group">
                           {/* Rich Text Toolbar */}
                           <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-3 mb-3">
                              {toolbarButtons.map((btn, index) => (
                                 btn.type === 'separator' ? (
                                    <div key={index} className="w-px h-6 bg-white/20 mx-1"></div>
                                 ) : (
                                    <button
                                       key={index}
                                       type="button"
                                       className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                                       title={btn.label}
                                    >
                                       {btn.type === 'I' ? <em>I</em> : btn.type}
                                    </button>
                                 )
                              ))}
                           </div>

                           <textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              className="w-full px-4 py-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-300 hover:bg-white/15 resize-y"
                              rows="6"
                              placeholder="Enter your question description..."
                           ></textarea>

                           {/* HTML Rich Text Indicator */}
                           <div className="absolute right-4 top-20 text-white/40 text-xs pointer-events-none backdrop-blur-sm bg-black/20 px-2 py-1 rounded-md">
                              HTML Rich Text
                           </div>
                           <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                     </div>

                     {/* Tags Field */}
                     <div className="space-y-3">
                        <label htmlFor="tags" className="block text-white font-semibold text-lg">
                           Tags
                        </label>
                        <div className="relative group">
                           <input
                              type="text"
                              id="tags"
                              name="tags"
                              value={formData.tags}
                              onChange={handleInputChange}
                              className="w-full px-4 py-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                              placeholder="e.g., javascript, html, css"
                           />
                           <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                     </div>

                     {/* Submit Button */}
                     <div className="flex justify-center pt-4">
                        <button
                           type="button"
                           onClick={handleSubmit}
                           className="relative group px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl text-white font-semibold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 overflow-hidden"
                        >
                           <span className="relative z-10">Submit Question</span>
                           <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                           <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}