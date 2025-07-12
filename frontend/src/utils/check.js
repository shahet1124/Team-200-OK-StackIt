/**
 * Check if user is logged in by verifying the presence and validity of auth token
 * @returns {boolean} - true if user is logged in, false otherwise
 */
export const isUserLoggedIn = () => {
  try {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      return false;
    }
    
    // Basic token format validation (JWT should have 3 parts separated by dots)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }
    
    // Check if token is expired (decode payload to check exp field)
    try {
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // If token has expiration and it's expired, return false
      if (payload.exp && payload.exp < currentTime) {
        // Token is expired, clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }
    } catch (decodeError) {
      // If we can't decode the token, consider it invalid
      console.warn('Error decoding token:', decodeError);
      return false;
    }
    
    // Parse user data to ensure it's valid JSON
    try {
      JSON.parse(user);
    } catch (parseError) {
      console.warn('Error parsing user data:', parseError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

/**
 * Get current logged in user data
 * @returns {Object|null} - user object if logged in, null otherwise
 */
export const getCurrentUser = () => {
  if (!isUserLoggedIn()) {
    return null;
  }
  
  try {
    const user = localStorage.getItem('user');
    return JSON.parse(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get authentication token
 * @returns {string|null} - token if logged in, null otherwise
 */
export const getAuthToken = () => {
  if (!isUserLoggedIn()) {
    return null;
  }
  
  return localStorage.getItem('token');
};

/**
 * Logout user by clearing localStorage and optionally redirecting
 * @param {Function} navigate - react-router navigate function (optional)
 */
export const logoutUser = (navigate = null) => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Optionally redirect to login page
    if (navigate) {
      navigate('/Login');
    }
    
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};
