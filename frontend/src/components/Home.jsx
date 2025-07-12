import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Star, MessageCircle, TrendingUp, ArrowRight, Sparkles, Users, CheckCircle, HelpCircle } from 'lucide-react';

const ModernQAHomePage = () => {
   const [isLoaded, setIsLoaded] = useState(false);
   const [currentQuestion, setCurrentQuestion] = useState(0);
   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

   const featuredQuestions = [
      {
         id: 1,
         question: "How to implement real-time WebSocket connections in Next.js 14?",
         author: "Emma Chen",
         avatar: "EC",
         votes: 127,
         answers: 23,
         tags: ["Next.js", "WebSocket", "Real-time"],
         time: "3 min ago",
         trending: true
      },
      {
         id: 2,
         question: "What's the best approach for state management in large React apps?",
         author: "James Rodriguez",
         avatar: "JR",
         votes: 89,
         answers: 15,
         tags: ["React", "State Management", "Architecture"],
         time: "12 min ago",
         trending: false
      },
      {
         id: 3,
         question: "How to optimize database queries for millions of records?",
         author: "Sophia Kim",
         avatar: "SK",
         votes: 156,
         answers: 31,
         tags: ["Database", "Performance", "SQL"],
         time: "25 min ago",
         trending: true
      }
   ];

   const stats = [
      { label: "Questions Asked", value: "2.3M", icon: HelpCircle },
      { label: "Answers Given", value: "850K", icon: CheckCircle },
      { label: "Active Users", value: "180K", icon: Users },
      { label: "Expert Contributors", value: "45K", icon: Star }
   ];

   useEffect(() => {
      setIsLoaded(true);

      const questionInterval = setInterval(() => {
         setCurrentQuestion(prev => (prev + 1) % featuredQuestions.length);
      }, 4000);

      const handleMouseMove = (e) => {
         setMousePos({
            x: (e.clientX / window.innerWidth) * 100,
            y: (e.clientY / window.innerHeight) * 100
         });
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
         clearInterval(questionInterval);
         window.removeEventListener('mousemove', handleMouseMove);
      };
   }, []);

   const QuestionCard = ({ question, index, isActive }) => (
      <div
         className={`absolute inset-0 transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
            }`}
      >
         <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500">
               {question.trending && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                     <TrendingUp size={10} />
                     Hot
                  </div>
               )}

               <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                     <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                        {question.avatar}
                     </div>
                     <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white/20"></div>
                  </div>
                  <div className="flex-1">
                     <p className="text-white font-semibold text-sm">{question.author}</p>
                     <p className="text-white/50 text-xs">{question.time}</p>
                  </div>
               </div>

               <h3 className="text-white text-lg font-bold mb-3 leading-tight">
                  {question.question}
               </h3>

               <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map(tag => (
                     <span key={tag} className="px-2 py-1 bg-white/10 text-white/80 rounded-full text-xs font-medium border border-white/20">
                        {tag}
                     </span>
                  ))}
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-1">
                        <Star className="text-yellow-400" size={16} />
                        <span className="text-white font-semibold text-sm">{question.votes}</span>
                     </div>
                     <div className="flex items-center gap-1">
                        <MessageCircle className="text-blue-400" size={16} />
                        <span className="text-white font-semibold text-sm">{question.answers}</span>
                     </div>
                  </div>
                  <button className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors group text-sm">
                     Read More
                     <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
         </div>
      </div>
   );

   const StatCard = ({ stat, index }) => (
      <div
         className={`bg-white/[0.02] backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
         style={{ transitionDelay: `${index * 100}ms` }}
      >
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center">
               <stat.icon className="text-white" size={18} />
            </div>
            <div>
               <p className="text-xl font-bold text-white">{stat.value}</p>
               <p className="text-white/60 text-xs">{stat.label}</p>
            </div>
         </div>
      </div>
   );

   return (
      <div className="min-h-screen bg-black relative overflow-hidden">
         {/* Animated Background */}
         <div className="absolute inset-0">
            <div
               className="absolute inset-0 opacity-30"
               style={{
                  background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`
               }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-black"></div>

            {/* Floating particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-violet-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
         </div>

         {/* Grid Pattern */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

         <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
            <div className="max-w-6xl mx-auto w-full">
               <div className="grid lg:grid-cols-2 gap-12 items-center">

                  {/* Left Side - Main Content */}
                  <div className="text-center lg:text-left">


                     <h1
                        className={`text-5xl md:text-6xl font-black mb-6 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                           }`}
                     >
                        <span className="bg-gradient-to-r from-white via-cyan-200 to-violet-200 bg-clip-text text-transparent">
                           Code.
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                           Connect.
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                           Create.
                        </span>
                     </h1>

                     <p
                        className={`text-lg md:text-xl text-white/70 mb-8 leading-relaxed transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                           }`}
                     >
                        Join the next generation of developers. Ask questions, share knowledge, and build the future of technology together.
                     </p>

                     <div
                        className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                           }`}
                     >
                        <button className="group relative px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-2xl text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25">
                           <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                           <div className="relative flex items-center gap-2">
                              <Search size={20} />
                              Ask Question
                           </div>
                        </button>

                        <button className="group px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl text-white font-bold text-lg border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:bg-white/10">
                           <div className="flex items-center gap-2">
                              <BookOpen size={20} />
                              Browse Topics
                           </div>
                        </button>
                     </div>

                     {/* Stats Grid */}
                     <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                           <StatCard key={stat.label} stat={stat} index={index} />
                        ))}
                     </div>
                  </div>

                  {/* Right Side - Featured Questions */}
                  <div className={`relative transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                     }`}>
                     <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">
                           <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                              Trending Now
                           </span>
                        </h2>
                        <p className="text-white/60 text-sm">Latest questions from our community</p>
                     </div>

                     <div className="relative h-80 mb-6">
                        {featuredQuestions.map((question, index) => (
                           <QuestionCard
                              key={question.id}
                              question={question}
                              index={index}
                              isActive={index === currentQuestion}
                           />
                        ))}
                     </div>

                     {/* Navigation Dots */}
                     <div className="flex justify-center gap-2">
                        {featuredQuestions.map((_, index) => (
                           <button
                              key={index}
                              onClick={() => setCurrentQuestion(index)}
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentQuestion
                                 ? 'bg-gradient-to-r from-cyan-400 to-violet-400 scale-110'
                                 : 'bg-white/20 hover:bg-white/40'
                                 }`}
                           />
                        ))}
                     </div>

                     {/* Floating Decorative Elements */}
                     <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-50 animate-pulse"></div>
                     <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full opacity-40 animate-bounce"></div>
                     <div className="absolute top-1/3 -right-6 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full opacity-30 animate-ping"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ModernQAHomePage;