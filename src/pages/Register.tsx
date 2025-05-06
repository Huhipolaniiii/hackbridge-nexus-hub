
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { userService } from '@/services/dataService';
import { toast } from 'sonner';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('hacker');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    try {
      // Generate a unique ID
      const userId = 'user_' + Date.now().toString();
      
      const newUser = {
        id: userId,
        username,
        email,
        role: role as 'hacker' | 'company' | 'admin',
        avatarUrl: '/placeholder.svg',
        rating: 0,
        balance: 1000, // Starting balance
        completedTasks: 0,
        skills: [],
        purchasedCourses: [],
        banned: false
      };

      const success = userService.createUser(newUser);
      
      if (success) {
        // Auto login the user
        userService.loginUser(email, password);
        
        toast.success('Регистрация успешна!');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hack-darker p-4">
      <Card className="w-full max-w-md hack-card animate-scale-in">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/placeholder.svg" alt="Logo" className="h-10 w-10" />
              <span className="text-xl font-bold tracking-tight text-hack-blue">HackBridge</span>
            </Link>
          </div>
          <CardTitle className="text-2xl">Создание аккаунта</CardTitle>
          <CardDescription>
            Заполните форму для регистрации
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input 
                id="username" 
                placeholder="Имя пользователя" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="example@hackbridge.ru" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Подтверждение пароля</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Тип аккаунта</Label>
              <RadioGroup 
                defaultValue="hacker"
                value={role}
                onValueChange={setRole}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hacker" id="hacker" />
                  <Label htmlFor="hacker" className="cursor-pointer">Хакер</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="company" id="company" />
                  <Label htmlFor="company" className="cursor-pointer">Компания</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-hack-blue hover:bg-hack-blue/80 text-black mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            <span>Уже есть аккаунт? </span>
            <Link 
              to="/login" 
              className="text-hack-blue hover:underline"
            >
              Войти
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
