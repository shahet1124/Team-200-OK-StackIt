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
      <div className="min-h-screen bg-gray-900 text-white p-5">
         <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
               <div className="text-lg text-gray-300 mb-1">Screen 2</div>
               <div className="text-base text-gray-300 mb-5">Ask Question</div>
            </div>

            {/* Navigation Bar */}
            <div className="flex justify-between items-center border-2 border-gray-600 rounded-3xl px-5 py-3 mb-8">
               <div className="text-xl font-bold">StackIt</div>
               <div className="flex items-center gap-4">
                  <a href="#" className="text-gray-300 text-base hover:text-white">Home</a>
                  <div className="flex gap-3">
                     <div className="w-8 h-8 bg-gray-600 rounded-md flex items-center justify-center text-sm hover:bg-gray-500 cursor-pointer">
                        🔔
                     </div>
                     <div className="w-8 h-8 bg-gray-600 rounded-md flex items-center justify-center text-sm hover:bg-gray-500 cursor-pointer">
                        👤
                     </div>
                  </div>
               </div>
            </div>

            {/* Form Container */}
            <div className="border-2 border-gray-600 rounded-2xl p-10 bg-gray-900">
               <form onSubmit={handleSubmit}>
                  {/* Title Field */}
                  <div className="mb-6">
                     <label htmlFor="title" className="block mb-2 text-base text-white">
                        Title
                     </label>
                     <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border-2 border-gray-600 rounded-lg bg-gray-900 text-white text-sm focus:outline-none focus:border-gray-400 transition-colors"
                        placeholder="Enter your question title..."
                     />
                  </div>

                  {/* Description Field */}
                  <div className="mb-6">
                     <label htmlFor="description" className="block mb-2 text-base text-white">
                        Description
                     </label>
                     <div className="relative">
                        {/* Rich Text Toolbar */}
                        <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-md mb-2 text-sm">
                           {toolbarButtons.map((btn, index) => (
                              btn.type === 'separator' ? (
                                 <div key={index} className="w-px h-5 bg-gray-600 mx-1"></div>
                              ) : (
                                 <button
                                    key={index}
                                    type="button"
                                    className="bg-transparent border-none text-gray-300 cursor-pointer px-1.5 py-1 rounded hover:bg-gray-600 font-bold transition-colors"
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
                           className="w-full px-3 py-3 border-2 border-gray-600 rounded-lg bg-gray-900 text-white text-sm focus:outline-none focus:border-gray-400 transition-colors resize-y"
                           rows="6"
                           placeholder="Enter your question description..."
                        ></textarea>

                        {/* HTML Rich Text Indicator */}
                        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs pointer-events-none">
                           HTML Rich Text
                        </div>
                     </div>
                  </div>

                  {/* Tags Field */}
                  <div className="mb-8">
                     <label htmlFor="tags" className="block mb-2 text-base text-white">
                        Tags
                     </label>
                     <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border-2 border-gray-600 rounded-lg bg-gray-900 text-white text-sm focus:outline-none focus:border-gray-400 transition-colors"
                        placeholder="e.g., javascript, html, css"
                     />
                  </div>

                  {/* Submit Button */}
                  <button
                     type="submit"
                     className="bg-gray-900 text-white border-2 border-gray-600 rounded-3xl px-8 py-3 text-base cursor-pointer block mx-auto mt-8 hover:border-gray-400 hover:bg-gray-800 transition-colors"
                  >
                     Submit
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
}