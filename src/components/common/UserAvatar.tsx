
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Building, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { userService } from '@/services/dataService';

const UserAvatar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'hacker' | 'company' | 'admin' | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isBanned, setIsBanned] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in using userService
    const currentUser = userService.getCurrentUser();
    
    if (currentUser) {
      setIsLoggedIn(true);
      setUserType(currentUser.role as 'hacker' | 'company' | 'admin');
      setUserName(currentUser.username || '');
      setUserEmail(currentUser.email || '');
      setIsBanned(currentUser.banned || false);
      
      // If user is banned, show warning
      if (currentUser.banned && currentUser.role !== 'admin') {
        toast.error('Ваш аккаунт заблокирован администратором', {
          duration: 5000,
          id: 'banned-account'
        });
      }
    } else {
      // Check local storage as fallback
      const userRole = localStorage.getItem('userRole');
      const storedUserName = localStorage.getItem('userName');
      const storedUserEmail = localStorage.getItem('userEmail');
      const bannedStatus = localStorage.getItem('userBanned') === 'true';
      
      if (userRole) {
        setIsLoggedIn(true);
        setUserType(userRole as 'hacker' | 'company' | 'admin');
        setIsBanned(bannedStatus);
        
        // Set user details from localStorage
        setUserName(storedUserName || '');
        setUserEmail(storedUserEmail || '');
      } else {
        setIsLoggedIn(false);
        setUserType(null);
        setUserName('');
        setUserEmail('');
        setIsBanned(false);
      }
    }
  }, []);
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    // Clear user data from localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userBalance');
    localStorage.removeItem('userCompletedTasks');
    localStorage.removeItem('userRating');
    localStorage.removeItem('userSkills');
    localStorage.removeItem('userPurchasedCourses');
    localStorage.removeItem('userCart');
    localStorage.removeItem('userBanned');
    localStorage.removeItem('userCourseProgress');
    
    // Also clear from userService
    userService.logoutUser();
    
    toast.success('Вы успешно вышли из системы');
    navigate('/');
  };
  
  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/login')}
        >
          Войти
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={() => navigate('/register')}
          className="bg-hack-blue hover:bg-hack-blue/80 text-black"
        >
          Регистрация
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Determine avatar background color based on account type
  const getAvatarClass = () => {
    if (isBanned && userType !== 'admin') return 'bg-red-900/50';
    if (userType === 'company') return 'bg-blue-900/50';
    if (userType === 'admin') return 'bg-purple-900/50';
    return 'bg-muted';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="/placeholder.svg" alt={userName} />
            <AvatarFallback className={getAvatarClass()}>
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none flex items-center gap-1.5">
              {userType === 'company' && <Building className="h-3.5 w-3.5 text-hack-blue" />}
              {userType === 'admin' && <ShieldCheck className="h-3.5 w-3.5 text-red-500" />}
              {userType === 'hacker' && <User className="h-3.5 w-3.5 text-hack-green" />}
              {userName}
              {userType === 'admin' && <span className="text-xs text-red-500 font-bold ml-1">(Админ)</span>}
              {userType === 'company' && <span className="text-xs text-hack-blue font-bold ml-1">(Компания)</span>}
              {isBanned && userType !== 'admin' && <span className="text-xs text-red-500 font-bold ml-1">(Заблокирован)</span>}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Профиль</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/profile/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Настройки</span>
        </DropdownMenuItem>
        {userType === 'company' && (
          <DropdownMenuItem onClick={() => navigate('/tasks/post')}>
            <Building className="mr-2 h-4 w-4" />
            <span>Создать задание</span>
          </DropdownMenuItem>
        )}
        {userType === 'admin' && (
          <DropdownMenuItem onClick={() => navigate('/admin')}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>Панель администратора</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
