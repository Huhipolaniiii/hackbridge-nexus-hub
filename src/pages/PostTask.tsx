
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { AlertCircle, Info, ArrowRight } from 'lucide-react';

const PostTask = () => {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    reward: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setTaskData({ ...taskData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!taskData.title || !taskData.description || !taskData.category || !taskData.difficulty || !taskData.reward) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    if (isNaN(Number(taskData.reward)) || Number(taskData.reward) <= 0) {
      toast.error('Пожалуйста, укажите корректную сумму вознаграждения');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Задание успешно опубликовано!');
      navigate('/tasks');
    }, 1500);
  };
  
  // Check if user is a company
  const userRole = localStorage.getItem('userRole');
  if (userRole !== 'company') {
    return (
      <MainLayout>
        <div className="animate-fade-in space-y-6">
          <Card className="hack-card max-w-md mx-auto">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-hack-red/20 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-hack-red" />
                </div>
              </div>
              <CardTitle className="text-center">Доступ ограничен</CardTitle>
              <CardDescription className="text-center">
                Размещение заданий доступно только для аккаунтов компаний.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button 
                className="bg-hack-blue hover:bg-hack-blue/80 text-black"
                onClick={() => navigate('/register')}
              >
                Зарегистрировать компанию
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Разместить задание</h1>
          <p className="text-muted-foreground mt-1">
            Опубликуйте задание для поиска уязвимостей в вашем проекте
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="hack-card">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Детали задания</CardTitle>
                  <CardDescription>
                    Заполните информацию о задании, которое вы хотите разместить
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Название задания*</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Например: Поиск XSS-уязвимостей в веб-приложении"
                      value={taskData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание задания*</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Опишите подробно, что требуется сделать, какие уязвимости нужно найти, и какие ограничения существуют"
                      rows={6}
                      value={taskData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Категория*</Label>
                      <Select 
                        value={taskData.category} 
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web">Web</SelectItem>
                          <SelectItem value="Mobile">Mobile</SelectItem>
                          <SelectItem value="Crypto">Crypto</SelectItem>
                          <SelectItem value="OSINT">OSINT</SelectItem>
                          <SelectItem value="Forensics">Forensics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Сложность*</Label>
                      <Select 
                        value={taskData.difficulty} 
                        onValueChange={(value) => handleSelectChange('difficulty', value)}
                      >
                        <SelectTrigger id="difficulty">
                          <SelectValue placeholder="Выберите сложность" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Лёгкая">Лёгкая</SelectItem>
                          <SelectItem value="Средняя">Средняя</SelectItem>
                          <SelectItem value="Сложная">Сложная</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reward">Вознаграждение (₽)*</Label>
                    <Input
                      id="reward"
                      name="reward"
                      type="number"
                      placeholder="Укажите сумму вознаграждения"
                      min="1000"
                      value={taskData.reward}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    type="submit"
                    className="bg-hack-blue hover:bg-hack-blue/80 text-black gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Публикация...' : 'Опубликовать задание'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
          
          <div>
            <Card className="hack-card bg-hack-dark/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Рекомендации
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Название</h3>
                  <p className="text-sm text-muted-foreground">
                    Краткое и понятное описание сути задания. Упомяните технологию или тип поиска уязвимостей.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Описание</h3>
                  <p className="text-sm text-muted-foreground">
                    Подробно опишите цели, ограничения, сроки, типы уязвимостей и необходимую отчётность.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Вознаграждение</h3>
                  <p className="text-sm text-muted-foreground">
                    Установите справедливую сумму в зависимости от сложности задания. Для сложных заданий рекомендуется от 20 000 ₽.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostTask;
