import React, { useState, useEffect } from 'react';
import { Menu, X, Home, User, Briefcase, Mail, Settings, ChevronDown, LogOut, Bell, Check, CheckCheck, Trash2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isUserLoggedIn, getCurrentUser, logoutUser } from '../utils/check.js';

const GlassNavbar = ({
   logo = "StackIt",
   logoIcon = "S",
   navItems = [],
   ctaText = "Get Started",
   onCtaClick = () => { },
   className = ""
}) => {
   const [isScrolled, setIsScrolled] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [activeDropdown, setActiveDropdown] = useState(null);
   const [isLoaded, setIsLoaded] = useState(false);
   const [currentUser, setCurrentUser] = useState(null);
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   
   // Notifications state
   const [showNotifications, setShowNotifications] = useState(false);
   const [notifications, setNotifications] = useState([]);
   const [notificationsLoading, setNotificationsLoading] = useState(false);
   const [unreadCount, setUnreadCount] = useState(0);

   const API_URL = import.meta.env.VITE_API_URL;

   useEffect(() => {
      setIsLoaded(true);
      
      // Check login status and get current user
      const checkLoginStatus = () => {
         const loginStatus = isUserLoggedIn();
         setIsLoggedIn(loginStatus);
         
         if (loginStatus) {
            const user = getCurrentUser();
            setCurrentUser(user);
         } else {
            setCurrentUser(null);
         }
      };
      
      // Initial check
      checkLoginStatus();
      
      // Set up scroll handler
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 20);
      };
      
      window.addEventListener('scroll', handleScroll);
      
      // Listen for storage changes (for when user logs in/out in another tab)
      const handleStorageChange = () => {
         checkLoginStatus();
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
         window.removeEventListener('scroll', handleScroll);
         window.removeEventListener('storage', handleStorageChange);
      };
   }, []);

   // Get auth headers with token
   const getAuthHeaders = () => {
      const token = localStorage.getItem('token');
      return {
         'ngrok-skip-browser-warning': 'true',
         'Content-Type': 'application/json',
         'Accept': 'application/json',
         'Authorization': token ? `Bearer ${token}` : ''
      };
   };

   // Fetch Notifications
   const fetchNotifications = async () => {
      if (!isLoggedIn) return;
      
      try {
         setNotificationsLoading(true);
         const response = await fetch(`${API_URL}/notifications`, {
            method: 'GET',
            headers: getAuthHeaders(),
            mode: 'cors'
         });

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const data = await response.json();
         setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
         
         // Count unread notifications
         const unread = data.notifications?.filter(notif => !notif.isRead).length || 0;
         setUnreadCount(unread);
      } catch (err) {
         console.error('Error fetching notifications:', err);
      } finally {
         setNotificationsLoading(false);
      }
   };

   // Mark notification as read
   const markAsRead = async (notificationId) => {
      if (!isLoggedIn) return;
      
      try {
         const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            mode: 'cors'
         });

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         // Update local state
         setNotifications(prev => 
            prev.map(notif => 
               notif._id === notificationId 
                  ? { ...notif, isRead: true }
                  : notif
            )
         );
         
         setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
         console.error('Error marking notification as read:', err);
      }
   };

   // Mark all notifications as read
   const markAllAsRead = async () => {
      if (!isLoggedIn) return;
      
      try {
         const response = await fetch(`${API_URL}/notifications/read-all`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            mode: 'cors'
         });

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         // Update local state
         setNotifications(prev => 
            prev.map(notif => ({ ...notif, isRead: true }))
         );
         setUnreadCount(0);
      } catch (err) {
         console.error('Error marking all notifications as read:', err);
      }
   };

   // Delete notification
   const deleteNotification = async (notificationId) => {
      if (!isLoggedIn) return;
      
      try {
         const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            mode: 'cors'
         });

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         // Update local state
         const deletedNotif = notifications.find(n => n._id === notificationId);
         setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
         
         if (deletedNotif && !deletedNotif.isRead) {
            setUnreadCount(prev => Math.max(0, prev - 1));
         }
      } catch (err) {
         console.error('Error deleting notification:', err);
      }
   };

   // Fetch notifications when user logs in
   useEffect(() => {
      if (isLoggedIn) {
         fetchNotifications();
      } else {
         setNotifications([]);
         setUnreadCount(0);
      }
   }, [isLoggedIn]);

   // Close notifications dropdown when clicking outside
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (showNotifications && !event.target.closest('.notifications-dropdown')) {
            setShowNotifications(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [showNotifications]);

   // Default nav items - only Home
   const defaultNavItems = [
      { name: 'Home', icon: Home, href: '#home' }
   ];

   const menuItems = navItems.length > 0 ? navItems : defaultNavItems;

   const handleDropdownToggle = (index) => {
      setActiveDropdown(activeDropdown === index ? null : index);
   };

   const handleNavClick = (item) => {
      if (item.onClick) {
         item.onClick();
      }
      setIsMobileMenuOpen(false);
   };

   const handleLogout = () => {
      logoutUser();
      setIsLoggedIn(false);
      setCurrentUser(null);
      setIsMobileMenuOpen(false);
   };

   return (
      <nav
         className={`fixed top-3 left-3 right-3 z-50 transition-all duration-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            } ${isScrolled ? 'backdrop-blur-md bg-white/10' : 'backdrop-blur-sm bg-white/5'} ${className}`}
         style={{
            borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
            boxShadow: isScrolled ? '0 8px 32px rgba(0, 0, 0, 0.3)' : 'none',
            borderRadius: '15px 15px 15px 15px'
         }}
      >
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
               {/* Logo */}
               <div className={`flex items-center space-x-2 transition-all duration-700 delay-200 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                  }`}>
                  <div
                     className="w-8 h-8 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 cursor-pointer"
                     style={{
                        background: 'linear-gradient(135deg, #0bab7d, #c9f5c4)',
                        borderRadius: '5px'
                     }}
                  >
                     <span className="text-white font-bold text-lg">{logoIcon}</span>
                  </div>
                  <span className="text-white font-bold text-xl hover:text-emerald-300 transition-colors duration-300 cursor-pointer">
                     {logo}
                  </span>
               </div>

               {/* Desktop Navigation - Hidden since only Home */}

               {/* CTA Button or User Info */}
               <div className={`hidden md:flex items-center space-x-4 transition-all duration-700 delay-500 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                  }`}>
                  {isLoggedIn && currentUser ? (
                     <div className="flex items-center space-x-3">
                        {/* Notifications Bell */}
                        <div className="relative notifications-dropdown">
                           <button
                              onClick={() => setShowNotifications(!showNotifications)}
                              className="relative p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                              title="Notifications"
                           >
                              <Bell size={20} className="text-white" />
                              {unreadCount > 0 && (
                                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                 </span>
                              )}
                           </button>

                           {/* Notifications Dropdown */}
                           {showNotifications && (
                              <div className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
                                 {/* Header */}
                                 <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                    <h3 className="text-white font-semibold">Notifications</h3>
                                    {unreadCount > 0 && (
                                       <button
                                          onClick={markAllAsRead}
                                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center space-x-1"
                                       >
                                          <CheckCheck size={14} />
                                          <span>Mark all read</span>
                                       </button>
                                    )}
                                 </div>

                                 {/* Notifications List */}
                                 <div className="max-h-64 overflow-y-auto">
                                    {notificationsLoading ? (
                                       <div className="p-4 text-center">
                                          <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                                          <p className="text-gray-400 text-sm mt-2">Loading...</p>
                                       </div>
                                    ) : notifications.length === 0 ? (
                                       <div className="p-4 text-center">
                                          <Bell className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                          <p className="text-gray-400 text-sm">No notifications</p>
                                       </div>
                                    ) : (
                                       notifications.slice(0, 10).map((notification) => (
                                          <div
                                             key={notification._id}
                                             className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors duration-200 ${
                                                !notification.isRead ? 'bg-blue-500/5' : ''
                                             }`}
                                          >
                                             <div className="flex items-start justify-between space-x-2">
                                                <div className="flex-1 min-w-0">
                                                   <div className="flex items-center space-x-2 mb-1">
                                                      {!notification.isRead && (
                                                         <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                      )}
                                                      <h4 className="text-white text-sm font-medium truncate">
                                                         {notification.title || 'Notification'}
                                                      </h4>
                                                   </div>
                                                   <p className="text-gray-300 text-xs leading-tight mb-2 line-clamp-2">
                                                      {notification.message || notification.content || 'No message'}
                                                   </p>
                                                   <div className="flex items-center space-x-3 text-xs text-gray-400">
                                                      <div className="flex items-center space-x-1">
                                                         <Clock size={10} />
                                                         <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                                                      </div>
                                                      {notification.type && (
                                                         <span className="bg-blue-500/20 px-2 py-0.5 rounded-full">
                                                            {notification.type}
                                                         </span>
                                                      )}
                                                   </div>
                                                </div>
                                                <div className="flex flex-col space-y-1">
                                                   {!notification.isRead && (
                                                      <button
                                                         onClick={() => markAsRead(notification._id)}
                                                         className="p-1 bg-green-500/20 backdrop-blur-lg border border-green-500/30 rounded hover:bg-green-500/30 transition-all duration-200"
                                                         title="Mark as read"
                                                      >
                                                         <Check size={12} className="text-green-400" />
                                                      </button>
                                                   )}
                                                   <button
                                                      onClick={() => deleteNotification(notification._id)}
                                                      className="p-1 bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded hover:bg-red-500/30 transition-all duration-200"
                                                      title="Delete"
                                                   >
                                                      <Trash2 size={12} className="text-red-400" />
                                                   </button>
                                                </div>
                                             </div>
                                          </div>
                                       ))
                                    )}
                                 </div>

                                 {/* Footer */}
                                 {notifications.length > 0 && (
                                    <div className="p-3 border-t border-white/10">
                                       <button
                                          onClick={() => {
                                             setShowNotifications(false);
                                             // You can add navigation to full notifications page here
                                          }}
                                          className="w-full text-center text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
                                       >
                                          View all notifications
                                       </button>
                                    </div>
                                 )}
                              </div>
                           )}
                        </div>

                        <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                           <User size={20} className="text-emerald-300" />
                           <span className="text-white font-medium">
                              {currentUser.username || currentUser.name || 'User'}
                           </span>
                        </div>
                        <button
                           onClick={handleLogout}
                           className="flex items-center space-x-2 px-4 py-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 transform bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 border border-red-500/30 rounded-lg"
                           title="Logout"
                        >
                           <LogOut size={18} />
                           <span>Logout</span>
                        </button>
                     </div>
                  ) : (
                     <Link to="/login">
                        <button
                           onClick={onCtaClick}
                           className="px-6 py-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-1 active:scale-95 transform"
                           style={{
                              background: 'linear-gradient(135deg, #0bab7d, #c9f5c4)',
                              color: '#111827',
                              borderRadius: '5px'
                           }}
                           onMouseEnter={(e) => {
                              e.target.style.background = 'linear-gradient(135deg, #0bab7d, #c9f5c4, #bfb5fe)';
                           }}
                           onMouseLeave={(e) => {
                              e.target.style.background = 'linear-gradient(135deg, #0bab7d, #c9f5c4)';
                           }}
                        >
                           Login
                        </button>
                     </Link>
                  )}
               </div>

               {/* Mobile Menu Button */}
               <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`md:hidden p-2 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95 transform ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                     } delay-500`}
                  style={{ borderRadius: '5px' }}
               >
                  <div className="relative">
                     <div className={`transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}>
                        <Menu size={24} color="#ffffff" />
                     </div>
                     <div className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}>
                        <X size={24} color="#ffffff" />
                     </div>
                  </div>
               </button>
            </div>
         </div>

         {/* Mobile Menu */}
         <div className={`md:hidden backdrop-blur-md bg-white/10 border-t border-white/20 overflow-hidden transition-all duration-500 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
            <div className="px-4 py-2 space-y-1">
               {menuItems.map((item, index) => (
                  <div
                     key={index}
                     className={`transition-all duration-500 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                        }`}
                     style={{ transitionDelay: `${index * 100}ms` }}
                  >
                     <button
                        onClick={() => {
                           if (item.dropdown) {
                              handleDropdownToggle(index);
                           } else {
                              handleNavClick(item);
                           }
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-white/10 hover:text-emerald-300 transition-all duration-300 hover:scale-105 hover:translate-x-2 active:scale-95 transform"
                        style={{ borderRadius: '5px' }}
                     >
                        <item.icon size={20} className="transition-transform duration-300 hover:scale-110" />
                        <span className="font-medium">{item.name}</span>
                        {item.dropdown && (
                           <ChevronDown
                              size={16}
                              className={`ml-auto transform transition-all duration-300 ${activeDropdown === index ? 'rotate-180 text-emerald-300' : ''
                                 }`}
                           />
                        )}
                     </button>

                     {item.dropdown && (
                        <div className={`ml-8 mt-2 space-y-1 transition-all duration-300 ${activeDropdown === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                           }`}>
                           {item.dropdown.map((dropItem, dropIndex) => (
                              <button
                                 key={dropIndex}
                                 onClick={() => {
                                    if (typeof dropItem === 'object' && dropItem.onClick) {
                                       dropItem.onClick();
                                    }
                                    setActiveDropdown(null);
                                    setIsMobileMenuOpen(false);
                                 }}
                                 className={`w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300 hover:scale-105 hover:translate-x-2 transform ${activeDropdown === index ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
                                    }`}
                                 style={{
                                    borderRadius: '5px',
                                    transitionDelay: `${dropIndex * 50}ms`
                                 }}
                              >
                                 {typeof dropItem === 'string' ? dropItem : dropItem.name}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>
               ))}

               <div className={`pt-4 border-t border-white/20 transition-all duration-700 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`} style={{ transitionDelay: '400ms' }}>
                  {isLoggedIn && currentUser ? (
                     <div className="space-y-3">
                        {/* Notifications Button for Mobile */}
                        <button
                           onClick={() => {
                              setShowNotifications(!showNotifications);
                           }}
                           className="w-full flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                           <div className="flex items-center space-x-3">
                              <Bell size={20} className="text-white" />
                              <span className="text-white font-medium">Notifications</span>
                           </div>
                           {unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                 {unreadCount > 99 ? '99+' : unreadCount}
                              </span>
                           )}
                        </button>

                        {/* Mobile Notifications List */}
                        {showNotifications && (
                           <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-lg max-h-60 overflow-y-auto">
                              {notificationsLoading ? (
                                 <div className="p-4 text-center">
                                    <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                                    <p className="text-gray-400 text-sm mt-2">Loading...</p>
                                 </div>
                              ) : notifications.length === 0 ? (
                                 <div className="p-4 text-center">
                                    <Bell className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                    <p className="text-gray-400 text-sm">No notifications</p>
                                 </div>
                              ) : (
                                 <>
                                    {unreadCount > 0 && (
                                       <div className="p-2 border-b border-white/10">
                                          <button
                                             onClick={markAllAsRead}
                                             className="w-full text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center justify-center space-x-1"
                                          >
                                             <CheckCheck size={14} />
                                             <span>Mark all read</span>
                                          </button>
                                       </div>
                                    )}
                                    {notifications.slice(0, 5).map((notification) => (
                                       <div
                                          key={notification._id}
                                          className={`p-3 border-b border-white/5 ${
                                             !notification.isRead ? 'bg-blue-500/5' : ''
                                          }`}
                                       >
                                          <div className="flex items-start justify-between space-x-2">
                                             <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-1">
                                                   {!notification.isRead && (
                                                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                   )}
                                                   <h4 className="text-white text-sm font-medium truncate">
                                                      {notification.title || 'Notification'}
                                                   </h4>
                                                </div>
                                                <p className="text-gray-300 text-xs leading-tight mb-2">
                                                   {notification.message || notification.content || 'No message'}
                                                </p>
                                                <div className="text-xs text-gray-400">
                                                   {new Date(notification.createdAt).toLocaleDateString()}
                                                </div>
                                             </div>
                                             <div className="flex space-x-1">
                                                {!notification.isRead && (
                                                   <button
                                                      onClick={() => markAsRead(notification._id)}
                                                      className="p-1 bg-green-500/20 rounded"
                                                      title="Mark as read"
                                                   >
                                                      <Check size={12} className="text-green-400" />
                                                   </button>
                                                )}
                                                <button
                                                   onClick={() => deleteNotification(notification._id)}
                                                   className="p-1 bg-red-500/20 rounded"
                                                   title="Delete"
                                                >
                                                   <Trash2 size={12} className="text-red-400" />
                                                </button>
                                             </div>
                                          </div>
                                       </div>
                                    ))}
                                 </>
                              )}
                           </div>
                        )}

                        <div className="flex items-center space-x-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                           <User size={20} className="text-emerald-300" />
                           <span className="text-white font-medium">
                              {currentUser.username || currentUser.name || 'User'}
                           </span>
                        </div>
                        <button
                           onClick={handleLogout}
                           className="w-full flex items-center justify-center space-x-2 px-4 py-3 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 transform bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 border border-red-500/30 rounded-lg"
                        >
                           <LogOut size={18} />
                           <span>Logout</span>
                        </button>
                     </div>
                  ) : (
                     <button
                        onClick={() => {
                           onCtaClick();
                           setIsMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 transform"
                        style={{
                           background: 'linear-gradient(135deg, #0bab7d, #c9f5c4)',
                           color: '#111827',
                           borderRadius: '5px'
                        }}
                     >
                        {ctaText}
                     </button>
                  )}
               </div>
            </div>
         </div>
      </nav>
   );
};

export default GlassNavbar;