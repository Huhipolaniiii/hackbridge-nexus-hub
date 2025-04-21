
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { simulateApiRequest, courses } from '@/services/mockData';
import { Course } from '@/types/course';
import { ShoppingCart, BookOpen, Clock, User, CheckCircle, Star, Play, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        // Simulate API request
        const allCourses = await simulateApiRequest(courses);
        const foundCourse = allCourses.find(c => c.id === id);
        
        if (foundCourse) {
          setCourse(foundCourse);
        } else {
          toast.error('Курс не найден');
          navigate('/courses');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Ошибка при загрузке курса');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourse();
  }, [id, navigate]);

  const handleAddToCart = () => {
    // Check if user is logged in
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      toast.error('Необходимо войти в аккаунт для добавления курса в корзину');
      navigate('/login');
      return;
    }
    
    setIsAddingToCart(true);
    
    // Get existing cart from localStorage
    const cartString = localStorage.getItem('userCart');
    let cart = cartString ? JSON.parse(cartString) : [];
    
    // Check if course is already in cart
    const isInCart = course && cart.some((item: any) => item.id === course.id);
    
    if (isInCart) {
      toast.info('Этот курс уже в корзине');
      setIsAddingToCart(false);
      return;
    }
    
    // Add course to cart
    if (course) {
      cart.push({
        id: course.id,
        title: course.title,
        price: course.price,
        type: 'course',
        imageUrl: course.imageUrl
      });
      
      // Save updated cart
      localStorage.setItem('userCart', JSON.stringify(cart));
      
      // Show success message
      setTimeout(() => {
        setIsAddingToCart(false);
        toast.success('Курс добавлен в корзину');
      }, 500);
    }
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

  const mockLessons = [
    { id: 1, title: 'Введение в курс', duration: '15 мин', isLocked: false },
    { id: 2, title: 'Основы уязвимостей веб-приложений', duration: '45 мин', isLocked: true },
    { id: 3, title: 'SQL-инъекции: теория', duration: '30 мин', isLocked: true },
    { id: 4, title: 'SQL-инъекции: практика', duration: '60 мин', isLocked: true },
    { id: 5, title: 'XSS-атаки', duration: '40 мин', isLocked: true },
    { id: 6, title: 'CSRF и способы защиты', duration: '35 мин', isLocked: true },
  ];

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

  if (!course) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Курс не найден</h2>
          <p className="text-muted-foreground mt-2">Запрошенный курс не существует или был удален</p>
          <Button 
            className="mt-4 bg-hack-blue hover:bg-hack-blue/80 text-black"
            onClick={() => navigate('/courses')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Вернуться к курсам
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Use a default duration if not provided in the course object
  const courseDuration = "6 часов";

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        {/* Back button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 -ml-2"
          onClick={() => navigate('/courses')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Назад к курсам
        </Button>

        {/* Course header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
            
            <div className="flex flex-wrap gap-3 mt-4">
              <Badge variant="secondary" className={getDifficultyColor(course.difficulty)}>
                {course.difficulty}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {course.lessonsCount} уроков
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {courseDuration}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {course.studentsCount || 0} студентов
              </Badge>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="hack-card p-6 space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-hack-dark mb-4">
                <img 
                  src={course.imageUrl} 
                  alt={course.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                    />
                  ))}
                  <span className="text-sm ml-1">4.0 (24 отзыва)</span>
                </div>
                <p className="font-bold text-xl">{course.price} ₽</p>
              </div>
              
              <div className="pt-2">
                <Button 
                  className="w-full bg-hack-blue hover:bg-hack-blue/80 text-black gap-2"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isAddingToCart ? 'Добавление...' : 'Добавить в корзину'}
                </Button>
              </div>
              
              <div className="pt-2">
                <h4 className="font-medium mb-2">Курс включает:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>{course.lessonsCount} видеоуроков</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Практические задания</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Доступ навсегда</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Сертификат о прохождении</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course content */}
        <Tabs 
          defaultValue="overview" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mt-8"
        >
          <TabsList className="w-full sm:w-auto grid sm:inline-grid grid-cols-3 sm:grid-cols-none">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="content">Содержание</TabsTrigger>
            <TabsTrigger value="reviews">Отзывы</TabsTrigger>
          </TabsList>
          
          <Separator className="my-6" />
          
          <TabsContent value="overview" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">О курсе</h3>
              <p>
                В этом курсе вы изучите основные принципы тестирования на проникновение веб-приложений.
                Вы научитесь находить и эксплуатировать наиболее распространенные уязвимости, такие как
                SQL-инъекции, XSS, CSRF и другие из списка OWASP Top 10.
              </p>
              <p className="mt-4">
                Курс сочетает теоретические знания с практическими лабораторными работами, что
                позволит вам закрепить полученные навыки на реальных примерах.
              </p>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Чему вы научитесь</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-hack-green shrink-0 mt-0.5" />
                  <span>Идентифицировать распространенные уязвимости веб-приложений</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-hack-green shrink-0 mt-0.5" />
                  <span>Использовать инструменты для тестирования на проникновение</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-hack-green shrink-0 mt-0.5" />
                  <span>Эксплуатировать уязвимости SQL-инъекций</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-hack-green shrink-0 mt-0.5" />
                  <span>Проводить атаки XSS и CSRF</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-hack-green shrink-0 mt-0.5" />
                  <span>Разрабатывать стратегии для защиты от веб-атак</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-hack-green shrink-0 mt-0.5" />
                  <span>Составлять отчеты о тестировании безопасности</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Для кого этот курс</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-hack-green shrink-0 mt-0.5" />
                  <span>Начинающие специалисты по безопасности</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-hack-green shrink-0 mt-0.5" />
                  <span>Веб-разработчики, желающие улучшить навыки безопасного программирования</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-hack-green shrink-0 mt-0.5" />
                  <span>IT-специалисты, интересующиеся кибербезопасностью</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Требования</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-hack-blue shrink-0 mt-0.5" />
                  <span>Базовое понимание HTML, CSS и JavaScript</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-hack-blue shrink-0 mt-0.5" />
                  <span>Основы работы с базами данных SQL</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-hack-blue shrink-0 mt-0.5" />
                  <span>Базовые знания сетевых протоколов (HTTP)</span>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Содержание курса</h3>
              <p className="text-muted-foreground mb-6">
                {course.lessonsCount} уроков • {courseDuration} общей продолжительности
              </p>
              
              <div className="space-y-4">
                {mockLessons.map((lesson, index) => (
                  <div 
                    key={lesson.id}
                    className="hack-card p-4 hover:bg-hack-dark/50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-hack-dark mr-3 text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{lesson.title}</h4>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                            {lesson.duration}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        {lesson.isLocked ? (
                          <Badge variant="outline" className="text-muted-foreground">
                            Заблокировано
                          </Badge>
                        ) : (
                          <Button size="sm" variant="ghost" className="gap-1">
                            <Play className="h-4 w-4" />
                            Смотреть
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Отзывы студентов</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="hack-card p-6">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center gap-1 mr-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= 5 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">2 недели назад</span>
                  </div>
                  <h4 className="font-medium">Александр В.</h4>
                  <p className="mt-2 text-sm">
                    Очень информативный курс с отличными практическими примерами. Рекомендую всем, кто хочет углубиться в тестирование на проникновение!
                  </p>
                </div>
                
                <div className="hack-card p-6">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center gap-1 mr-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">1 месяц назад</span>
                  </div>
                  <h4 className="font-medium">Мария С.</h4>
                  <p className="mt-2 text-sm">
                    Сначала было сложно, но благодаря подробным объяснениям, удалось разобраться во всех темах. Материал актуальный и хорошо структурирован.
                  </p>
                </div>
                
                <div className="hack-card p-6">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center gap-1 mr-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= 3 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">2 месяца назад</span>
                  </div>
                  <h4 className="font-medium">Дмитрий П.</h4>
                  <p className="mt-2 text-sm">
                    Хороший курс, но некоторые темы могли бы быть разобраны более подробно. В целом, полезно для начинающих.
                  </p>
                </div>
                
                <div className="hack-card p-6">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center gap-1 mr-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= 5 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">3 месяца назад</span>
                  </div>
                  <h4 className="font-medium">Анна К.</h4>
                  <p className="mt-2 text-sm">
                    Превосходный курс! Особенно понравились практические задания и лабораторные работы. Полученные знания сразу же применила на практике.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CourseDetails;
