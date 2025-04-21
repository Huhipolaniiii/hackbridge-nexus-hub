
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<'hacker' | 'company'>('hacker');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration API request
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo, we'll store user data in localStorage
      localStorage.setItem('userRole', accountType);
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      
      // Set initial values
      localStorage.setItem('userBalance', accountType === 'company' ? '50000' : '5000');
      localStorage.setItem('userCompletedTasks', '0');
      localStorage.setItem('userRating', '0');
      localStorage.setItem('userSkills', JSON.stringify([]));
      localStorage.setItem('userPurchasedCourses', JSON.stringify([]));
      
      // Initialize empty cart
      localStorage.setItem('userCart', JSON.stringify([]));
      
      toast.success('Регистрация успешно завершена');
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
            <CardTitle>Регистрация</CardTitle>
            <CardDescription>
              Создайте свой аккаунт для доступа к платформе
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя {accountType === 'company' ? 'компании' : 'пользователя'}</Label>
                <Input
                  id="name"
                  placeholder={accountType === 'company' ? "ООО Компания" : "Иван Иванов"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Тип аккаунта</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={accountType === 'hacker' ? 'default' : 'outline'}
                    className={accountType === 'hacker' ? 'bg-hack-blue hover:bg-hack-blue/80 text-black' : ''}
                    onClick={() => setAccountType('hacker')}
                  >
                    Специалист
                  </Button>
                  <Button
                    type="button"
                    variant={accountType === 'company' ? 'default' : 'outline'}
                    className={accountType === 'company' ? 'bg-hack-blue hover:bg-hack-blue/80 text-black' : ''}
                    onClick={() => setAccountType('company')}
                  >
                    Компания
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-hack-blue hover:bg-hack-blue/80 text-black"
                disabled={isLoading}
              >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
              <div className="text-center text-sm">
                Уже есть аккаунт?{' '}
                <Link
                  to="/login"
                  className="text-hack-blue hover:text-hack-blue/80 font-medium"
                >
                  Войти
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
