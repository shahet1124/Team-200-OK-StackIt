import React, { useState, useRef, useEffect } from 'react';
import {
   Bold, Italic, Strikethrough, List, ListOrdered, Link, Image,
   AlignLeft, AlignCenter, AlignRight, Smile, Send, Upload
} from 'lucide-react';
import Answers from './Questions/Answers';
import { useParams } from 'react-router-dom';

export default function QuestionDetail() {
   const [newAnswer, setNewAnswer] = useState('');
   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
   const [showLinkDialog, setShowLinkDialog] = useState(false);
   const [linkUrl, setLinkUrl] = useState('');
   const [linkText, setLinkText] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const textareaRef = useRef(null);
   const fileInputRef = useRef(null);
   //get variable from url with react hook
   const { questionId } = useParams();

   // Common emojis for quick insertion
   const commonEmojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉', '🚀', '💡', '⚡', '🌟', '✨', '🎯'];
   const [selectedQuestion, setQuestion] = useState(null);
   const API_URL = import.meta.env.VITE_API_URL;

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
      if (newAnswer.trim()) {
         setIsSubmitting(true);
         try {
            // Here you would typically send the answer to your API
            console.log('Submitting answer:', newAnswer);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setNewAnswer('');
            alert('Answer submitted successfully!');
         } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Failed to submit answer. Please try again.');
         } finally {
            setIsSubmitting(false);
         }
      }
   };

   // Text formatting functions
   const formatText = (format) => {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = newAnswer.substring(start, end);

      let formattedText = '';

      switch (format) {
         case 'bold':
            formattedText = `**${selectedText || 'bold text'}**`;
            break;
         case 'italic':
            formattedText = `*${selectedText || 'italic text'}*`;
            break;
         case 'strikethrough':
            formattedText = `~~${selectedText || 'strikethrough text'}~~`;
            break;
         case 'ul':
            formattedText = `\n- ${selectedText || 'list item'}\n`;
            break;
         case 'ol':
            formattedText = `\n1. ${selectedText || 'list item'}\n`;
            break;
         case 'code':
            formattedText = `\`${selectedText || 'code'}\``;
            break;
         case 'quote':
            formattedText = `\n> ${selectedText || 'quote'}\n`;
            break;
         default:
            return;
      }

      const newText = newAnswer.substring(0, start) + formattedText + newAnswer.substring(end);
      setNewAnswer(newText);

      // Focus back to textarea
      setTimeout(() => {
         textarea.focus();
         textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
      }, 0);
   };

   // Insert emoji
   const insertEmoji = (emoji) => {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newText = newAnswer.substring(0, start) + emoji + newAnswer.substring(end);
      setNewAnswer(newText);
      setShowEmojiPicker(false);

      setTimeout(() => {
         textarea.focus();
         textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
   };

   // Insert link
   const insertLink = () => {
      if (linkUrl.trim()) {
         const textarea = textareaRef.current;
         const start = textarea.selectionStart;
         const end = textarea.selectionEnd;

         const linkMarkdown = `[${linkText || 'link'}](${linkUrl})`;
         const newText = newAnswer.substring(0, start) + linkMarkdown + newAnswer.substring(end);
         setNewAnswer(newText);

         setShowLinkDialog(false);
         setLinkUrl('');
         setLinkText('');

         setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + linkMarkdown.length, start + linkMarkdown.length);
         }, 0);
      }
   };

   // Handle image upload
   const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
         // In a real app, you would upload this to your server
         const reader = new FileReader();
         reader.onload = (e) => {
            const imageMarkdown = `![${file.name}](${e.target.result})`;
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const newText = newAnswer.substring(0, start) + imageMarkdown + newAnswer.substring(start);
            setNewAnswer(newText);
         };
         reader.readAsDataURL(file);
      }
   };

   return (
      <div className="min-h-screen text-white p-6" style={{ backgroundColor: '#141720' }}>
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

            {/* Question Detail */}
            <div className="border border-gray-600 rounded-lg p-6 mb-6 bg-gray-800/30">
               <h2 className="text-2xl font-bold mb-4">{selectedQuestion?.title || 'Question Title'}</h2>
               <p className="text-gray-300 mb-4 leading-relaxed">
                  {selectedQuestion?.description || 'Question description goes here...'}
               </p>

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
            <Answers questionId={questionId} />

            {/* Answers Section */}
            {/* <div className="border border-gray-600 rounded-lg p-6 mb-6 bg-gray-800/30">
               <h3 className="text-xl font-bold mb-4">Answers ({selectedQuestion?.answers || 2})</h3>

               <div className="space-y-6">
                  <div className="border-b border-gray-700 pb-6">
                     <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center space-y-2">
                           <button className="w-8 h-8 border border-gray-500 rounded flex items-center justify-center hover:bg-gray-700 transition-colors text-green-400">
                              ▲
                           </button>
                           <span className="text-sm font-medium">5</span>
                           <button className="w-8 h-8 border border-gray-500 rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
                              ▼
                           </button>
                        </div>
                        <div className="flex-1">
                           <p className="text-gray-300 mb-3 leading-relaxed">
                              This is a sample answer. You can use the MongoDB native driver or an ODM like Mongoose to connect to MongoDB from Node.js. Here's how you can set it up with proper error handling and connection pooling for better performance.
                           </p>
                           <div className="text-sm text-gray-400 flex items-center space-x-4">
                              <span>Answered by User123</span>
                              <span>2 days ago</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div> */}

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
                                    onClick={() => formatText('bold')}
                                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                                    title="Bold"
                                 >
                                    <Bold className="w-4 h-4" />
                                 </button>
                                 <button
                                    onClick={() => formatText('italic')}
                                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                                    title="Italic"
                                 >
                                    <Italic className="w-4 h-4" />
                                 </button>
                                 <button
                                    onClick={() => formatText('strikethrough')}
                                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                                    title="Strikethrough"
                                 >
                                    <Strikethrough className="w-4 h-4" />
                                 </button>
                              </div>

                              {/* Lists */}
                              <div className="flex items-center space-x-1 border-r border-gray-600 pr-2">
                                 <button
                                    onClick={() => formatText('ul')}
                                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                                    title="Bullet List"
                                 >
                                    <List className="w-4 h-4" />
                                 </button>
                                 <button
                                    onClick={() => formatText('ol')}
                                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                                    title="Numbered List"
                                 >
                                    <ListOrdered className="w-4 h-4" />
                                 </button>
                              </div>

                              {/* Links and Images */}
                              <div className="flex items-center space-x-1 border-r border-gray-600 pr-2">
                                 <button
                                    onClick={() => setShowLinkDialog(true)}
                                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                                    title="Insert Link"
                                 >
                                    <Link className="w-4 h-4" />
                                 </button>
                                 <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                                    title="Upload Image"
                                 >
                                    <Image className="w-4 h-4" />
                                 </button>
                              </div>

                              {/* Alignment */}
                              <div className="flex items-center space-x-1 border-r border-gray-600 pr-2">
                                 <button className="p-2 hover:bg-gray-700 rounded transition-colors" title="Align Left">
                                    <AlignLeft className="w-4 h-4" />
                                 </button>
                                 <button className="p-2 hover:bg-gray-700 rounded transition-colors" title="Align Center">
                                    <AlignCenter className="w-4 h-4" />
                                 </button>
                                 <button className="p-2 hover:bg-gray-700 rounded transition-colors" title="Align Right">
                                    <AlignRight className="w-4 h-4" />
                                 </button>
                              </div>

                              {/* Emoji and Other */}
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
                                       <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg p-3 z-10 shadow-lg">
                                          <div className="grid grid-cols-8 gap-1">
                                             {commonEmojis.map((emoji, index) => (
                                                <button
                                                   key={index}
                                                   onClick={() => insertEmoji(emoji)}
                                                   className="p-1 hover:bg-gray-700 rounded text-lg"
                                                >
                                                   {emoji}
                                                </button>
                                             ))}
                                          </div>
                                       </div>
                                    )}
                                 </div>
                                 <button
                                    onClick={() => formatText('code')}
                                    className="p-2 hover:bg-gray-700 rounded transition-colors text-xs font-mono"
                                    title="Code"
                                 >
                                    {'</>'}
                                 </button>
                                 <button
                                    onClick={() => formatText('quote')}
                                    className="p-2 hover:bg-gray-700 rounded transition-colors text-lg"
                                    title="Quote"
                                 >
                                    "
                                 </button>
                              </div>
                           </div>
                        </div>

                        {/* Text Area */}
                        <textarea
                           ref={textareaRef}
                           value={newAnswer}
                           onChange={(e) => setNewAnswer(e.target.value)}
                           placeholder="Write your answer here... You can use markdown formatting!"
                           className="w-full h-48 bg-transparent p-4 resize-none focus:outline-none text-gray-200 placeholder-gray-500"
                           style={{ backgroundColor: 'transparent' }}
                        />
                     </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-between items-center">
                     <div className="text-sm text-gray-400">
                        <span>Supports Markdown formatting</span>
                     </div>
                     <button
                        onClick={handleSubmitAnswer}
                        disabled={!newAnswer.trim() || isSubmitting}
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
      </div>
   );
}