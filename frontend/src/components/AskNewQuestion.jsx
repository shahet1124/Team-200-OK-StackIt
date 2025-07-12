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
      <div className="min-h-screen bg-gray-900">
         {/* Main Content */}
         <div className="min-h-screen p-3 sm:p-6">
            <div className="max-w-4xl mx-auto">
               {/* Header */}
               <div className="mb-6 sm:mb-8 text-center">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                     Ask Question
                  </div>
                  <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto"></div>
               </div>

               {/* Navigation Bar */}
               <div className="backdrop-blur-lg bg-gray-800/90 border border-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 shadow-2xl">
                  <div className="flex justify-between items-center">
                     <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        StackIt
                     </div>
                     <div className="flex items-center gap-3 sm:gap-6">
                        <a href="#" className="hidden sm:block text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
                           Home
                        </a>
                        <div className="flex gap-2 sm:gap-3">
                           <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-gray-600 transition-all duration-300 cursor-pointer hover:scale-110">
                              <span className="text-sm sm:text-lg">🔔</span>
                           </div>
                           <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-gray-600 transition-all duration-300 cursor-pointer hover:scale-110">
                              <span className="text-sm sm:text-lg">👤</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Form Container */}
               <div className="bg-gray-800/90 border border-gray-700 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl">
                  <div className="space-y-6 sm:space-y-8">
                     {/* Title Field */}
                     <div className="space-y-2 sm:space-y-3">
                        <label htmlFor="title" className="block text-white font-semibold text-base sm:text-lg">
                           Title
                        </label>
                        <div className="relative group">
                           <input
                              type="text"
                              id="title"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-300 hover:bg-gray-600 text-sm sm:text-base"
                              placeholder="Enter your question title..."
                           />
                           <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                     </div>

                     {/* Description Field */}
                     <div className="space-y-2 sm:space-y-3">
                        <label htmlFor="description" className="block text-white font-semibold text-base sm:text-lg">
                           Description
                        </label>
                        <div className="relative group">
                           {/* Rich Text Toolbar */}
                           <div className="flex items-center gap-1 sm:gap-2 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-3 overflow-x-auto">
                              {toolbarButtons.map((btn, index) => (
                                 btn.type === 'separator' ? (
                                    <div key={index} className="w-px h-4 sm:h-6 bg-gray-600 mx-0.5 sm:mx-1 flex-shrink-0"></div>
                                 ) : (
                                    <button
                                       key={index}
                                       type="button"
                                       className="p-1.5 sm:p-2 rounded-md sm:rounded-lg text-gray-400 hover:text-white hover:bg-gray-600 transition-all duration-300 hover:scale-110 text-xs sm:text-sm flex-shrink-0"
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
                              className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-300 hover:bg-gray-600 resize-y text-sm sm:text-base"
                              rows="4"
                              placeholder="Enter your question description..."
                           ></textarea>

                           {/* HTML Rich Text Indicator */}
                           <div className="absolute right-3 sm:right-4 top-16 sm:top-20 text-gray-400 text-xs pointer-events-none bg-gray-800/80 px-1.5 sm:px-2 py-1 rounded-md">
                              HTML Rich Text
                           </div>
                           <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                     </div>

                     {/* Tags Field */}
                     <div className="space-y-2 sm:space-y-3">
                        <label htmlFor="tags" className="block text-white font-semibold text-base sm:text-lg">
                           Tags
                        </label>
                        <div className="relative group">
                           <input
                              type="text"
                              id="tags"
                              name="tags"
                              value={formData.tags}
                              onChange={handleInputChange}
                              className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-700 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-300 hover:bg-gray-600 text-sm sm:text-base"
                              placeholder="e.g., javascript, html, css"
                           />
                           <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                     </div>

                     {/* Submit Button */}
                     <div className="flex justify-center pt-2 sm:pt-4">
                        <button
                           type="button"
                           onClick={handleSubmit}
                           className="relative group w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl sm:rounded-2xl text-white font-semibold text-base sm:text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 overflow-hidden"
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