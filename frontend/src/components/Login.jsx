import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight, Lock, User } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom"

const AnimatedDiv = ({ children, className, delay = 0, ...props }) => {
   const [isVisible, setIsVisible] = useState(false);

   useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
   }, [delay]);

   return (
      <div
         className={`${className} transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0 translate-x-0' : 'opacity-0 translate-y-4'
            }`}
         {...props}
      >
         {children}
      </div>
   );
};

const FloatingElement = ({ children, className, delay = 0, style }) => {
   return (
      <div
         className={`${className} animate-bounce`}
         style={{
            animationDelay: `${delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            ...style
         }}
      >
         {children}
      </div>
   );
};

export default function StackITLoginPage() {
   const [showPassword, setShowPassword] = useState(false);
   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const [isLoaded, setIsLoaded] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();

   // Separate useState for username and password
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [rememberMe, setRememberMe] = useState(false);

   const backgroundImages = [
      `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="sky1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%23667eea;stop-opacity:1" /><stop offset="100%" style="stop-color:%23764ba2;stop-opacity:1" /></linearGradient></defs><rect width="800" height="600" fill="url(%23sky1)"/><circle cx="100" cy="100" r="2" fill="%23ffffff" opacity="0.8"/><circle cx="300" cy="80" r="1.5" fill="%23ffffff" opacity="0.6"/><circle cx="500" cy="120" r="1" fill="%23ffffff" opacity="0.7"/><path d="M0,400 Q200,300 400,350 T800,320 L800,600 L0,600 Z" fill="%23333" opacity="0.8"/><path d="M0,450 Q300,380 600,420 T800,400 L800,600 L0,600 Z" fill="%23222" opacity="0.6"/></svg>')`,

      `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="sky2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%23ff6b6b;stop-opacity:1" /><stop offset="100%" style="stop-color:%23ee5a24;stop-opacity:1" /></linearGradient></defs><rect width="800" height="600" fill="url(%23sky2)"/><path d="M0,350 Q250,250 500,300 T800,280 L800,600 L0,600 Z" fill="%23444" opacity="0.7"/><path d="M0,420 Q350,350 700,380 T800,360 L800,600 L0,600 Z" fill="%23333" opacity="0.5"/><circle cx="150" cy="120" r="80" fill="%23ffd700" opacity="0.8"/><circle cx="600" cy="80" r="2" fill="%23ffffff" opacity="0.9"/></svg>')`,

      `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="sky3" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%2300b894;stop-opacity:1" /><stop offset="100%" style="stop-color:%2300a085;stop-opacity:1" /></linearGradient></defs><rect width="800" height="600" fill="url(%23sky3)"/><path d="M0,380 Q200,280 400,320 T800,300 L800,600 L0,600 Z" fill="%23555" opacity="0.6"/><path d="M0,480 Q300,400 600,440 T800,420 L800,600 L0,600 Z" fill="%23333" opacity="0.4"/><rect x="100" y="50" width="600" height="300" fill="%23fff" opacity="0.1" rx="20"/></svg>')`,

      `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="sky4" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%23a55eea;stop-opacity:1" /><stop offset="100%" style="stop-color:%238e44ad;stop-opacity:1" /></linearGradient></defs><rect width="800" height="600" fill="url(%23sky4)"/><path d="M0,320 Q150,220 300,260 Q450,300 600,240 T800,260 L800,600 L0,600 Z" fill="%23666" opacity="0.8"/><path d="M0,440 Q250,360 500,400 T800,380 L800,600 L0,600 Z" fill="%23444" opacity="0.6"/><polygon points="200,200 250,100 300,200" fill="%23fff" opacity="0.3"/></svg>')`
   ];

   const heroTitles = [
      "Welcome Back\nto StackIT",
      "Your Journey\nContinues Here",
      "Ready to Create\nAmazing Memories?",
      "Login to Your\nCreative Space"
   ];

   useEffect(() => {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
   }, []);

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
      }, 5000);
      return () => clearInterval(interval);
   }, []);

   const handleButtonClick = async () => {
      // Validate inputs
      if (!username || !password) {
         alert('Please fill in all fields');
         return;
      }

      setIsLoading(true);

      try {
         const API_URL = import.meta.env.VITE_API_URL;
         
         const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               username: username,
               password: password
            })
         });

         const data = await response.json();

         if (response.ok) {
            // Store token and user data in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            console.log('Login successful:', data);
            
            // Redirect to home page
            navigate('/');
         } else {
            // Handle error response
            alert(data.message || 'Login failed. Please check your credentials.');
         }
      } catch (error) {
         console.error('Error during login:', error);
         alert('Something went wrong during login. Please try again.');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gray-900 flex overflow-hidden relative">
         {/* Background particles */}
         <div className="absolute inset-0 z-0">
            {[...Array(20)].map((_, i) => (
               <FloatingElement
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                  delay={i * 0.2}
                  style={{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`
                  }}
               />
            ))}
         </div>

         {/* Left side - Login form */}
         <AnimatedDiv
            className={`w-full lg:flex-1 bg-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative ${isLoaded ? 'translate-x-0' : '-translate-x-full'
               }`}
            delay={0}
         >
            <div className="w-full max-w-md">
               {/* Mobile StackIT Logo */}
               <AnimatedDiv delay={200} className="block lg:hidden text-center mb-8">
                  <div className="text-white text-3xl font-bold hover:scale-110 transition-all duration-300 cursor-pointer bg-white/10 rounded-lg px-4 py-2 border border-white/20 inline-block"
                     style={{ backdropFilter: 'blur(8px)' }}>
                     StackIT
                  </div>
               </AnimatedDiv>

               <AnimatedDiv delay={300}>
                  <div className="text-center mb-6 sm:mb-8">
                     <div className="mb-4 sm:mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4 shadow-lg shadow-purple-500/25">
                           <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                     </div>
                     <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Welcome Back
                     </h2>
                     <p className="text-gray-400 text-sm sm:text-base">
                        Don't have an account?
                        <Link to="/Register">
                           <button className="text-purple-400 hover:text-purple-300 ml-1 underline transition-all duration-300 hover:scale-105 inline-block">
                              Sign up
                           </button>
                        </Link>
                     </p>
                  </div>
               </AnimatedDiv>

               <div>
                  <AnimatedDiv delay={500} className="space-y-4 sm:space-y-6">
                     {/* Username field */}
                     <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                           <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                           type="text"
                           placeholder="Username"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           required
                           className="w-full pl-10 pr-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700/50 focus:border-purple-500 focus:outline-none transition-all duration-300 placeholder-gray-500 focus:scale-[1.02] focus:shadow-lg focus:shadow-purple-500/25 hover:border-gray-600 hover:bg-gray-800/70 text-base"
                           style={{ backdropFilter: 'blur(8px)' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                     </div>

                     {/* Password field */}
                     <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                           <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                           type={showPassword ? "text" : "password"}
                           placeholder="Password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                           className="w-full pl-10 pr-12 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700/50 focus:border-purple-500 focus:outline-none transition-all duration-300 placeholder-gray-500 focus:scale-[1.02] focus:shadow-lg focus:shadow-purple-500/25 hover:border-gray-600 hover:bg-gray-800/70 text-base"
                           style={{ backdropFilter: 'blur(8px)' }}
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 z-10"
                        >
                           {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                     </div>

                     {/* Remember me and Forgot password */}
                     {/* <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 transition-all duration-300 hover:scale-110"
                           />
                           <span className="text-gray-400 text-sm">Remember me</span>
                        </div>
                        <button
                           type="button"
                           className="text-purple-400 hover:text-purple-300 text-sm underline transition-all duration-300 hover:scale-105"
                        >
                           Forgot password?
                        </button>
                     </div> */}

                     {/* Login button */}
                     <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 relative overflow-hidden group text-base disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        onClick={handleButtonClick}
                     >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                           {isLoading ? (
                              <>
                                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                 Signing in...
                              </>
                           ) : (
                              <>
                                 Sign in
                                 <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                              </>
                           )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                     </button>
                  </AnimatedDiv>
               </div>

               {/* Divider */}
               {/* <AnimatedDiv delay={700} className="my-8 flex items-center">
                  <div className="flex-1 border-t border-gray-700"></div>
                  <div className="mx-4 text-gray-500 text-sm">Or continue with</div>
                  <div className="flex-1 border-t border-gray-700"></div>
               </AnimatedDiv> */}

               {/* Social login buttons */}
               {/* <AnimatedDiv delay={800} className="space-y-4">
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30 text-base">
                     Continue with Google
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-white/20 hover:border-white/30 text-base">
                     Continue with Apple
                  </button>
               </AnimatedDiv> */}

               {/* Mobile hero text */}
               <AnimatedDiv delay={900} className="block lg:hidden text-center mt-8">
                  <p className="text-gray-400 text-sm">
                     Continue your creative journey with StackIT's powerful tools and features.
                  </p>
               </AnimatedDiv>
            </div>
         </AnimatedDiv>

         {/* Right side - Hero section (hidden on mobile) */}
         <AnimatedDiv
            className={`hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 overflow-hidden ${isLoaded ? 'translate-x-0' : 'translate-x-full'
               }`}
            delay={0}
         >
            {/* Dynamic background */}
            <div
               className="absolute inset-0 bg-cover bg-center opacity-80 transition-all duration-1000 ease-in-out"
               style={{ backgroundImage: backgroundImages[currentImageIndex] }}
            />

            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-900/20"
               style={{ backdropFilter: 'blur(8px)' }} />

            {/* StackIT Logo */}
            <AnimatedDiv
               className="absolute top-8 right-8 z-10"
               delay={300}
            >
               <div className="text-white text-3xl font-bold hover:scale-110 transition-all duration-300 cursor-pointer bg-white/10 rounded-lg px-4 py-2 border border-white/20"
                  style={{ backdropFilter: 'blur(8px)' }}>
                  StackIT
               </div>
            </AnimatedDiv>

            {/* Hero content */}
            <AnimatedDiv
               className="absolute bottom-16 right-8 z-10"
               delay={700}
            >
               <div className="bg-black/20 rounded-2xl p-8 border border-white/10 text-right max-w-md"
                  style={{ backdropFilter: 'blur(12px)' }}>
                  <h1 className="text-white text-4xl font-bold mb-4 leading-tight">
                     {heroTitles[currentImageIndex].split('\n').map((line, index) => (
                        <div key={index} className="overflow-hidden">
                           <span className="inline-block animate-pulse" style={{ animationDelay: `${index * 0.2}s` }}>
                              {line}
                           </span>
                        </div>
                     ))}
                  </h1>

                  <p className="text-white/80 mb-6 text-lg">
                     Continue your creative journey with StackIT's powerful tools and features.
                  </p>

                  {/* Progress indicators */}
                  <div className="flex gap-2 justify-end">
                     {backgroundImages.map((_, index) => (
                        <div
                           key={index}
                           className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${index === currentImageIndex
                              ? 'bg-white w-12 shadow-lg shadow-white/30'
                              : 'bg-white/30 w-8 hover:bg-white/50'
                              }`}
                           onClick={() => setCurrentImageIndex(index)}
                        />
                     ))}
                  </div>
               </div>
            </AnimatedDiv>
         </AnimatedDiv>
      </div>
   );
}