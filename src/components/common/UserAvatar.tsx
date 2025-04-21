
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
import { User, LogOut, Settings, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const UserAvatar = () => {
  // In a real app, this would come from auth context
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'hacker' | 'company' | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check local storage for user login status
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      setIsLoggedIn(true);
      setUserType(userRole as 'hacker' | 'company');
      
      // Set mock user details based on role
      if (userRole === 'company') {
        setUserName('ТехноЩит');
        setUserEmail('info@techshield.ru');
      } else {
        setUserName('Алексей Иванов');
        setUserEmail('ivanov@example.com');
      }
    }
  }, []);
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    localStorage.removeItem('userRole');
    toast.success('Вы успешно вышли из системы');
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="/placeholder.svg" alt={userName} />
            <AvatarFallback className="bg-muted">
              {userType === 'company' ? 'ТЩ' : 'АИ'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none flex items-center gap-1.5">
              {userType === 'company' && <Building className="h-3.5 w-3.5" />}
              {userName}
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
