
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate login API request
    setTimeout(() => {
      setIsLoading(false);
      
      // Admin login check
      if (email === 'admin@hackbridge.ru' && password === 'admin123') {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userName', 'Администратор');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userBalance', '1000000');
        localStorage.setItem('userCompletedTasks', '0');
        localStorage.setItem('userRating', '0');
        localStorage.setItem('userSkills', JSON.stringify([]));
        localStorage.setItem('userPurchasedCourses', JSON.stringify([]));
        
        toast.success('Вход выполнен успешно (Администратор)');
        navigate('/');
        return;
      }
      
      // For demo, we'll assume company/hacker based on email domain
      const isCompany = email.includes('company') || email.includes('business');
      
      if (isCompany) {
        localStorage.setItem('userRole', 'company');
        localStorage.setItem('userName', 'ТехноЩит');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userBalance', '50000');
        localStorage.setItem('userCompletedTasks', '0');
        localStorage.setItem('userRating', '0');
        localStorage.setItem('userSkills', JSON.stringify([]));
        localStorage.setItem('userPurchasedCourses', JSON.stringify([]));
      } else {
        localStorage.setItem('userRole', 'hacker');
        localStorage.setItem('userName', email.split('@')[0]);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userBalance', '5000');
        localStorage.setItem('userCompletedTasks', '0');
        localStorage.setItem('userRating', '0');
        localStorage.setItem('userSkills', JSON.stringify([]));
        localStorage.setItem('userPurchasedCourses', JSON.stringify([]));
      }
      
      toast.success('Вход выполнен успешно');
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hack-darker p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-hack-blue animate-pulse-glow" />
              <span className="font-bold tracking-tighter text-2xl hack-gradient-text">
                HackBridge
              </span>
            </div>
          </div>
          <p className="text-muted-foreground mt-2">
            Мост между обучением и реальной практикой
          </p>
        </div>
        
        <Card className="hack-card">
          <CardHeader>
            <CardTitle>Вход в аккаунт</CardTitle>
            <CardDescription>
              Введите свои данные для входа в систему
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Пароль</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-hack-blue hover:text-hack-blue/80"
                  >
                    Забыли пароль?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-hack-blue hover:bg-hack-blue/80 text-black"
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </Button>
              <div className="text-center text-sm">
                Нет аккаунта?{' '}
                <Link
                  to="/register"
                  className="text-hack-blue hover:text-hack-blue/80 font-medium"
                >
                  Зарегистрироваться
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
