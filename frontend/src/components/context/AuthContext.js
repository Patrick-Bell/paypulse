import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null means loading
  const navigate = useNavigate();
  const location = useLocation();  // Get the current location

  // Define public routes where authentication is NOT required
  const publicRoutes = ['/signin', '/register', '/home'];

  const checkAuthentication = async () => {
    try {
      const response = await axios.get('/api/check-auth', { withCredentials: true });
      if (response.data.isAuthenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      //console.error('Error checking authentication', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // Only check authentication if the current path is NOT a public route
    if (!publicRoutes.includes(location.pathname)) {
      checkAuthentication();
    } else {
      setIsAuthenticated(null); // Don't check authentication on public pages
    }
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};
