import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

export default function AskNewQuestion() {
   const [formData, setFormData] = useState({
      title: '',
      description: '',
      tags: ''
   });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitMessage, setSubmitMessage] = useState('');

   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

   // TipTap editor configuration
   const editor = useEditor({
      extensions: [
         StarterKit,
         Link.configure({ openOnClick: false }),
         Image,
      ],
      content: formData.description,
      onUpdate: ({ editor }) => {
         setFormData(prev => ({
            ...prev,
            description: editor.getHTML()
         }));
      },
      editorProps: {
         attributes: {
            class: 'rich-text-editor',
         },
      },
   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate form data
      if (!formData.title.trim()) {
         setSubmitMessage('Please enter a question title');
         return;
      }
      
      if (!formData.description.trim() || formData.description === '<p></p>') {
         setSubmitMessage('Please enter a question description');
         return;
      }

      setIsSubmitting(true);
      setSubmitMessage('');

      try {
         // Get token from localStorage
         const token = localStorage.getItem('token');
         if (!token) {
            setSubmitMessage('Please login to submit a question');
            setIsSubmitting(false);
            return;
         }

         // Convert tags string to array
         const tagsArray = formData.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

         const response = await fetch(`${API_URL}/questions`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
               title: formData.title.trim(),
               description: formData.description,
               tags: tagsArray
            })
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.error || 'Failed to submit question');
         }

         // Success - reset form and show success message
         setFormData({
            title: '',
            description: '',
            tags: ''
         });
         
         // Clear the editor content
         editor?.commands.setContent('');
         
         setSubmitMessage('Question submitted successfully!');
         
         // Clear success message after 3 seconds
         setTimeout(() => {
            setSubmitMessage('');
         }, 3000);

         console.log('Question created:', data);
         
      } catch (error) {
         console.error('Error submitting question:', error);
         setSubmitMessage(error.message || 'Failed to submit question. Please try again.');
      } finally {
         setIsSubmitting(false);
      }
   };

   // Toolbar actions
   const addImage = () => {
      const url = window.prompt('Enter image URL');
      if (url) {
         editor.chain().focus().setImage({ src: url }).run();
      }
   };

   const toolbarButtons = [
      { icon: 'B', action: () => editor.chain().focus().toggleBold().run(), active: editor?.isActive('bold'), label: 'Bold' },
      { icon: 'I', action: () => editor.chain().focus().toggleItalic().run(), active: editor?.isActive('italic'), label: 'Italic' },
      { icon: 'U', action: () => editor.chain().focus().toggleUnderline?.().run(), active: editor?.isActive('underline'), label: 'Underline' },
      { icon: 'S', action: () => editor.chain().focus().toggleStrike().run(), active: editor?.isActive('strike'), label: 'Strikethrough' },
      { icon: 'ul', action: () => editor.chain().focus().toggleBulletList().run(), active: editor?.isActive('bulletList'), label: 'Bullet List' },
      { icon: 'ol', action: () => editor.chain().focus().toggleOrderedList().run(), active: editor?.isActive('orderedList'), label: 'Numbered List' },
      { icon: '</>', action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor?.isActive('codeBlock'), label: 'Code Block' },
      { icon: '"', action: () => editor.chain().focus().toggleBlockquote().run(), active: editor?.isActive('blockquote'), label: 'Blockquote' },
      { icon: '🔗', action: () => {
         const url = window.prompt('Enter link URL');
         if (url) editor.chain().focus().setLink({ href: url }).run();
      }, active: editor?.isActive('link'), label: 'Link' },
      { icon: '🖼️', action: addImage, active: false, label: 'Image' },
   ];

   // Custom styles for TipTap editor
   const tiptapStyles = `
      .rich-text-editor {
         background: #374151 !important;
         border: 1px solid #4B5563 !important;
         border-radius: 0.75rem !important;
         color: white !important;
         min-height: 150px !important;
         padding: 1rem !important;
         font-size: 14px !important;
         outline: none !important;
         line-height: 1.6 !important;
      }
      .rich-text-editor:focus {
         box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.5) !important;
         border-color: transparent !important;
      }
      .rich-text-editor h1,
      .rich-text-editor h2,
      .rich-text-editor h3,
      .rich-text-editor h4,
      .rich-text-editor h5,
      .rich-text-editor h6 {
         margin: 1rem 0 0.5rem 0 !important;
         font-weight: bold !important;
         color: #06b6d4 !important;
      }
      .rich-text-editor ul,
      .rich-text-editor ol {
         padding-left: 1.5rem !important;
         margin: 0.5rem 0 !important;
      }
      .rich-text-editor li {
         margin: 0.25rem 0 !important;
      }
      .rich-text-editor a {
         color: #06b6d4 !important;
         text-decoration: underline !important;
      }
      .rich-text-editor a:hover {
         color: #0891b2 !important;
      }
      .rich-text-editor blockquote {
         border-left: 3px solid #06b6d4 !important;
         padding-left: 1rem !important;
         margin: 1rem 0 !important;
         font-style: italic !important;
         color: #9CA3AF !important;
      }
      .rich-text-editor code {
         background: rgba(0, 0, 0, 0.3) !important;
         padding: 0.2rem 0.4rem !important;
         border-radius: 0.25rem !important;
         font-family: 'Courier New', monospace !important;
         color: #fbbf24 !important;
      }
      .rich-text-editor pre {
         background: rgba(0, 0, 0, 0.3) !important;
         padding: 1rem !important;
         border-radius: 0.5rem !important;
         margin: 0.5rem 0 !important;
         overflow-x: auto !important;
         border: 1px solid #4B5563 !important;
      }
      .rich-text-editor pre code {
         background: none !important;
         padding: 0 !important;
         color: #fbbf24 !important;
      }
   `;

   return (
      <div className="min-h-screen bg-gray-900">
         <style>{tiptapStyles}</style>
         {/* Main Content */}
         <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
               {/* Header */}
               <div className="mb-8 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                     Ask Question
                  </div>
                  <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto"></div>
               </div>

               {/* Navigation Bar */}
               <div className="backdrop-blur-lg bg-gray-800/90 border border-gray-700 rounded-2xl p-4 mb-8 shadow-2xl">
                  <div className="flex justify-between items-center">
                     <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        StackIT
                     </div>
                     <div className="flex items-center gap-6">
                        <a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
                           Home
                        </a>
                        <div className="flex gap-3">
                           <div className="w-10 h-10 bg-gray-700 border border-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-600 transition-all duration-300 cursor-pointer hover:scale-110">
                              <span className="text-lg">🔔</span>
                           </div>
                           <div className="w-10 h-10 bg-gray-700 border border-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-600 transition-all duration-300 cursor-pointer hover:scale-110">
                              <span className="text-lg">👤</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Form Container */}
               <div className="bg-gray-800/90 border border-gray-700 rounded-3xl p-8 shadow-2xl">
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
                              className="w-full px-4 py-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-300 hover:bg-gray-600"
                              placeholder="Enter your question title..."
                           />
                           <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                     </div>

                     {/* Description Field with TipTap Rich Text Editor */}
                     <div className="space-y-3">
                        <label htmlFor="description" className="block text-white font-semibold text-lg">
                           Description
                        </label>
                        <div className="relative group">
                           {/* TipTap Toolbar */}
                           <div className="flex items-center gap-2 bg-gray-700 border border-gray-600 rounded-xl p-3 mb-3">
                              {toolbarButtons.map((btn, index) => (
                                 <button
                                    key={index}
                                    type="button"
                                    onClick={btn.action}
                                    className={`p-2 rounded-lg ${btn.active ? 'text-cyan-400 bg-cyan-400/20' : 'text-gray-400'}`}
                                    title={btn.label}
                                 >
                                    {btn.icon}
                                 </button>
                              ))}
                           </div>
                           {/* TipTap Editor */}
                           <div className="relative">
                              <EditorContent editor={editor} />
                           </div>
                           {/* Rich Text Indicator */}
                           {/* <div className="absolute right-4 top-20 text-gray-400 text-xs pointer-events-none bg-gray-800/80 px-2 py-1 rounded-md">
                              Rich Text Editor
                           </div> */}
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
                              className="w-full px-4 py-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-300 hover:bg-gray-600"
                              placeholder="e.g., javascript, html, css"
                           />
                           <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                     </div>

                     {/* Submit Message */}
                     {submitMessage && (
                        <div className={`text-center p-3 rounded-lg ${
                           submitMessage.includes('successfully') 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                           {submitMessage}
                        </div>
                     )}

                     {/* Submit Button */}
                     <div className="flex justify-center pt-4">
                        <button
                           type="button"
                           onClick={handleSubmit}
                           disabled={isSubmitting}
                           className={`relative group px-12 py-4 rounded-2xl text-white font-semibold text-lg shadow-2xl transition-all duration-300 overflow-hidden ${
                              isSubmitting 
                                 ? 'bg-gray-600 cursor-not-allowed' 
                                 : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-cyan-500/25 hover:scale-105'
                           }`}
                        >
                           <span className="relative z-10">
                              {isSubmitting ? 'Submitting...' : 'Submit Question'}
                           </span>
                           {!isSubmitting && (
                              <>
                                 <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                 <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </>
                           )}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}