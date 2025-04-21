
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from '@/types/user';
import { Course } from '@/types/course';
import { Task } from '@/types/task';
import { courses as mockCourses, tasks as mockTasks, users as mockUsers } from '@/services/mockData';
import { UserX, TrashIcon, DollarSign, Settings, LogIn } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState('');
  const [userRating, setUserRating] = useState('');
  
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem('userRole');
    
    if (userRole !== 'admin') {
      // Redirect to home if not admin
      window.location.href = '/';
      return;
    }
    
    // Load data
    setUsers(mockUsers.map(user => ({ ...user, banned: false })));
    setCourses(mockCourses);
    setTasks(mockTasks);
    setIsLoading(false);
  }, []);
  
  const handleAddFunds = () => {
    if (!selectedUserId) {
      toast.error('Выберите пользователя');
      return;
    }
    
    if (!userBalance || isNaN(Number(userBalance))) {
      toast.error('Введите корректную сумму');
      return;
    }
    
    const updatedUsers = users.map(user => {
      if (user.id === selectedUserId) {
        return {
          ...user,
          balance: user.balance + Number(userBalance)
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    toast.success(`Баланс пользователя пополнен на ${userBalance} ₽`);
    setUserBalance('');
  };
  
  const handleUpdateRating = () => {
    if (!selectedUserId) {
      toast.error('Выберите пользователя');
      return;
    }
    
    if (!userRating || isNaN(Number(userRating))) {
      toast.error('Введите корректный рейтинг');
      return;
    }
    
    const updatedUsers = users.map(user => {
      if (user.id === selectedUserId) {
        return {
          ...user,
          rating: Number(userRating)
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    toast.success(`Рейтинг пользователя обновлен`);
    setUserRating('');
  };
  
  const handleToggleBanUser = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newBanStatus = !user.banned;
        return {
          ...user,
          banned: newBanStatus
        };
      }
      return user;
    });
    
    const user = updatedUsers.find(u => u.id === userId);
    if (user) {
      toast.success(`Пользователь ${user.username} ${user.banned ? 'заблокирован' : 'разблокирован'}`);
    }
    
    setUsers(updatedUsers);
  };
  
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    toast.success('Задание удалено');
  };
  
  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserBalance('');
      setUserRating(user.rating.toString());
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
          <h1 className="text-3xl font-bold tracking-tight">Панель администратора</h1>
          <p className="text-muted-foreground mt-1">
            Управление пользователями, курсами и заданиями
          </p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="hack-card">
                  <CardHeader>
                    <CardTitle>Список пользователей</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.map(user => (
                        <div 
                          key={user.id} 
                          className={`p-4 rounded-md cursor-pointer transition-colors ${selectedUserId === user.id ? 'bg-hack-blue/10' : 'hover:bg-hack-dark'} ${user.banned ? 'opacity-60' : ''}`}
                          onClick={() => handleSelectUser(user.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{user.username}</h3>
                                {user.banned && (
                                  <Badge variant="destructive" className="text-xs">Заблокирован</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-sm mt-1">Роль: {user.role}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-hack-green">{user.balance} ₽</p>
                              <p className="text-sm">Рейтинг: {user.rating}</p>
                              <p className="text-sm">Задач: {user.completedTasks}</p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className={`mt-2 ${user.banned ? 'text-green-500 hover:text-green-600' : 'text-red-500 hover:text-red-600'}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleBanUser(user.id);
                                }}
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                {user.banned ? 'Разблокировать' : 'Заблокировать'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="hack-card">
                  <CardHeader>
                    <CardTitle>Управление пользователем</CardTitle>
                    <CardDescription>
                      {selectedUserId 
                        ? `Выбран: ${users.find(u => u.id === selectedUserId)?.username}` 
                        : 'Выберите пользователя слева'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="balance">Пополнить баланс</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="balance"
                          type="number"
                          placeholder="Сумма"
                          value={userBalance}
                          onChange={(e) => setUserBalance(e.target.value)}
                          disabled={!selectedUserId}
                        />
                        <Button onClick={handleAddFunds} disabled={!selectedUserId} className="gap-2">
                          <DollarSign className="h-4 w-4" />
                          Пополнить
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rating">Изменить рейтинг</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="rating"
                          type="number"
                          placeholder="Рейтинг"
                          value={userRating}
                          onChange={(e) => setUserRating(e.target.value)}
                          disabled={!selectedUserId}
                        />
                        <Button onClick={handleUpdateRating} disabled={!selectedUserId} className="gap-2">
                          <Settings className="h-4 w-4" />
                          Обновить
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-6 mt-6">
            <Card className="hack-card">
              <CardHeader>
                <CardTitle>Управление заданиями</CardTitle>
                <CardDescription>
                  Просмотр и модерация заданий на платформе
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Компания</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Сложность</TableHead>
                      <TableHead>Награда</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map(task => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.companyName}</TableCell>
                        <TableCell>{task.category}</TableCell>
                        <TableCell>{task.difficulty}</TableCell>
                        <TableCell className="text-hack-green">{task.reward} ₽</TableCell>
                        <TableCell>
                          <Badge variant={task.status === 'Открыто' ? 'default' : task.status === 'В работе' ? 'outline' : 'secondary'}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Удалить
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6 mt-6">
            <Card className="hack-card">
              <CardHeader>
                <CardTitle>Управление курсами</CardTitle>
                <CardDescription>
                  Здесь вы можете управлять доступными курсами на платформе
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Сложность</TableHead>
                      <TableHead>Цена</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map(course => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.category}</TableCell>
                        <TableCell>{course.difficulty}</TableCell>
                        <TableCell className="text-hack-green">{course.price} ₽</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminPanel;
