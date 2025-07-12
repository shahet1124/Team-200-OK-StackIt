import React, { useState, useEffect } from 'react';
import {
  Search, ChevronDown, ChevronLeft, ChevronRight,
  Plus, Eye, MessageCircle, ThumbsUp, Clock, User, Filter
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { isUserLoggedIn } from '../utils/check.js';

export default function StackItUI() {
  const [selectedFilter, setSelectedFilter] = useState('Newest Answered');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [animatedQuestions, setAnimatedQuestions] = useState([]);
  const [itemsPerPage] = useState(10);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/questions?page=1&limit=100`, {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
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

  // Handle filter change
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
    setAnimatedQuestions([]);
  };

  // Filter dropdown options
  const filterOptions = [
    'Newest Answered',
    'Newest Unanswered',
    'Most Answers'
  ];

  // Filter + sort
  const filteredQuestions = questions
    .filter(q =>
      q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (selectedFilter) {
        case 'Newest Answered': {
          const aHasAnswers = (a.answerCount || 0) > 0;
          const bHasAnswers = (b.answerCount || 0) > 0;
          if (aHasAnswers && !bHasAnswers) return -1;
          if (!aHasAnswers && bHasAnswers) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        case 'Newest Unanswered': {
          const aNoAnswers = (a.answerCount || 0) === 0;
          const bNoAnswers = (b.answerCount || 0) === 0;
          if (aNoAnswers && !bNoAnswers) return -1;
          if (!aNoAnswers && bNoAnswers) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        case 'Most Answers': {
          const aAnswers = a.answerCount || 0;
          const bAnswers = b.answerCount || 0;
          return bAnswers - aAnswers;
        }
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  // Animate on questions change
  useEffect(() => {
    if (paginatedQuestions.length > 0) {
      setAnimatedQuestions([]);
      paginatedQuestions.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedQuestions(prev => [...prev, index]);
        }, index * 100);
      });
    }
  }, [paginatedQuestions.length, selectedFilter, searchQuery, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handleAskQuestionClick = () => {
    if (isUserLoggedIn()) navigate('/ask-new-question');
    else navigate('/login');
  };

  const handleQuestionClick = (question) => {
    navigate(`/question/${question._id}`);
  };

   return (
      <div className="min-h-screen relative overflow-hidden" style={{
         background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1a1a2e 100%)'
      }}>
         {/* Animated Background Elements */}
         <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

            {/* Floating particles */}
            {[...Array(15)].map((_, i) => (
               <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full animate-bounce"
                  style={{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`,
                     animationDelay: `${Math.random() * 5}s`,
                     animationDuration: `${3 + Math.random() * 4}s`
                  }}
               ></div>
            ))}
         </div>

         <div className="relative z-10 text-white p-6">
            <div className="max-w-6xl mx-auto">



               {/* Main Content Area */}
               <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                  {/* Controls Bar */}
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center space-x-4">
                        <button 
                           onClick={handleAskQuestionClick}
                           className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                        >
                           <div className="flex items-center space-x-2">
                              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                              <span>Ask New Question</span>
                           </div>
                        </button>

                        <div className="relative">
                           <button
                              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-3 flex items-center space-x-2 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                           >
                              <Filter className="w-4 h-4" />
                              <span>{selectedFilter}</span>
                              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilterDropdown ? 'rotate-180' : ''}`} />
                           </button>

                           {showFilterDropdown && (
                              <div className="absolute top-full left-0 mt-2 w-48 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                 {filterOptions.map((option) => (
                                    <button
                                       key={option}
                                       onClick={() => handleFilterChange(option)}
                                       className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                                    >
                                       {option}
                                    </button>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="relative group">
                        <input
                           type="text"
                           placeholder="Search questions..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-3 pr-12 w-80 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 placeholder-gray-400"
                        />
                        <Search className="absolute right-4 top-3.5 w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                     </div>
                  </div>

                  {/* Loading State */}
                  {loading && (
                     <div className="text-center py-16">
                        <div className="relative">
                           <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                           <div className="absolute inset-0 w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mt-2 ml-2"></div>
                        </div>
                        <p className="mt-6 text-gray-300 animate-pulse">Loading questions...</p>
                     </div>
                  )}

                  {/* Error State */}
                  {error && (
                     <div className="text-center py-16">
                        <div className="bg-red-500/10 backdrop-blur-lg border border-red-500/20 rounded-xl p-6 mb-6 max-w-md mx-auto">
                           <p className="text-red-200">Error loading questions: {error}</p>
                           <p className="text-red-300 text-sm mt-2">
                              This might be due to CORS issues. Try accessing the API directly or configure CORS on your server.
                           </p>
                        </div>
                        <button
                           onClick={() => window.location.reload()}
                           className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-red-600 hover:to-pink-700 transition-all duration-300 hover:scale-105"
                        >
                           Retry
                        </button>
                     </div>
                  )}

                  {/* Questions List */}
                  {!loading && !error && (
                     <div className="space-y-6 mb-8">
                        {filteredQuestions.length === 0 ? (
                           <div className="text-center py-16">
                              <p className="text-gray-400 text-lg">No questions found.</p>
                           </div>
                        ) : (
                           <>
                              {/* Pagination Info */}
                              <div className="text-sm text-gray-400 mb-4">
                                 Showing {startIndex + 1}-{Math.min(endIndex, filteredQuestions.length)} of {filteredQuestions.length} questions
                              </div>
                              
                              {paginatedQuestions.map((question, index) => (
                              <div
                                 key={question._id || question.id}
                                 className={`group bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer hover:scale-[1.02] ${animatedQuestions.includes(index) ? 'animate-in fade-in slide-in-from-bottom-4' : 'opacity-0'
                                    }`}
                                 onClick={() => handleQuestionClick(question)}
                                 style={{ animationDelay: `${index * 100}ms` }}
                              >
                                 <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                       <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                                          {question.title || 'Untitled Question'}
                                       </h3>
                                       <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                                          {question.description || question.body || 'No description available'}
                                       </p>

                                       {/* Tags */}
                                       <div className="flex flex-wrap gap-2 mb-4">
                                          {question.tags && question.tags.length > 0 ? (
                                             question.tags.map((tag, tagIndex) => (
                                                <span
                                                   key={tagIndex}
                                                   className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-white/10 text-xs px-3 py-1 rounded-full hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300"
                                                >
                                                   {tag}
                                                </span>
                                             ))
                                          ) : (
                                             <span className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 backdrop-blur-lg border border-white/10 text-xs px-3 py-1 rounded-full">
                                                No tags
                                             </span>
                                          )}
                                       </div>

                                       {/* Question Meta */}
                                       <div className="flex items-center space-x-6 text-sm text-gray-400">
                                          <div className="flex items-center space-x-1">
                                             <User className="w-4 h-4" />
                                             <span>{question.userId?.username || question.username || question.author || 'Anonymous'}</span>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                             <Clock className="w-4 h-4" />
                                             <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                                          </div>
                                          {question.viewCount && (
                                             <div className="flex items-center space-x-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{question.viewCount} views</span>
                                             </div>
                                          )}
                                       </div>
                                    </div>

                                    {/* Question Stats */}
                                    <div className="ml-6 flex flex-col items-center space-y-3">
                                       {question.votes !== undefined && (
                                          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-white/10 text-white text-sm px-4 py-2 rounded-xl flex items-center space-x-2">
                                             <ThumbsUp className="w-4 h-4" />
                                             <span>{question.votes}</span>
                                          </div>
                                       )}
                                       <div className={`backdrop-blur-lg border border-white/10 text-white text-sm px-4 py-2 rounded-xl flex items-center space-x-2 ${
                                          (question.answerCount || 0) > 0 
                                             ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20' 
                                             : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20'
                                       }`}>
                                          <MessageCircle className="w-4 h-4" />
                                          <span>{question.answerCount || 0}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                           </>
                        )}
                     </div>
                  )}

                  {/* Pagination */}
                  {!loading && !error && filteredQuestions.length > 0 && totalPages > 1 && (
                     <div className="flex items-center justify-center space-x-3">
                        <button
                           onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                           disabled={currentPage === 1}
                           className="p-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                        >
                           <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* First page */}
                        {currentPage > 3 && totalPages > 5 && (
                           <>
                              <button
                                 onClick={() => setCurrentPage(1)}
                                 className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10"
                              >
                                 1
                              </button>
                              {currentPage > 4 && <span className="text-gray-400">...</span>}
                           </>
                        )}

                        {pageNumbers.map((pageNum) => (
                           <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${currentPage === pageNum
                                 ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                 : 'bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10'
                                 }`}
                           >
                              {pageNum}
                           </button>
                        ))}

                        {/* Last page */}
                        {currentPage < totalPages - 2 && totalPages > 5 && (
                           <>
                              {currentPage < totalPages - 3 && <span className="text-gray-400">...</span>}
                              <button
                                 onClick={() => setCurrentPage(totalPages)}
                                 className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10"
                              >
                                 {totalPages}
                              </button>
                           </>
                        )}

                        <button
                           onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                           disabled={currentPage === totalPages}
                           className="p-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                        >
                           <ChevronRight className="w-5 h-5" />
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}