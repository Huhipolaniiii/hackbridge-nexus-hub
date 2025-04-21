
import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const userRole = localStorage.getItem('userRole');
    setIsLoggedIn(!!userRole);
  }, []);
  
  // Still checking auth status
  if (isLoggedIn === null) {
    return <div className="min-h-screen flex items-center justify-center bg-hack-darker">Загрузка...</div>;
  }
  
  // Not logged in, redirect to login
  if (!isLoggedIn) {
    toast.error('Для доступа к этой странице необходимо войти в аккаунт');
    return <Navigate to="/login" replace />;
  }
  
  // Logged in, render children
  return <>{children}</>;
};

export default AuthGuard;
