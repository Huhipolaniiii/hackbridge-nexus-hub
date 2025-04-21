
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ShieldCheck, BookOpen, Briefcase, ShoppingCart, User, LogOut, Home } from 'lucide-react';
import Logo from '@/components/common/Logo';
import UserAvatar from '@/components/common/UserAvatar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/', label: 'Главная', icon: Home },
    { path: '/courses', label: 'Курсы', icon: BookOpen },
    { path: '/tasks', label: 'Задания', icon: Briefcase },
    { path: '/cart', label: 'Корзина', icon: ShoppingCart },
    { path: '/profile', label: 'Профиль', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-hack-darker">
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
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>
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
