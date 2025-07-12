import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

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

export default function StackITRegisterPage() {
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const [isLoaded, setIsLoaded] = useState(false);
   const navigate = useNavigate();

   const API_URL = import.meta.env.VITE_API_URL;

   // Separate useState for each form field
   const [username, setUsername] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [agreeToTerms, setAgreeToTerms] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const backgroundImages = [
      `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="sky1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%23667eea;stop-opacity:1" /><stop offset="100%" style="stop-color:%23764ba2;stop-opacity:1" /></linearGradient></defs><rect width="800" height="600" fill="url(%23sky1)"/><circle cx="100" cy="100" r="2" fill="%23ffffff" opacity="0.8"/><circle cx="300" cy="80" r="1.5" fill="%23ffffff" opacity="0.6"/><circle cx="500" cy="120" r="1" fill="%23ffffff" opacity="0.7"/><path d="M0,400 Q200,300 400,350 T800,320 L800,600 L0,600 Z" fill="%23333" opacity="0.8"/><path d="M0,450 Q300,380 600,420 T800,400 L800,600 L0,600 Z" fill="%23222" opacity="0.6"/></svg>')`,

      `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="sky2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%23ff6b6b;stop-opacity:1" /><stop offset="100%" style="stop-color:%23ee5a24;stop-opacity:1" /></linearGradient></defs><rect width="800" height="600" fill="url(%23sky2)"/><path d="M0,350 Q250,250 500,300 T800,280 L800,600 L0,600 Z" fill="%23444" opacity="0.7"/><path d="M0,420 Q350,350 700,380 T800,360 L800,600 L0,600 Z" fill="%23333" opacity="0.5"/><circle cx="150" cy="120" r="80" fill="%23ffd700" opacity="0.8"/><circle cx="600" cy="80" r="2" fill="%23ffffff" opacity="0.9"/></svg>')`,

      `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="sky3" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%2300b894;stop-opacity:1" /><stop offset="100%" style="stop-color:%2300a085;stop-opacity:1" /></linearGradient></defs><rect width="800" height="600" fill="url(%23sky3)"/><path d="M0,380 Q200,280 400,320 T800,300 L800,600 L0,600 Z" fill="%23555" opacity="0.6"/><path d="M0,480 Q300,400 600,440 T800,420 L800,600 L0,600 Z" fill="%23333" opacity="0.4"/><rect x="100" y="50" width="600" height="300" fill="%23fff" opacity="0.1" rx="20"/></svg>')`,

      `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="sky4" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:%23a55eea;stop-opacity:1" /><stop offset="100%" style="stop-color:%238e44ad;stop-opacity:1" /></linearGradient></defs><rect width="800" height="600" fill="url(%23sky4)"/><path d="M0,320 Q150,220 300,260 Q450,300 600,240 T800,260 L800,600 L0,600 Z" fill="%23666" opacity="0.8"/><path d="M0,440 Q250,360 500,400 T800,380 L800,600 L0,600 Z" fill="%23444" opacity="0.6"/><polygon points="200,200 250,100 300,200" fill="%23fff" opacity="0.3"/></svg>')`
   ];

   const heroTitles = [
      "Capturing Moments,\nCreating Memories",
      "Professional Photography\nMade Simple",
      "Your Story,\nOur Passion",
      "Where Art Meets\nTechnology"
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
      if (password !== confirmPassword) {
         alert('Passwords do not match!');
         return;
      }

      if (!username || !email || !password || !agreeToTerms) {
         alert('Please fill in all required fields and agree to terms');
         return;
      }

      setIsLoading(true);

      try {
         const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               username,
               email,
               password
            })
         });

         // Check if response is ok and has content before parsing JSON
         if (response.ok) {
            // Only parse JSON if there's content
            const contentType = response.headers.get('content-type');
            let data = {};
            
            if (contentType && contentType.includes('application/json')) {
               const text = await response.text();
               if (text) {
                  data = JSON.parse(text);
               }
            }
            
            alert('Registration successful!');
            navigate('/Login');
         } else {
            // Handle error responses
            let errorMessage = 'Registration failed';
            
            try {
               const text = await response.text();
               if (text) {
                  const errorData = JSON.parse(text);
                  errorMessage = errorData.message || errorMessage;
               }
            } catch (e) {
               // If JSON parsing fails, use default message
               errorMessage = `Registration failed with status: ${response.status}`;
            }
            
            alert(errorMessage);
         }
      } catch (error) {
         console.error('Registration error:', error);
         if (error.name === 'TypeError' && error.message.includes('fetch')) {
            alert('Unable to connect to server. Please make sure the backend is running.');
         } else {
            alert('Registration failed. Please try again.');
         }
      } finally {
         setIsLoading(false);
      }
   };

   const getPasswordStrength = (password) => {
      if (!password) return { strength: 0, label: '', color: '' };

      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;

      const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
      const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

      return { strength, label: labels[strength], color: colors[strength] };
   };

   const passwordStrength = getPasswordStrength(password);

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

         {/* Left side - Hero section - HIDDEN ON MOBILE */}
         <AnimatedDiv
            className={`hidden lg:flex flex-1 relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 overflow-hidden ${isLoaded ? 'translate-x-0' : '-translate-x-full'
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
               className="absolute top-8 left-8 z-10"
               delay={300}
            >
               <div className="text-white text-3xl font-bold hover:scale-110 transition-all duration-300 cursor-pointer bg-white/10 rounded-lg px-4 py-2 border border-white/20"
                  style={{ backdropFilter: 'blur(8px)' }}>
                  StackIT
               </div>
            </AnimatedDiv>

            {/* Hero content */}
            <AnimatedDiv
               className="absolute bottom-16 left-8 z-10"
               delay={700}
            >
               <div className="bg-black/20 rounded-2xl p-8 border border-white/10"
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
                     Join thousands of creators who trust StackIT for their visual storytelling needs.
                  </p>

                  {/* Progress indicators */}
                  <div className="flex gap-2">
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

         {/* Right side - Registration form - FULL WIDTH ON MOBILE */}
         <AnimatedDiv
            className={`flex-1 lg:flex-1 w-full bg-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative ${isLoaded ? 'translate-x-0' : 'translate-x-full'
               }`}
            delay={0}
         >
            {/* Mobile Logo - Only visible on mobile */}
            <div className="absolute top-4 left-4 z-10 lg:hidden">
               <div className="text-white text-2xl font-bold bg-white/10 rounded-lg px-3 py-1 border border-white/20"
                  style={{ backdropFilter: 'blur(8px)' }}>
                  StackIT
               </div>
            </div>

            <div className="w-full max-w-md mt-12 lg:mt-0">
               <AnimatedDiv delay={300}>
                  <div className="text-center mb-6 lg:mb-8">
                     <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Create an account
                     </h2>
                     <p className="text-gray-400 text-sm sm:text-base">
                        Already have an account?
                        <Link to="/">
                           <button className="text-purple-400 hover:text-purple-300 ml-1 underline transition-all duration-300 hover:scale-105 inline-block">
                              Log in
                           </button>
                        </Link>
                     </p>
                  </div>
               </AnimatedDiv>

               <div>
                  <AnimatedDiv delay={500} className="space-y-4 sm:space-y-6">
                     {/* Username field */}
                     <div className="relative group">
                        <input
                           type="text"
                           name="username"
                           placeholder="Username"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           required
                           className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700/50 focus:border-purple-500 focus:outline-none transition-all duration-300 placeholder-gray-500 focus:scale-[1.02] focus:shadow-lg focus:shadow-purple-500/25 hover:border-gray-600 hover:bg-gray-800/70"
                           style={{ backdropFilter: 'blur(8px)' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                     </div>

                     {/* Email field */}
                     <div className="relative group">
                        <input
                           type="email"
                           name="email"
                           placeholder="Email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                           className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700/50 focus:border-purple-500 focus:outline-none transition-all duration-300 placeholder-gray-500 focus:scale-[1.02] focus:shadow-lg focus:shadow-purple-500/25 hover:border-gray-600 hover:bg-gray-800/70"
                           style={{ backdropFilter: 'blur(8px)' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                     </div>

                     {/* Password field */}
                     <div className="relative group">
                        <input
                           type={showPassword ? "text" : "password"}
                           name="password"
                           placeholder="Enter your password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                           className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700/50 focus:border-purple-500 focus:outline-none transition-all duration-300 placeholder-gray-500 pr-12 focus:scale-[1.02] focus:shadow-lg focus:shadow-purple-500/25 hover:border-gray-600 hover:bg-gray-800/70"
                           style={{ backdropFilter: 'blur(8px)' }}
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                        >
                           {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                     </div>

                     {/* Password strength indicator */}
                     {password && (
                        <AnimatedDiv className="space-y-2">
                           <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                                 <div
                                    className={`h-full transition-all duration-500 ${passwordStrength.color}`}
                                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                 />
                              </div>
                              <span className="text-sm text-gray-400">{passwordStrength.label}</span>
                           </div>
                        </AnimatedDiv>
                     )}

                     {/* Confirm Password field */}
                     <div className="relative group">
                        <input
                           type={showConfirmPassword ? "text" : "password"}
                           name="confirmPassword"
                           placeholder="Confirm your password"
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           required
                           className={`w-full px-4 py-3 bg-gray-800/50 text-white rounded-xl border transition-all duration-300 placeholder-gray-500 pr-12 focus:outline-none focus:scale-[1.02] focus:shadow-lg ${confirmPassword && password !== confirmPassword
                              ? 'border-red-500 focus:border-red-500 focus:shadow-red-500/25'
                              : 'border-gray-700/50 focus:border-purple-500 focus:shadow-purple-500/25 hover:border-gray-600 hover:bg-gray-800/70'
                              }`}
                           style={{ backdropFilter: 'blur(8px)' }}
                        />
                        <button
                           type="button"
                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                        >
                           {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                     </div>

                     {/* Password match indicator */}
                     {confirmPassword && (
                        <AnimatedDiv className="flex items-center gap-2 text-sm">
                           {password === confirmPassword ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                           ) : (
                              <XCircle className="w-4 h-4 text-red-400" />
                           )}
                           <span className={password === confirmPassword ? 'text-green-400' : 'text-red-400'}>
                              {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                           </span>
                        </AnimatedDiv>
                     )}

                     {/* Terms checkbox */}
                     <div className="flex items-start gap-3">
                        <input
                           type="checkbox"
                           name="agreeToTerms"
                           checked={agreeToTerms}
                           onChange={(e) => setAgreeToTerms(e.target.checked)}
                           required
                           className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 transition-all duration-300 hover:scale-110 mt-0.5"
                        />
                        <span className="text-gray-400 text-sm">
                           I agree to the
                           <button type="button" className="text-purple-400 hover:text-purple-300 underline ml-1 transition-all duration-300 hover:scale-105 inline-block">
                              Terms & Conditions
                           </button>
                        </span>
                     </div>

                     {/* Create account button */}
                     <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        onClick={handleButtonClick}
                     >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                           {isLoading ? 'Creating account...' : 'Create account'}
                           {!isLoading && <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                     </button>
                  </AnimatedDiv>
               </div>

               {/* Divider */}
               {/* <AnimatedDiv delay={700} className="my-6 lg:my-8 flex items-center">
                  <div className="flex-1 border-t border-gray-700"></div>
                  <div className="mx-4 text-gray-500 text-sm">Or register with</div>
                  <div className="flex-1 border-t border-gray-700"></div>
               </AnimatedDiv> */}

               {/* Social authentication buttons */}
               {/* <AnimatedDiv delay={900} className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl border border-gray-700/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-700/25 active:scale-95 text-sm sm:text-base"
                     style={{ backdropFilter: 'blur(8px)' }}>
                     <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                     </svg>
                     <span className="hidden sm:inline">Google</span>
                  </button>

                  <button className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl border border-gray-700/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-700/25 active:scale-95 text-sm sm:text-base"
                     style={{ backdropFilter: 'blur(8px)' }}>
                     <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                     </svg>
                     <span className="hidden sm:inline">Apple</span>
                  </button>
               </AnimatedDiv> */}
            </div>
         </AnimatedDiv>
      </div>
   );
}