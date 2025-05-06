
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, UserX, Settings, UserPlus } from 'lucide-react';
import { User } from '@/types/user';
import { toast } from 'sonner';
import { userService } from '@/services/dataService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface AdminUsersManagerProps {
  users: User[];
  setUsers: (users: User[]) => void;
}

const AdminUsersManager = ({ users, setUsers }: AdminUsersManagerProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState('');
  const [userRating, setUserRating] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'hacker' as 'hacker' | 'company' | 'admin'
  });

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
          balance: user.balance + Number(userBalance),
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
          rating: Number(userRating),
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
        return { ...user, banned: newBanStatus };
      }
      return user;
    });

    const user = updatedUsers.find(u => u.id === userId);
    if (user) {
      toast.success(`Пользователь ${user.username} ${user.banned ? 'заблокирован' : 'разблокирован'}`);
    }

    setUsers(updatedUsers);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserBalance('');
      setUserRating(user.rating.toString());
    }
  };
  
  const handleCreateUser = () => {
    if (!newUser.username || !newUser.email) {
      toast.error('Заполните все поля');
      return;
    }
    
    // Generate a unique ID
    const userId = 'user_' + Date.now().toString();
    
    const user: User = {
      id: userId,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      avatarUrl: '/placeholder.svg',
      rating: 0,
      balance: 1000, // Starting balance
      completedTasks: 0,
      skills: [],
      purchasedCourses: [],
      banned: false
    };
    
    // Check if email already exists
    if (users.some(u => u.email === user.email)) {
      toast.error("Пользователь с таким email уже существует");
      return;
    }
    
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    
    // Reset form
    setNewUser({
      username: '',
      email: '',
      role: 'hacker'
    });
    
    toast.success('Пользователь добавлен');
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="hack-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Список пользователей</CardTitle>
            <CardDescription>Всего пользователей: {users.length}</CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              setSelectedUserId(null);
              document.getElementById('new-user-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <UserPlus className="h-4 w-4" />
            Добавить пользователя
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Пользователь</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Баланс</TableHead>
                <TableHead>Рейтинг</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow 
                  key={user.id}
                  className={`cursor-pointer ${selectedUserId === user.id ? 'bg-hack-blue/10' : ''} ${user.banned ? 'opacity-60' : ''}`}
                  onClick={() => handleSelectUser(user.id)}
                >
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.balance} ₽</TableCell>
                  <TableCell>{user.rating}</TableCell>
                  <TableCell>
                    {user.banned ? (
                      <Badge variant="destructive">Заблокирован</Badge>
                    ) : (
                      <Badge variant="outline">Активен</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={user.banned ? 'text-green-500 hover:text-green-600' : 'text-red-500 hover:text-red-600'}
                      onClick={e => {
                        e.stopPropagation();
                        handleToggleBanUser(user.id);
                      }}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hack-card">
          <CardHeader>
            <CardTitle>Управление пользователем</CardTitle>
            <CardDescription>
              {selectedUserId 
                ? `Выбран: ${users.find(u => u.id === selectedUserId)?.username}` 
                : 'Выберите пользователя из таблицы'}
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
                  onChange={e => setUserBalance(e.target.value)}
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
                  onChange={e => setUserRating(e.target.value)}
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
        
        <Card className="hack-card" id="new-user-section">
          <CardHeader>
            <CardTitle>Добавить пользователя</CardTitle>
            <CardDescription>
              Создание нового пользователя в системе
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-username">Имя пользователя</Label>
              <Input
                id="new-username"
                placeholder="Имя пользователя"
                value={newUser.username}
                onChange={e => setNewUser({...newUser, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="example@hackbridge.ru"
                value={newUser.email}
                onChange={e => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role">Роль</Label>
              <select
                id="new-role"
                className="w-full p-2 border border-input bg-background rounded-md"
                value={newUser.role}
                onChange={e => setNewUser({...newUser, role: e.target.value as 'hacker' | 'company' | 'admin'})}
              >
                <option value="hacker">Хакер</option>
                <option value="company">Компания</option>
                <option value="admin">Админ</option>
              </select>
            </div>
            <Button 
              onClick={handleCreateUser} 
              className="w-full bg-hack-blue hover:bg-hack-blue/80 text-black"
            >
              Создать пользователя
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsersManager;
