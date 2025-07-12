import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import QuestionDetail from './QuestionDetail';

export default function StackItUI() {
   const [selectedFilter, setSelectedFilter] = useState('Newest Unanswered');
   const [searchQuery, setSearchQuery] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [questions, setQuestions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [currentScreen, setCurrentScreen] = useState(1); // 1 = Home, 3 = Question Detail
   const [selectedQuestion, setSelectedQuestion] = useState(null);

   const API_URL = import.meta.env.VITE_API_URL;

   // Fetch questions from API using fetch
   useEffect(() => {
      const fetchQuestions = async () => {
         try {
            setLoading(true);
            // Option 1: Direct call (requires CORS setup on backend)
            const response = await fetch(API_URL + "/questions", {
               method: 'GET',
               headers: {
                  'ngrok-skip-browser-warning': 'true',
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
               },
               mode: 'cors'
            });

            // Option 2: Use proxy (uncomment if CORS still doesn't work)
            // const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://e4282f6d1020.ngrok-free.app/questions'), {
            //    method: 'GET',
            //    headers: {
            //       'Content-Type': 'application/json',
            //    }
            // });

            if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data); // Debug log
            setQuestions(Array.isArray(data.questions) ? data.questions : []);
            setError(null);
         } catch (err) {
            setError(err.message || 'Failed to fetch questions');
            console.error('Error fetching questions:', err);
         } finally {
            setLoading(false);
         }
      };

      fetchQuestions();
   }, []);

   // Handle question click
   const handleQuestionClick = (question) => {
      setSelectedQuestion(question);
      setCurrentScreen(3);
   };

   // Handle back to home
   const handleBackToHome = () => {
      setCurrentScreen(1);
      setSelectedQuestion(null);
   };

   const filterOptions = [
      'Newest Unanswered',
      'Most Voted',
      'Recent Activity',
      'Most Views'
   ];

   const totalPages = 7;
   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

   // Filter questions based on search query
   const filteredQuestions = questions.filter(question =>
      question.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description?.toLowerCase().includes(searchQuery.toLowerCase())
   );

   // Render Screen 1 - Home Page
   const renderHomePage = () => (
      <div className="min-h-screen text-white p-6" style={{ backgroundColor: '#141720' }}>
         <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
               <h1 className="text-3xl font-bold">StackIt</h1>
               <button className="bg-transparent border border-white rounded-full px-4 py-2 text-sm hover:bg-white hover:text-black transition-colors">
                  Login
               </button>
            </div>

            {/* Main Content Area */}
            <div className="border border-gray-600 rounded-lg p-6">
               {/* Controls Bar */}
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                     <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                        Ask New Question
                     </button>

                     <div className="relative">
                        <button className="bg-transparent border border-gray-500 rounded px-4 py-2 flex items-center space-x-2 hover:border-gray-400 transition-colors">
                           <span>{selectedFilter}</span>
                           <ChevronDown className="w-4 h-4" />
                        </button>
                     </div>
                  </div>

                  <div className="relative">
                     <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border border-gray-500 rounded px-4 py-2 pr-10 w-64 focus:outline-none focus:border-gray-400 transition-colors"
                     />
                     <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
               </div>

               {/* Loading State */}
               {loading && (
                  <div className="text-center py-8">
                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                     <p className="mt-2 text-gray-400">Loading questions...</p>
                  </div>
               )}

               {/* Error State */}
               {error && (
                  <div className="text-center py-8">
                     <div className="bg-red-900 border border-red-600 rounded-lg p-4 mb-4">
                        <p className="text-red-200">Error loading questions: {error}</p>
                        <p className="text-red-300 text-sm mt-2">
                           This might be due to CORS issues. Try accessing the API directly or configure CORS on your server.
                        </p>
                     </div>
                     <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                     >
                        Retry
                     </button>
                  </div>
               )}

               {/* Questions List */}
               {!loading && !error && (
                  <div className="space-y-4 mb-6">
                     {filteredQuestions.length === 0 ? (
                        <div className="text-center py-8">
                           <p className="text-gray-400">No questions found.</p>
                        </div>
                     ) : (
                        filteredQuestions.map((question) => (
                           <div key={question._id || question.id} className="border-b border-gray-700 pb-4">
                              <div className="flex items-start justify-between">
                                 <div className="flex-1">
                                    <h3
                                       className="text-lg font-medium mb-2 hover:text-blue-400 cursor-pointer"
                                       onClick={() => handleQuestionClick(question)}
                                    >
                                       {question.title || 'Untitled Question'}
                                    </h3>
                                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                                       {question.description || question.body || 'No description available'}
                                    </p>
                                    <div className="flex items-center space-x-4">
                                       <div className="flex space-x-2">
                                          {question.tags && question.tags.length > 0 ? (
                                             question.tags.map((tag, index) => (
                                                <span
                                                   key={index}
                                                   className="bg-gray-700 text-xs px-2 py-1 rounded"
                                                >
                                                   {tag}
                                                </span>
                                             ))
                                          ) : (
                                             <span className="bg-gray-700 text-xs px-2 py-1 rounded">
                                                No tags
                                             </span>
                                          )}
                                       </div>
                                       <span className="text-gray-400 text-sm">
                                          {question.userId?.username || question.username || question.author || 'Anonymous'}
                                       </span>
                                       <span className="text-gray-500 text-xs">
                                          {new Date(question.createdAt).toLocaleDateString()}
                                       </span>
                                    </div>
                                 </div>
                                 <div className="ml-4 flex-shrink-0">
                                    <div className="bg-gray-700 text-white text-sm px-3 py-1 rounded">
                                       {question.answerCount || question.answerCount || 0} ans
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               )}

               {/* Pagination */}
               {!loading && !error && filteredQuestions.length > 0 && (
                  <div className="flex items-center justify-center space-x-2">
                     <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 hover:bg-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <ChevronLeft className="w-4 h-4" />
                     </button>

                     {pageNumbers.map((pageNum) => (
                        <button
                           key={pageNum}
                           onClick={() => setCurrentPage(pageNum)}
                           className={`px-3 py-1 rounded transition-colors ${currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-800'
                              }`}
                        >
                           {pageNum}
                        </button>
                     ))}

                     <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 hover:bg-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
               )}
            </div>

            {/* Footer Note */}
            <div className="mt-4 text-center">
               <p className="text-gray-400 text-sm">Pagination</p>
            </div>
         </div>
      </div>
   );

   // Main render function
   return (
      <div>
         {currentScreen === 1 && renderHomePage()}
         {currentScreen === 3 && (
            <QuestionDetail
               selectedQuestion={selectedQuestion}
               onBackToHome={handleBackToHome}
            />
         )}
      </div>
   );
}