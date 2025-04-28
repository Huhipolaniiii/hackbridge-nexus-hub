
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, AlertTriangle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { simulateApiRequest } from '@/services/mockData';

const formSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }),
  password: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
});

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, we would call an API
      await simulateApiRequest(null);
      
      // Check if this is admin login - now with strict validation
      if (values.email === 'admin@hackbridge.ru' && values.password === 'admin123') {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userName', 'Администратор');
        localStorage.setItem('userEmail', values.email);
        localStorage.setItem('userBalance', '100000');
        localStorage.setItem('userRating', '10');
        localStorage.setItem('userCompletedTasks', '0');
        localStorage.setItem('userSkills', JSON.stringify([]));
        localStorage.setItem('userPurchasedCourses', JSON.stringify([]));
        
        toast.success('Вы успешно вошли как администратор');
        navigate('/admin');
        return;
      }
      
      // If it's not a valid admin login but email contains "admin", reject
      if (values.email.includes('admin') || values.email === 'admin@hackbridge.ru') {
        toast.error('Неверные учетные данные администратора');
        setIsSubmitting(false);
        return;
      }
      
      // Mock login for regular users
      localStorage.setItem('userRole', 'hacker');
      localStorage.setItem('userName', 'Иван Иванов');
      localStorage.setItem('userEmail', values.email);
      localStorage.setItem('userBalance', '5000');
      localStorage.setItem('userRating', '4.7');
      localStorage.setItem('userCompletedTasks', '12');
      localStorage.setItem('userSkills', JSON.stringify([
        { name: 'Web Security', level: 7 },
        { name: 'Penetration Testing', level: 5 },
        { name: 'Network Security', level: 6 },
      ]));
      localStorage.setItem('userPurchasedCourses', JSON.stringify([]));
      
      toast.success('Вы успешно вошли в систему');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Ошибка при входе');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-md mx-auto pt-8 pb-16">
        <Card className="hack-card">
          <CardHeader>
            <CardTitle className="text-2xl">Вход в аккаунт</CardTitle>
            <CardDescription>
              Введите ваши данные для доступа к платформе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm mt-0">
                Данные для входа администратора:<br />
                Email: <span className="font-mono">admin@hackbridge.ru</span><br />
                Пароль: <span className="font-mono">admin123</span>
              </AlertDescription>
            </Alert>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="example@email.com" 
                          type="email" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="******" 
                          type="password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-hack-blue hover:bg-hack-blue/80 text-black"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4 animate-spin" /> 
                      Вход...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" /> 
                      Войти
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center w-full">
              <span className="text-sm text-muted-foreground">
                Еще нет аккаунта?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-hack-blue"
                  onClick={() => navigate('/register')}
                >
                  Зарегистрироваться
                </Button>
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;
