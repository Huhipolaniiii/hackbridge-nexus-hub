import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course } from '@/types/course';
import { Task } from '@/types/task';
import { User } from '@/types/user';
import { courses as mockCourses, tasks as mockTasks, users as mockUsers } from '@/services/mockData';
import AdminUsersManager from '@/components/admin/AdminUsersManager';
import AdminTasksManager from '@/components/admin/AdminTasksManager';
import AdminCoursesManager from '@/components/admin/AdminCoursesManager';
import { zipService } from '@/services/zipService';
import { toast } from 'sonner';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      window.location.href = '/';
      return;
    }
    setUsers(mockUsers.map(user => ({ ...user, banned: false })));
    setCourses(mockCourses);
    setTasks(mockTasks);
    setIsLoading(false);
  }, []);

  const handleDownloadProject = async () => {
    try {
      const projectData = {
        users,
        courses,
        tasks,
        exportDate: new Date().toISOString(),
        platform: 'HackBridge'
      };
      
      const success = await zipService.createProjectZip(projectData);
      if (success) {
        toast.success('Проект успешно экспортирован');
      } else {
        toast.error('Ошибка при экспорте проекта');
      }
    } catch (error) {
      toast.error('Ошибка при создании архива');
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-hack-dark rounded w-1/3"></div>
          <div className="h-72 bg-hack-dark rounded"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Панель администратора</h1>
              <p className="text-muted-foreground mt-1">
                Управление пользователями, курсами и заданиями
              </p>
            </div>
            <Button onClick={handleDownloadProject} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Экспортировать проект
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-md">
            <h3 className="font-bold flex items-center gap-2 text-yellow-500">
              <LogIn className="h-4 w-4" /> Данные для входа администратора
            </h3>
            <p className="text-sm mt-2">Email: <span className="font-mono">admin@hackbridge.ru</span></p>
            <p className="text-sm">Пароль: <span className="font-mono">admin123</span></p>
          </div>
        </div>
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="tasks">Задания</TabsTrigger>
            <TabsTrigger value="courses">Курсы</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="space-y-6 mt-6">
            <AdminUsersManager users={users} setUsers={setUsers} />
          </TabsContent>
          <TabsContent value="tasks" className="space-y-6 mt-6">
            <AdminTasksManager tasks={tasks} setTasks={setTasks} />
          </TabsContent>
          <TabsContent value="courses" className="space-y-6 mt-6">
            <AdminCoursesManager courses={courses} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminPanel;
