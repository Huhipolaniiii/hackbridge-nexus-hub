
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Search, BookOpen, Briefcase, TrendingUp, ChevronRight } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import CourseCard from '@/components/courses/CourseCard';
import TaskCard from '@/components/tasks/TaskCard';
import { simulateApiRequest, courses, tasks } from '@/services/mockData';
import { Course } from '@/types/course';
import { Task } from '@/types/task';

const Index = () => {
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // In a real app, we would fetch data from an API
      const coursesData = await simulateApiRequest(courses.slice(0, 3));
      const tasksData = await simulateApiRequest(tasks.slice(0, 3));
      
      setPopularCourses(coursesData);
      setRecentTasks(tasksData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 hack-gradient-text">
            HackBridge — мост между обучением и реальной практикой
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Изучайте кибербезопасность, решайте реальные задачи от компаний, 
            зарабатывайте и становитесь профессионалом в сфере информационной безопасности.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-hack-blue hover:bg-hack-blue/80 text-black gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Начать обучение
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="gap-2"
            >
              <Briefcase className="h-5 w-5" />
              Найти задания
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Что вы найдете на HackBridge</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hack-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-hack-blue/20 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-hack-blue" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Курсы по кибербезопасности</h3>
                <p className="text-muted-foreground">
                  Изучайте XSS, SQLi, LFI, RCE и другие уязвимости с практическими заданиями для закрепления знаний.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hack-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-hack-green/20 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-hack-green" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Реальные задания от компаний</h3>
                <p className="text-muted-foreground">
                  Решайте задачи от компаний, находите уязвимости и получайте вознаграждение за свою работу.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hack-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-hack-purple/20 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-hack-purple" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Развитие карьеры</h3>
                <p className="text-muted-foreground">
                  Повышайте репутацию, накапливайте опыт и получайте новые возможности в сфере информационной безопасности.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Courses & Tasks Section */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Исследуйте платформу</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Поиск курсов и заданий..." 
              className="pl-9 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="courses">
          <TabsList className="mb-6">
            <TabsTrigger value="courses" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Популярные курсы
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Новые задания
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-80 animate-pulse">
                    <div className="h-full bg-muted/50"></div>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {popularCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => window.location.href = '/courses'}
                  >
                    Посмотреть все курсы
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-80 animate-pulse">
                    <div className="h-full bg-muted/50"></div>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recentTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
                <div className="flex justify-center mt-8">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => window.location.href = '/tasks'}
                  >
                    Посмотреть все задания
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 mt-8">
        <Card className="hack-card overflow-hidden">
          <CardContent className="p-8 md:p-12 flex flex-col items-center text-center">
            <Shield className="h-16 w-16 text-hack-green mb-6" />
            <h2 className="text-3xl font-bold mb-4">Готовы начать путь в кибербезопасности?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Регистрируйтесь, изучайте курсы, решайте задания и становитесь востребованным специалистом по информационной безопасности.
            </p>
            <Button 
              size="lg" 
              className="bg-hack-green hover:bg-hack-green/80 text-black"
            >
              Зарегистрироваться и начать
            </Button>
          </CardContent>
        </Card>
      </section>
    </MainLayout>
  );
};

export default Index;
