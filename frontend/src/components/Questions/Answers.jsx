import React, { useState, useEffect } from 'react';

const Answers = ({ questionId, refresh }) => {
   const [questionData, setQuestionData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const API_URL = import.meta.env.VITE_API_URL; 

   useEffect(() => {
      fetchQuestionData();
   }, [questionId, refresh]);

   const fetchQuestionData = async () => {
      try {
         setLoading(true);
         const response = await fetch(`${API_URL}/questions/${questionId}`);
         if (!response.ok) {
            throw new Error('Failed to fetch question data');
         }
         const data = await response.json();
         setQuestionData(data);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   const formatTimeAgo = (timestamp) => {
      const now = new Date();
      const createdAt = new Date(timestamp);
      const diffInMs = now - createdAt;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) {
         const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
         if (diffInHours === 0) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            return diffInMinutes <= 1 ? 'just now' : `${diffInMinutes} minutes ago`;
         }
         return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
      }
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
   };

   const handleVote = async (answerId, voteType) => {
      try {
         // Convert voteType to vote value: upvote = 1, downvote = -1
         const vote = voteType === 'upvote' ? 1 : -1;
         const token = localStorage.getItem('token');
         if(!token) {
            alert('Please login to vote');
            return;
         }
         
         const response = await fetch(`${API_URL}/answers/${answerId}/vote`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store JWT token in localStorage
            },
            body: JSON.stringify({ vote })
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to vote');
         }

         const result = await response.json();
         
         // Update the local state with new vote counts
         setQuestionData(prevData => ({
            ...prevData,
            answers: prevData.answers.map(answer => 
               answer._id === answerId 
                  ? { 
                      ...answer, 
                      upvotes: result.upvotes,
                      downvotes: result.downvotes
                    }
                  : answer
            )
         }));

         console.log(`Successfully voted ${voteType} for answer ${answerId}`);
      } catch (err) {
         console.error('Error voting:', err);
         // You might want to show a user-friendly error message here
         alert(err.message);
      }
   };

   // Helper to add target _blank to all links
   function addTargetBlankToLinks(html) {
     if (!html) return html;
     return html.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
   }

   if (loading) {
      return (
         <div className="flex justify-center items-center py-8">
            <div className="text-gray-400">Loading answers...</div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="text-red-400 text-center py-8">
            Error: {error}
         </div>
      );
   }

   if (!questionData || !questionData.answers) {
      return (
         <div className="text-gray-400 text-center py-8">
            No answers found.
         </div>
      );
   }

   return (
      <div className="border border-gray-600 rounded-lg p-6 mb-6 bg-gray-800/30">
         <h3 className="text-xl font-bold mb-4">Answers ({questionData.answers.length})</h3>

         <div className="space-y-6">
            {questionData.answers.map((answer, index) => (
               <div key={answer._id} className={`${index < questionData.answers.length - 1 ? 'border-b border-gray-700 pb-6' : ''}`}>
                  <div className="flex items-start space-x-4">
                     <div className="flex flex-col items-center space-y-2">
                        <button 
                           onClick={() => handleVote(answer._id, 'upvote')}
                           className="w-8 h-8 border border-gray-500 rounded flex items-center justify-center hover:bg-gray-700 transition-colors text-green-400"
                        >
                           ▲
                        </button>
                        <span className="text-xs font-medium text-green-400">
                           {answer.upvotes || 0}
                        </span>
                        <span className="text-xs font-medium text-red-400">
                           {answer.downvotes || 0}
                        </span>
                        <button 
                           onClick={() => handleVote(answer._id, 'downvote')}
                           className="w-8 h-8 border border-gray-500 rounded flex items-center justify-center hover:bg-gray-700 transition-colors text-red-400"
                        >
                           ▼
                        </button>
                     </div>
                     <div className="flex-1">
                        <div className="text-gray-300 mb-3 leading-relaxed" 
                             dangerouslySetInnerHTML={{ __html: addTargetBlankToLinks(answer.content) }}>
                        </div>
                        <div className="text-sm text-gray-400 flex items-center space-x-4">
                           <span>Answered by {answer.userId.username}</span>
                           <span>{formatTimeAgo(answer.createdAt)}</span>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default Answers;