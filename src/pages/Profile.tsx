import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User } from '@/types/user';
import { Course } from '@/types/course';
import { Task } from '@/types/task';
import { userService, courseService, taskService } from '@/services/dataService';
import { User as UserIcon, BookOpen, Award, CreditCard, Settings } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]); // Added tasks state
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isCompanyAccount, setIsCompanyAccount] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Get current user from our data service
        const currentUser = userService.getCurrentUser();
        
        if (!currentUser) {
          // Redirect to login if not authenticated
          window.location.href = '/login';
          return;
        }
        
        setIsCompanyAccount(currentUser.role === 'company');
        setUser(currentUser);
        
        // Get purchased courses - in a real app, this would come from the user's data
        // For now, just use sample data
        setPurchasedCourses([]);
        
        // Get completed tasks - similar to above
        setCompletedTasks([]);
        
        // Get all tasks for company accounts
        if (currentUser.role === 'company') {
          setTasks(taskService.getAllTasks());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  if (isLoading || !user) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-hack-dark rounded-lg" />
          <div className="h-96 bg-hack-dark rounded-lg" />
        </div>
      </MainLayout>
    );
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        {/* Profile Header */}
        <Card className="hack-card overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-hack-dark to-hack-blue/20" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
              <Avatar className="h-24 w-24 border-4 border-hack-darker">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-hack-dark text-xl">
                  {getInitials(user.username)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left mt-4 sm:mt-0 sm:mb-2 flex-1">
                <h1 className="text-2xl font-bold">
                  {user.username}
                </h1>
                <p className="text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-2"
                  onClick={() => window.location.href = '/profile/settings'}
                >
                  <Settings className="h-4 w-4" />
                  Настройки
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Tabs */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="animate-slide-up">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Обзор
            </TabsTrigger>
            {isCompanyAccount ? (
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Мои задания
              </TabsTrigger>
            ) : (
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Курсы
              </TabsTrigger>
            )}
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              {isCompanyAccount ? 'Решённые задания' : 'Выполненные задания'}
            </TabsTrigger>
            <TabsTrigger value="finances" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Финансы
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {isCompanyAccount ? (
              <CompanyOverview user={user} />
            ) : (
              <HackerOverview user={user} />
            )}
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6">
            <Card className="hack-card">
              <CardHeader>
                <CardTitle>Мои курсы</CardTitle>
              </CardHeader>
              <CardContent>
                {purchasedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {purchasedCourses.map(course => (
                      <Card key={course.id} className="hack-card hover-scale cursor-pointer overflow-hidden">
                        <div className="flex flex-row h-32">
                          <div 
                            className="w-32 bg-cover bg-center" 
                            style={{ backgroundImage: `url(${course.imageUrl || '/placeholder.svg'})` }}
                          />
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                              <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {course.lessonsCount} уроков
                              </p>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Прогресс: 0%</p>
                              <Progress value={0} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">У вас пока нет приобретенных курсов</p>
                    <Button 
                      className="mt-4 bg-hack-blue hover:bg-hack-blue/80 text-black"
                      onClick={() => window.location.href = '/courses'}
                    >
                      Просмотреть курсы
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-6">
            <Card className="hack-card">
              <CardHeader>
                <CardTitle>Мои задания</CardTitle>
              </CardHeader>
              <CardContent>
                {isCompanyAccount ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks.filter(task => task.companyName === user?.username).length > 0 ? (
                      tasks.filter(task => task.companyName === user?.username).map(task => (
                        <Card key={task.id} className="hack-card hover-scale cursor-pointer">
                          <CardContent className="p-4">
                            <Badge className="mb-2 bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">
                              {task.category}
                            </Badge>
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {task.description}
                            </p>
                            <div className="flex justify-between items-center mt-3">
                              <Badge variant="outline">{task.status}</Badge>
                              <span className="font-bold text-hack-green">{task.reward} ₽</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-6 col-span-2">
                        <p className="text-muted-foreground">У вас пока нет созданных заданий</p>
                        <Button 
                          className="mt-4 bg-hack-blue hover:bg-hack-blue/80 text-black"
                          onClick={() => window.location.href = '/tasks/post'}
                        >
                          Создать задание
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">У вас пока нет созданных заданий</p>
                    <Button 
                      className="mt-4 bg-hack-blue hover:bg-hack-blue/80 text-black"
                      onClick={() => window.location.href = '/tasks/post'}
                    >
                      Создать задание
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            <Card className="hack-card">
              <CardHeader>
                <CardTitle>
                  {isCompanyAccount ? 'Решённые задания' : 'Выполненные задания'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedTasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completedTasks.map(task => (
                      <Card key={task.id} className="hack-card hover-scale cursor-pointer">
                        <CardContent className="p-4">
                          <Badge className="mb-2 bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">
                            {task.category}
                          </Badge>
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {task.description}
                          </p>
                          <div className="flex justify-between items-center mt-3">
                            <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                              Выполнено
                            </Badge>
                            <span className="font-bold text-hack-green">{task.reward} ₽</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      {isCompanyAccount 
                        ? 'У вас пока нет решённых заданий' 
                        : 'У вас пока нет выполненных заданий'}
                    </p>
                    <Button 
                      className="mt-4 bg-hack-blue hover:bg-hack-blue/80 text-black"
                      onClick={() => window.location.href = '/tasks'}
                    >
                      {isCompanyAccount 
                        ? 'Создать задание' 
                        : 'Просмотреть задания'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="finances" className="space-y-6">
            <Card className="hack-card">
              <CardHeader>
                <CardTitle>Финансы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="hack-card bg-hack-dark/50">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Текущий баланс</h3>
                      <p className="text-3xl font-bold text-hack-green">{user.balance} ₽</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hack-card bg-hack-dark/50">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">
                        {isCompanyAccount ? 'Выплачено' : 'Заработано'}
                      </h3>
                      <p className="text-3xl font-bold text-hack-blue">
                        0 ₽
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hack-card bg-hack-dark/50">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">
                        {isCompanyAccount ? 'Активных заданий' : 'Приобретено курсов'}
                      </h3>
                      <p className="text-3xl font-bold text-hack-blue">
                        {isCompanyAccount ? '0' : purchasedCourses.length}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <Button className="bg-hack-blue hover:bg-hack-blue/80 text-black">
                    {isCompanyAccount ? 'Пополнить баланс' : 'Вывести средства'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

const HackerOverview = ({ user }: { user: User }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <Card className="hack-card bg-hack-dark/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Рейтинг</h3>
            <p className="text-3xl font-bold text-hack-blue">{user.rating}</p>
          </CardContent>
        </Card>
        
        <Card className="hack-card bg-hack-dark/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Заработано</h3>
            <p className="text-3xl font-bold text-hack-green">{user.balance} ₽</p>
          </CardContent>
        </Card>
        
        <Card className="hack-card bg-hack-dark/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Выполнено заданий</h3>
            <p className="text-3xl font-bold text-hack-blue">{user.completedTasks}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="hack-card animate-slide-up">
        <CardHeader>
          <CardTitle>Мои навыки</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.skills && user.skills.length > 0 ? (
              user.skills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.level}/10</span>
                  </div>
                  <Progress value={skill.level * 10} className="h-2" />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">У вас пока нет навыков</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const CompanyOverview = ({ user }: { user: User }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <Card className="hack-card bg-hack-dark/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Рейтинг компании</h3>
            <p className="text-3xl font-bold text-hack-blue">{user.rating}</p>
          </CardContent>
        </Card>
        
        <Card className="hack-card bg-hack-dark/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Баланс</h3>
            <p className="text-3xl font-bold text-hack-green">{user.balance} ₽</p>
          </CardContent>
        </Card>
        
        <Card className="hack-card bg-hack-dark/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Размещено заданий</h3>
            <p className="text-3xl font-bold text-hack-blue">{user.completedTasks}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="hack-card animate-slide-up">
        <CardHeader>
          <CardTitle>Статистика</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hack-card">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Категории заданий</h3>
                <div className="text-muted-foreground text-center py-4">
                  Нет данных по категориям заданий
                </div>
              </CardContent>
            </Card>
            
            <Card className="hack-card">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Эффективность</h3>
                <div className="text-muted-foreground text-center py-4">
                  Статистика будет доступна после размещения заданий
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Profile;
