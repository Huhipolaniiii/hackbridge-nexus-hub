
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShieldCheck, User, Building } from 'lucide-react';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'hacker' | 'company'>('hacker');
  
  // Hacker form state
  const [hackerData, setHackerData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // Company form state
  const [companyData, setCompanyData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    website: '',
    description: '',
  });
  
  const handleHackerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHackerData({ ...hackerData, [name]: value });
  };
  
  const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };
  
  const handleHackerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (hackerData.password !== hackerData.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    
    if (!hackerData.username || !hackerData.email || !hackerData.password) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      // Save user info in localStorage for demo
      localStorage.setItem('userRole', 'hacker');
      localStorage.setItem('userName', hackerData.username);
      localStorage.setItem('userEmail', hackerData.email);
      
      toast.success('Регистрация успешно завершена!');
      navigate('/');
    }, 1000);
  };
  
  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (companyData.password !== companyData.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    
    if (!companyData.companyName || !companyData.email || !companyData.password) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      // Save user info in localStorage for demo
      localStorage.setItem('userRole', 'company');
      localStorage.setItem('userName', companyData.companyName);
      localStorage.setItem('userEmail', companyData.email);
      
      toast.success('Регистрация компании успешно завершена!');
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hack-darker p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
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
        
        <Card className="hack-card animate-scale-in">
          <CardHeader>
            <CardTitle>Регистрация</CardTitle>
            <CardDescription>
              Выберите тип аккаунта и заполните информацию для регистрации
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="hacker" onValueChange={(value) => setUserType(value as 'hacker' | 'company')}>
            <TabsList className="grid w-full grid-cols-2 mx-auto px-4 mb-4">
              <TabsTrigger value="hacker" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Хакер
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Компания
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="hacker">
              <form onSubmit={handleHackerSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Имя пользователя</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="hackerman"
                      value={hackerData.username}
                      onChange={handleHackerInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@mail.ru"
                      value={hackerData.email}
                      onChange={handleHackerInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={hackerData.password}
                      onChange={handleHackerInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={hackerData.confirmPassword}
                      onChange={handleHackerInputChange}
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
            </TabsContent>
            
            <TabsContent value="company">
              <form onSubmit={handleCompanySubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Название компании</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="ООО Кибер Защита"
                      value={companyData.companyName}
                      onChange={handleCompanyInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email компании</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="company@example.com"
                      value={companyData.email}
                      onChange={handleCompanyInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Веб-сайт</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="https://example.com"
                      value={companyData.website}
                      onChange={handleCompanyInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание компании</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Краткое описание вашей компании..."
                      value={companyData.description}
                      onChange={handleCompanyInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={companyData.password}
                      onChange={handleCompanyInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={companyData.confirmPassword}
                      onChange={handleCompanyInputChange}
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
                    {isLoading ? 'Регистрация...' : 'Зарегистрировать компанию'}
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
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Register;
