
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course } from '@/types/course';
import { Task } from '@/types/task';
import { User } from '@/types/user';
import AdminUsersManager from '@/components/admin/AdminUsersManager';
import AdminTasksManager from '@/components/admin/AdminTasksManager';
import AdminCoursesManager from '@/components/admin/AdminCoursesManager';
import { zipService } from '@/services/zipService';
import { userService, courseService, taskService } from '@/services/dataService';
import { toast } from 'sonner';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Strict authorization check
    const currentUser = userService.getCurrentUser();
    
    // Only users with role="admin" AND the correct email can access
    if (!currentUser || currentUser.role !== 'admin' || currentUser.email !== 'admin@hackbridge.ru') {
      toast.error('У вас нет прав доступа к этой странице');
      window.location.href = '/';
      return;
    }
    
    // Load data from local storage through our data service
    setUsers(userService.getAllUsers());
    setCourses(courseService.getAllCourses());
    setTasks(taskService.getAllTasks());
    setIsLoading(false);
  }, []);

  // Update handler for users that will be passed to AdminUsersManager
  const handleUpdateUsers = (updatedUsers: User[]) => {
    // Save updated users to localStorage
    localStorage.setItem('hackbridge_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  // Update handler for tasks
  const handleUpdateTasks = (updatedTasks: Task[]) => {
    localStorage.setItem('hackbridge_tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

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
            <AdminUsersManager users={users} setUsers={handleUpdateUsers} />
          </TabsContent>
          <TabsContent value="tasks" className="space-y-6 mt-6">
            <AdminTasksManager tasks={tasks} setTasks={handleUpdateTasks} />
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
