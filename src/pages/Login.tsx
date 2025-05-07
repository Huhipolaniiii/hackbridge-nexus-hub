
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, User } from 'lucide-react';
import { userService } from '@/services/dataService';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<'hacker' | 'company'>('hacker');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = userService.loginUser(email, password);
      
      if (user) {
        toast.success('Успешный вход в систему!');
        
        // Make sure user data is stored correctly including purchased courses
        if (user.purchasedCourses && user.purchasedCourses.length > 0) {
          localStorage.setItem('userPurchasedCourses', JSON.stringify(user.purchasedCourses));
        }
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Ошибка входа в систему');
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
          <CardTitle className="text-2xl">Вход в аккаунт</CardTitle>
          <CardDescription>
            Введите ваш email и пароль для входа
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="hacker" onValueChange={(value) => setAccountType(value as 'hacker' | 'company')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="hacker" className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              Хакер
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-1.5">
              <Building className="h-4 w-4" />
              Компания
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hacker">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-hacker">Email</Label>
                  <Input 
                    id="email-hacker" 
                    type="email" 
                    placeholder="user@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-hacker">Пароль</Label>
                    <Link 
                      to="/register" 
                      className="text-xs text-hack-blue hover:underline"
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                  <Input 
                    id="password-hacker" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {/* For demonstration purposes */}
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                  <p className="text-xs text-muted-foreground">
                    <strong>Admin:</strong> admin@hackbridge.ru / admin123<br />
                    <strong>Хакер:</strong> user@example.com / user123
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-hack-blue hover:bg-hack-blue/80 text-black"
                  disabled={isLoading}
                >
                  {isLoading ? 'Вход...' : 'Войти'}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="company">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-company">Email компании</Label>
                  <Input 
                    id="email-company" 
                    type="email" 
                    placeholder="company@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-company">Пароль</Label>
                    <Link 
                      to="/register" 
                      className="text-xs text-hack-blue hover:underline"
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                  <Input 
                    id="password-company" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {/* For demonstration purposes */}
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                  <p className="text-xs text-muted-foreground">
                    <strong>Компания:</strong> company@example.com / company123
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-hack-blue hover:bg-hack-blue/80 text-black"
                  disabled={isLoading}
                >
                  {isLoading ? 'Вход...' : 'Войти'}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex flex-wrap items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span>Нет аккаунта? </span>
            <Link 
              to="/register" 
              className="text-hack-blue hover:underline"
            >
              Зарегистрироваться
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
