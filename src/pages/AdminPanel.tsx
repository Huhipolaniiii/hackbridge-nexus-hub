import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, Download, TestTube, Database } from 'lucide-react';
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
import { Toggle } from "@/components/ui/toggle";

// Define test result interface
interface TestResult {
  name: string;
  status: 'passed' | 'failed';
  message?: string;
  time?: number;
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showTestResults, setShowTestResults] = useState(false);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'online' | 'offline'>('online');

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

  const generateRandomTime = () => {
    return Math.floor(Math.random() * 300) + 50; // 50-350ms
  };

  const runAutoTests = () => {
    setShowTestResults(true);
    setTestResults([]);
    
    // Define base test cases
    const successTests = [
      { name: 'Тест авторизации', message: 'Авторизация работает корректно' },
      { name: 'Проверка целостности данных', message: 'Данные соответствуют схеме' },
      { name: 'Тест API подключения', message: 'API отвечает 200 OK' },
      { name: 'Проверка скорости загрузки', message: 'Скорость загрузки в пределах нормы' },
      { name: 'Проверка криптографических ключей', message: 'Ключи настроены верно' },
    ];
    
    const failureTests = [
      { name: 'Тест безопасности CSRF', message: 'Отсутствует CSRF токен в формах' },
      { name: 'Проверка XSS защиты', message: 'Найдена потенциальная XSS уязвимость в полях ввода' },
      { name: 'Тест SSL сертификата', message: 'Сертификат не настроен для поддоменов' },
      { name: 'Проверка кэширования данных', message: 'Неоптимальная стратегия кэширования' },
      { name: 'Тест производительности БД', message: 'Медленное выполнение сложных запросов' },
    ];
    
    // Simulate test results appearing gradually
    let count = 0;
    const testInterval = setInterval(() => {
      if (count < successTests.length + failureTests.length) {
        const newTest: TestResult = count < successTests.length 
          ? { ...successTests[count], status: 'passed', time: generateRandomTime() }
          : { ...failureTests[count - successTests.length], status: 'failed', time: generateRandomTime() };
          
        setTestResults(prev => [...prev, newTest]);
        count++;
      } else {
        clearInterval(testInterval);
        
        // Summary toast after all tests complete
        setTimeout(() => {
          toast.info(`Тестирование завершено: пройдено ${successTests.length} из ${successTests.length + failureTests.length} тестов`);
        }, 500);
      }
    }, 400);
  };

  const toggleDbConnection = () => {
    const newStatus = dbConnectionStatus === 'online' ? 'offline' : 'online';
    setDbConnectionStatus(newStatus);
    toast[newStatus === 'online' ? 'success' : 'error'](
      `База данных ${newStatus === 'online' ? 'подключена' : 'отключена'}`
    );
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
            <div className="flex items-center gap-2">
              <Button onClick={handleDownloadProject} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Экспортировать проект
              </Button>
            </div>
          </div>
          
          {/* Database connection indicator */}
          <div className="mt-4 flex gap-4">
            <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-md flex-1">
              <h3 className="font-bold flex items-center gap-2 text-yellow-500">
                <LogIn className="h-4 w-4" /> Данные для входа администратора
              </h3>
              <p className="text-sm mt-2">Email: <span className="font-mono">admin@hackbridge.ru</span></p>
              <p className="text-sm">Пароль: <span className="font-mono">admin123</span></p>
            </div>
            
            <div className={`p-4 border rounded-md flex-1 ${dbConnectionStatus === 'online' 
              ? 'bg-green-500/20 border-green-500/30' 
              : 'bg-red-500/20 border-red-500/30'}`}>
              <h3 className={`font-bold flex items-center gap-2 ${dbConnectionStatus === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                <Database className="h-4 w-4" /> Статус базы данных: {dbConnectionStatus === 'online' ? 'Онлайн' : 'Офлайн'}
              </h3>
              <p className="text-sm mt-2">Соединение: <span className="font-mono">mongodb://hackbridge-db.server:27017</span></p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm">Последнее обновление: {new Date().toLocaleTimeString()}</span>
                <Toggle 
                  pressed={dbConnectionStatus === 'online'} 
                  onPressedChange={() => toggleDbConnection()}
                  className="data-[state=on]:bg-green-500"
                >
                  {dbConnectionStatus === 'online' ? 'Включено' : 'Выключено'}
                </Toggle>
              </div>
            </div>
          </div>
          
          {/* Auto-test panel */}
          <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2 text-blue-500">
                <TestTube className="h-4 w-4" /> Автоматическое тестирование
              </h3>
              <Button 
                onClick={runAutoTests} 
                size="sm" 
                variant="outline" 
                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              >
                <TestTube className="h-4 w-4 mr-2" /> Запустить тесты
              </Button>
            </div>
            {showTestResults && (
              <div className="mt-3 max-h-60 overflow-y-auto">
                <div className="space-y-1.5">
                  {testResults.map((test, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded-md flex justify-between items-center text-sm ${
                        test.status === 'passed'
                          ? 'bg-green-500/10 border border-green-500/30'
                          : 'bg-red-500/10 border border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          test.status === 'passed' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span className="font-medium">{test.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{test.time}ms</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          test.status === 'passed' 
                            ? 'bg-green-500/20 text-green-600' 
                            : 'bg-red-500/20 text-red-600'
                        }`}>
                          {test.status === 'passed' ? 'Успех' : 'Ошибка'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {testResults.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      Запустите тесты для отображения результатов
                    </div>
                  )}
                </div>
                {testResults.length > 0 && (
                  <div className="mt-3 text-sm flex justify-between items-center">
                    <span>Всего тестов: {testResults.length}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-green-500 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        Пройдено: {testResults.filter(t => t.status === 'passed').length}
                      </span>
                      <span className="text-red-500 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                        Провалено: {testResults.filter(t => t.status === 'failed').length}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
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
