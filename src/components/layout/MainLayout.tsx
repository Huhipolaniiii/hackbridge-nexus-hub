import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ShieldCheck, BookOpen, Briefcase, ShoppingCart, User, LogOut, Home, Ban } from 'lucide-react';
import Logo from '@/components/common/Logo';
import UserAvatar from '@/components/common/UserAvatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showUserCheck, setShowUserCheck] = useState(true);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    // Check login status whenever component mounts or location changes
    const storedUserRole = localStorage.getItem('userRole');
    setIsLoggedIn(!!storedUserRole);
    setUserRole(storedUserRole);
    
    // Show the check dialog only on first visit
    const hasChecked = sessionStorage.getItem('userCheckCompleted');
    if (hasChecked) {
      const wasBanned = sessionStorage.getItem('userBanned');
      if (wasBanned === 'true') {
        setIsBanned(true);
        setShowBanDialog(true);
      }
      setShowUserCheck(false);
    }
  }, [location]);
  
  const handleUserIdentityConfirm = (isNikitaPanachev: boolean) => {
    sessionStorage.setItem('userCheckCompleted', 'true');
    setShowUserCheck(false);
    
    if (isNikitaPanachev) {
      sessionStorage.setItem('userBanned', 'true');
      setIsBanned(true);
      setShowBanDialog(true);
      // Clear user data if they were logged in
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      setIsLoggedIn(false);
      navigate('/');
    }
  };

  // If user is banned, only show the ban dialog
  if (isBanned) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hack-darker">
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md bg-red-950 border-red-800">
            <DialogHeader>
              <DialogTitle className="text-red-400 flex items-center gap-2">
                <Ban className="h-5 w-5" />
                Доступ запрещен
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-center text-lg text-red-300">
                Ваш аккаунт заблокирован за нарушение правил сообщества.
              </p>
              <p className="text-center mt-2 text-red-300">
                Для получения дополнительной информации обратитесь к администратору.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Base menu items always shown
  const baseMenuItems = [
    { path: '/', label: 'Главная', icon: Home },
    { path: '/courses', label: 'Курсы', icon: BookOpen },
    { path: '/tasks', label: 'Задания', icon: Briefcase },
  ];
  
  // Auth-required menu items
  const authMenuItems = [
    { path: '/cart', label: 'Корзина', icon: ShoppingCart },
    { path: '/profile', label: 'Профиль', icon: User },
  ];
  
  // Combined menu items based on auth status
  const menuItems = isLoggedIn 
    ? [...baseMenuItems, ...authMenuItems]
    : baseMenuItems;

  return (
    <div className="min-h-screen flex flex-col bg-hack-darker">
      {/* User Identity Check Dialog */}
      <Dialog open={showUserCheck} onOpenChange={setShowUserCheck}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Проверка личности</DialogTitle>
            <DialogDescription>
              Пожалуйста, ответьте на следующий вопрос для продолжения.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 flex flex-col gap-4">
            <p className="text-center font-semibold text-lg">Вы Никита Паначёв?</p>
            <div className="flex justify-center gap-4 mt-2">
              <Button variant="destructive" onClick={() => handleUserIdentityConfirm(true)}>
                Да
              </Button>
              <Button onClick={() => handleUserIdentityConfirm(false)}>
                Нет
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Header */}
      <header className="border-b border-border/40 bg-hack-dark/90 backdrop-blur supports-[backdrop-filter]:bg-hack-dark/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden md:flex gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-hack-blue flex items-center gap-1.5",
                    isActive(item.path) ? "text-hack-blue" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <UserAvatar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-6 animate-slide-up">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-hack-dark py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <ShieldCheck className="h-5 w-5 text-hack-green" />
              <span className="text-sm text-muted-foreground">
                HackBridge — мост между обучением и реальной практикой
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HackBridge. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
