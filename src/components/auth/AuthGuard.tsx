
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    // Check if user is logged in
    const userRole = localStorage.getItem('userRole');
    
    // For admin routes, perform strict validation
    if (location.pathname === '/admin') {
      const userEmail = localStorage.getItem('userEmail');
      // Strict check - must be exact match
      const isAdmin = userRole === 'admin' && userEmail === 'admin@hackbridge.ru';
      
      if (!isAdmin && userRole) {
        toast.error('У вас нет прав доступа к панели администратора');
        setIsLoggedIn(false);
        return;
      }
    }
    
    setIsLoggedIn(!!userRole);
  }, [location]); // Re-check on location change
  
  // Still checking auth status
  if (isLoggedIn === null) {
    return <div className="min-h-screen flex items-center justify-center bg-hack-darker">Загрузка...</div>;
  }
  
  // Not logged in, redirect to login
  if (!isLoggedIn) {
    toast.error('Для доступа к этой странице необходимо войти в аккаунт');
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  
  // Logged in, render children
  return <>{children}</>;
};

export default AuthGuard;
