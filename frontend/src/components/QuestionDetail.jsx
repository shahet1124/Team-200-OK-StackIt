import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
   Bold, Italic, Strikethrough, List, ListOrdered, Link as LinkIcon, Image as ImageIcon,
   AlignLeft, AlignCenter, AlignRight, Smile, Send, Upload
} from 'lucide-react';
import Answers from './Questions/Answers';
import { useParams } from 'react-router-dom';

export default function QuestionDetail() {
   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
   const [showLinkDialog, setShowLinkDialog] = useState(false);
   const [linkUrl, setLinkUrl] = useState('');
   const [linkText, setLinkText] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const fileInputRef = useRef(null);
   const { questionId } = useParams();
   const [refreshAnswers, setRefreshAnswers] = useState(false);

   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

   // TipTap editor configuration
   const editor = useEditor({
      extensions: [
         StarterKit,
         Link.configure({ openOnClick: false }),
         Image,
      ],
      content: '',
      editorProps: {
         attributes: {
            class: 'answer-rich-text-editor',
         },
      },
   });

   // Common emojis for quick insertion
   const commonEmojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉', '🚀', '💡', '⚡', '🌟', '✨', '🎯'];
   const [selectedQuestion, setQuestion] = useState(null);

  // Function to fetch the question
  const fetchQuestion = async () => {
    try {
      const response = await fetch(`${API_URL}/questions/${questionId}`);
      if (!response.ok) throw new Error('Failed to fetch question');
      const data = await response.json();
      setQuestion(data.question);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchQuestion();
  }, []);

   // Handle answer submission
   const handleSubmitAnswer = async () => {
      const answerContent = editor?.getHTML();
      
      if (!answerContent || answerContent === '<p></p>') {
         alert('Please enter an answer');
         return;
      }

      setIsSubmitting(true);
      try {
         // Get token from localStorage
         const token = localStorage.getItem('token');
         if (!token) {
            alert('Please login to submit an answer');
            setIsSubmitting(false);
            return;
         }

         const response = await fetch(`${API_URL}/answers`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
               questionId: questionId,
               content: answerContent
            })
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.error || 'Failed to submit answer');
         }

         // Clear the editor content
         editor?.commands.setContent('');
         
         alert('Answer submitted successfully!');
         
         // Refresh the answers list
         setRefreshAnswers(r => !r);
         
      } catch (error) {
         console.error('Error submitting answer:', error);
         alert('Failed to submit answer. Please try again.');
      } finally {
         setIsSubmitting(false);
      }
   };

   // Insert emoji
   const insertEmoji = (emoji) => {
      editor?.chain().focus().insertContent(emoji).run();
      setShowEmojiPicker(false);
   };

   // Insert link
   const insertLink = () => {
      if (linkUrl.trim()) {
         let url = linkUrl.trim();
         // Always prepend https:// if not starting with http:// or https://
         if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
         }
         const { state, view } = editor;
         const { from, to } = state.selection;
         let text = linkText.trim() || url;
         // If user has selected text, use it as link text
         if (from !== to) {
            text = state.doc.textBetween(from, to) || text;
         }
         editor.chain().focus().insertContent(`<a href='${url}' target='_blank' rel='noopener noreferrer'>${text}</a>`).run();
         setShowLinkDialog(false);
         setLinkUrl('');
         setLinkText('');
      }
   };

   // Handle image upload
   const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
         // In a real app, you would upload this to your server
         const reader = new FileReader();
         reader.onload = (e) => {
            editor?.chain().focus().setImage({ src: e.target.result }).run();
         };
         reader.readAsDataURL(file);
      }
   };

   // Custom styles for the answer editor
   const answerEditorStyles = `
      .answer-rich-text-editor {
         background: transparent !important;
         color: #e5e7eb !important;
         min-height: 192px !important;
         padding: 1rem !important;
         font-size: 16px !important;
         outline: none !important;
         line-height: 1.6 !important;
         border: none !important;
         font-family: 'Segoe UI', 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Arial', sans-serif !important;
      }
      .answer-rich-text-editor:focus {
         outline: none !important;
      }
      .answer-rich-text-editor h1,
      .answer-rich-text-editor h2,
      .answer-rich-text-editor h3,
      .answer-rich-text-editor h4,
      .answer-rich-text-editor h5,
      .answer-rich-text-editor h6 {
         margin: 1rem 0 0.5rem 0 !important;
         font-weight: bold !important;
         color: #3b82f6 !important;
      }
      .answer-rich-text-editor ul,
      .answer-rich-text-editor ol {
         padding-left: 1.5rem !important;
         margin: 0.5rem 0 !important;
      }
      .answer-rich-text-editor li {
         margin: 0.25rem 0 !important;
      }
      .answer-rich-text-editor a {
         color: #3b82f6 !important;
         text-decoration: underline !important;
      }
      .answer-rich-text-editor a:hover {
         color: #2563eb !important;
      }
      .answer-rich-text-editor blockquote {
         border-left: 3px solid #3b82f6 !important;
         padding-left: 1rem !important;
         margin: 1rem 0 !important;
         font-style: italic !important;
         color: #9ca3af !important;
      }
      .answer-rich-text-editor code {
         background: rgba(0, 0, 0, 0.3) !important;
         padding: 0.2rem 0.4rem !important;
         border-radius: 0.25rem !important;
         font-family: 'Courier New', monospace !important;
         color: #fbbf24 !important;
      }
      .answer-rich-text-editor pre {
         background: rgba(0, 0, 0, 0.3) !important;
         padding: 1rem !important;
         border-radius: 0.5rem !important;
         margin: 0.5rem 0 !important;
         overflow-x: auto !important;
         border: 1px solid #4b5563 !important;
      }
      .answer-rich-text-editor pre code {
         background: none !important;
         padding: 0 !important;
         color: #fbbf24 !important;
      }
      .answer-rich-text-editor p {
         margin: 0.5rem 0 !important;
      }
      .answer-rich-text-editor span, .answer-rich-text-editor em, .answer-rich-text-editor strong {
         font-family: inherit !important;
      }
      .answer-rich-text-editor .emoji, .answer-rich-text-editor span[role="img"] {
         font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Segoe UI', 'Arial', sans-serif !important;
         font-size: 1.25em !important;
         vertical-align: middle !important;
      }
   `;

   // Helper to add target _blank to all links
   function addTargetBlankToLinks(html) {
     if (!html) return html;
     return html.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
   }

   return (
      <div className="min-h-screen text-white p-6" style={{ backgroundColor: '#141720' }}>
         <style>{answerEditorStyles}</style>
      {console.log('Selected Question:', selectedQuestion)}
         <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center space-x-4">
                  {/* <button
                     onClick={onBackToHome}
                     className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-2"
                  >
                     <span>←</span>
                     <span>Back to Home</span>
                  </button> */}
                  <h1 className="text-3xl font-bold">StackIt</h1>
               </div>
               <div className="flex items-center space-x-4">
                  <button className="bg-transparent border border-white rounded-full px-4 py-2 text-sm hover:bg-white hover:text-black transition-colors">
                     Home
                  </button>
                  <button className="bg-transparent border border-white rounded-full px-4 py-2 text-sm hover:bg-white hover:text-black transition-colors">
                     Profile
                  </button>
                  <button className="bg-transparent border border-white rounded-full px-4 py-2 text-sm hover:bg-white hover:text-black transition-colors">
                     Settings
                  </button>
               </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
               <span className="hover:text-white cursor-pointer transition-colors">Questions</span>
               <span className="text-gray-600">{'>'}</span>
               <span className="text-white max-w-md truncate" title={selectedQuestion?.title || 'Question Title'}>
                  {selectedQuestion?.title || 'Question Title'}
               </span>
            </div>

            {/* Question Detail */}
            <div className="border border-gray-600 rounded-lg p-6 mb-6 bg-gray-800/30">
               <h2 className="text-2xl font-bold mb-4">{selectedQuestion?.title || 'Question Title'}</h2>
               <div className="text-gray-300 mb-4 leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: addTargetBlankToLinks(selectedQuestion?.description || 'Question description goes here...') }}>
               </div>

               {/* Tags */}
               <div className="flex space-x-2 mb-4">
                  {selectedQuestion?.tags && selectedQuestion.tags.length > 0 ? (
                     selectedQuestion.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-600 text-xs px-3 py-1 rounded-full">
                           {tag}
                        </span>
                     ))
                  ) : (
                     <span className="bg-gray-600 text-xs px-3 py-1 rounded-full">No tags</span>
                  )}
               </div>

               {/* Question Meta */}
               <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-700 pt-4">
                  <span>
                     Asked by {selectedQuestion?.userId?.username || selectedQuestion?.username || 'Anonymous'}
                  </span>
                  <span>
                     {selectedQuestion?.createdAt ? new Date(selectedQuestion.createdAt).toLocaleDateString() : 'Date unknown'}
                  </span>
               </div>
            </div>
            <Answers questionId={questionId} refresh={refreshAnswers} />

            {/* Submit Answer Section */}
            <div className="border border-gray-600 rounded-lg p-6 bg-gray-800/30">
               <h3 className="text-xl font-bold mb-4">Submit Your Answer</h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium mb-2">Your Answer</label>
                     <div className="border border-gray-500 rounded-lg overflow-hidden bg-gray-900/50">
                        {/* Rich Text Editor Toolbar */}
                        <div className="bg-gray-800 px-4 py-3 border-b border-gray-500">
                           <div className="flex items-center space-x-1 flex-wrap gap-2">
                              {/* Text Formatting */}
                              <div className="flex items-center space-x-1 border-r border-gray-600 pr-2">
                                 <button
                                    onClick={() => editor?.chain().focus().toggleBold().run()}
                                    className={`p-2 hover:bg-gray-700 rounded transition-colors ${editor?.isActive('bold') ? 'bg-gray-700' : ''}`}
                                    title="Bold"
                                 >
                                    <Bold className="w-4 h-4" />
                                 </button>
                                 <button
                                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                                    className={`p-2 hover:bg-gray-700 rounded transition-colors ${editor?.isActive('italic') ? 'bg-gray-700' : ''}`}
                                    title="Italic"
                                 >
                                    <Italic className="w-4 h-4" />
                                 </button>
                                 <button
                                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                                    className={`p-2 hover:bg-gray-700 rounded transition-colors ${editor?.isActive('strike') ? 'bg-gray-700' : ''}`}
                                    title="Strikethrough"
                                 >
                                    <Strikethrough className="w-4 h-4" />
                                 </button>
                              </div>

                              {/* Lists */}
                              <div className="flex items-center space-x-1 border-r border-gray-600 pr-2">
                                 <button
                                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                    className={`p-2 hover:bg-gray-700 rounded transition-colors ${editor?.isActive('bulletList') ? 'bg-gray-700' : ''}`}
                                    title="Bullet List"
                                 >
                                    <List className="w-4 h-4" />
                                 </button>
                                 <button
                                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                    className={`p-2 hover:bg-gray-700 rounded transition-colors ${editor?.isActive('orderedList') ? 'bg-gray-700' : ''}`}
                                    title="Numbered List"
                                 >
                                    <ListOrdered className="w-4 h-4" />
                                 </button>
                              </div>

                              {/* Links and Images */}
                              <div className="flex items-center space-x-1 border-r border-gray-600 pr-2">
                                 <button
                                    onClick={() => setShowLinkDialog(true)}
                                    className={`p-2 hover:bg-gray-700 rounded transition-colors ${editor?.isActive('link') ? 'bg-gray-700' : ''}`}
                                    title="Insert Link"
                                 >
                                    <LinkIcon className="w-4 h-4" />
                                 </button>
                                 <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                                    title="Upload Image"
                                 >
                                    <ImageIcon className="w-4 h-4" />
                                 </button>
                              </div>

                              {/* Code and Quote */}
                              <div className="flex items-center space-x-1 border-r border-gray-600 pr-2">
                                 <button
                                    onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                                    className={`p-2 hover:bg-gray-700 rounded transition-colors text-xs font-mono ${editor?.isActive('codeBlock') ? 'bg-gray-700' : ''}`}
                                    title="Code Block"
                                 >
                                    {'</>'}
                                 </button>
                                 <button
                                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                                    className={`p-2 hover:bg-gray-700 rounded transition-colors text-lg ${editor?.isActive('blockquote') ? 'bg-gray-700' : ''}`}
                                    title="Quote"
                                 >
                                    "
                                 </button>
                              </div>

                              {/* Emoji */}
                              <div className="flex items-center space-x-1">
                                 <div className="relative">
                                    <button
                                       onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                       className="p-2 hover:bg-gray-700 rounded transition-colors"
                                       title="Insert Emoji"
                                    >
                                       <Smile className="w-4 h-4" />
                                    </button>
                                    {showEmojiPicker && (
                                       <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg p-3 z-10 shadow-lg emoji-picker-popup">
                                          <div className="grid grid-cols-8 gap-1">
                                             {commonEmojis.map((emoji, index) => (
                                                <button
                                                   key={index}
                                                   onClick={() => insertEmoji(emoji)}
                                                   className="p-1 hover:bg-gray-700 rounded text-lg emoji-btn"
                                                >
                                                   {emoji}
                                                </button>
                                             ))}
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Rich Text Editor */}
                        <EditorContent editor={editor} />
                     </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-between items-center">
                     <div className="text-sm text-gray-400">
                        <span>Supports rich text formatting</span>
                     </div>
                     <button
                        onClick={handleSubmitAnswer}
                        disabled={!editor?.getHTML() || editor.getHTML() === '<p></p>' || isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded transition-colors flex items-center space-x-2"
                     >
                        {isSubmitting ? (
                           <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Submitting...</span>
                           </>
                        ) : (
                           <>
                              <Send className="w-4 h-4" />
                              <span>Submit Answer</span>
                           </>
                        )}
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Hidden file input for image uploads */}
         <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
         />

         {/* Link Dialog */}
         {showLinkDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 w-96">
                  <h3 className="text-lg font-bold mb-4">Insert Link</h3>
                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium mb-2">Link Text</label>
                        <input
                           type="text"
                           value={linkText}
                           onChange={(e) => setLinkText(e.target.value)}
                           placeholder="Enter link text"
                           className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-2">URL</label>
                        <input
                           type="url"
                           value={linkUrl}
                           onChange={(e) => setLinkUrl(e.target.value)}
                           placeholder="https://example.com"
                           className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                     </div>
                     <div className="flex justify-end space-x-3">
                        <button
                           onClick={() => setShowLinkDialog(false)}
                           className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={insertLink}
                           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                        >
                           Insert
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
         {/* Emoji Picker Styling */}
         <style>{`
           .emoji-picker-popup img {
             width: 2rem !important;
             height: 2rem !important;
             object-fit: contain !important;
             display: block;
             margin: 0 auto;
           }
           .emoji-picker-popup button {
             width: 2.5rem !important;
             height: 2.5rem !important;
             display: flex;
             align-items: center;
             justify-content: center;
             padding: 0 !important;
             background: none !important;
             border: none !important;
             box-shadow: none !important;
           }
           .emoji-picker-popup span {
             font-size: 1.5rem !important;
             display: flex;
             align-items: center;
             justify-content: center;
           }
         `}</style>
      </div>
   );
}