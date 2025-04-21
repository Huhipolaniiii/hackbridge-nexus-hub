
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { simulateApiRequest, tasks } from '@/services/mockData';
import { Task } from '@/types/task';
import { Building, Calendar, Award, ChevronLeft, Clock, AlertTriangle, Shield } from 'lucide-react';
import { toast } from 'sonner';

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check user role
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    
    const fetchTask = async () => {
      setIsLoading(true);
      try {
        // Simulate API request
        const allTasks = await simulateApiRequest(tasks);
        // Convert id to string for comparison since params.id is a string
        const foundTask = allTasks.find(t => t.id.toString() === id);
        
        if (foundTask) {
          setTask(foundTask);
        } else {
          toast.error('Задание не найдено');
          navigate('/tasks');
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        toast.error('Ошибка при загрузке задания');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTask();
  }, [id, navigate]);

  const handleSubmitSolution = () => {
    // Check if user is logged in
    if (!userRole) {
      toast.error('Необходимо войти в аккаунт для отправки решения');
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submitting solution
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Решение отправлено на проверку');
    }, 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Лёгкая':
        return 'bg-green-500/20 text-green-500';
      case 'Средняя':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'Сложная':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Web':
        return 'bg-blue-500/20 text-blue-500';
      case 'Mobile':
        return 'bg-purple-500/20 text-purple-500';
      case 'Crypto':
        return 'bg-emerald-500/20 text-emerald-500';
      case 'OSINT':
        return 'bg-orange-500/20 text-orange-500';
      case 'Forensics':
        return 'bg-pink-500/20 text-pink-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-hack-dark rounded w-1/3"></div>
          <div className="h-72 bg-hack-dark rounded"></div>
          <div className="h-8 bg-hack-dark rounded w-1/4"></div>
          <div className="h-32 bg-hack-dark rounded"></div>
        </div>
      </MainLayout>
    );
  }

  if (!task) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Задание не найдено</h2>
          <p className="text-muted-foreground mt-2">Запрошенное задание не существует или было удалено</p>
          <Button 
            className="mt-4 bg-hack-blue hover:bg-hack-blue/80 text-black"
            onClick={() => navigate('/tasks')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Вернуться к заданиям
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        {/* Back button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 -ml-2"
          onClick={() => navigate('/tasks')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Назад к заданиям
        </Button>

        {/* Task header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary" className={getDifficultyColor(task.difficulty)}>
                {task.difficulty}
              </Badge>
              <Badge variant="secondary" className={getCategoryColor(task.category)}>
                {task.category}
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
            
            <div className="flex items-center text-muted-foreground">
              <Building className="h-4 w-4 mr-1.5" />
              <span className="font-medium text-white">{task.companyName}</span>
              <span className="mx-2">•</span>
              <Calendar className="h-4 w-4 mr-1.5" />
              <span>Опубликовано 10 дней назад</span>
            </div>
            
            <Separator className="my-4" />
            
            <div className="prose prose-invert max-w-none">
              <h2>Описание задания</h2>
              <p>{task.description}</p>
              
              <p>
                Компания {task.companyName} предлагает решить задачу по поиску уязвимостей в их веб-приложении.
                В рамках задания вам предстоит провести аудит безопасности и найти все возможные векторы атак.
              </p>
              
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 my-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-orange-500 font-medium">Важное замечание</h3>
                    <p className="text-sm mt-1">
                      Помните, что вы должны проводить тестирование только в пределах предоставленного окружения.
                      Не пытайтесь атаковать реальные системы компании.
                    </p>
                  </div>
                </div>
              </div>
              
              <h2>Требования</h2>
              <ul>
                <li>Найти и задокументировать минимум 3 критические уязвимости</li>
                <li>Подробно описать методы эксплуатации каждой уязвимости</li>
                <li>Предложить способы устранения найденных проблем</li>
                <li>Составить отчет в формате PDF или Markdown</li>
              </ul>
              
              <h2>Условия выполнения</h2>
              <p>
                Доступ к тестовому окружению будет предоставлен после принятия задания.
                Срок выполнения - 7 дней с момента принятия задания.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="hack-card p-6 space-y-4 sticky top-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Награда</h3>
                <div className="font-bold text-2xl text-hack-green">{task.reward} ₽</div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm">Срок выполнения</p>
                    <p className="font-medium">7 дней</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm">Сложность</p>
                    <p className="font-medium">{task.difficulty}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm">Категория</p>
                    <p className="font-medium">{task.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm">Компания</p>
                    <p className="font-medium">{task.companyName}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <Button
                className="w-full bg-hack-blue hover:bg-hack-blue/80 text-black"
                onClick={handleSubmitSolution}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Принять и отправить решение'}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Принимая задание, вы соглашаетесь с условиями его выполнения
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TaskDetails;
