
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, UserX, Settings } from 'lucide-react';
import { User } from '@/types/user';
import { toast } from 'sonner';

interface AdminUsersManagerProps {
  users: User[];
  setUsers: (users: User[]) => void;
}

const AdminUsersManager = ({ users, setUsers }: AdminUsersManagerProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState('');
  const [userRating, setUserRating] = useState('');

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

  return (
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
                        onClick={e => {
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
      </div>
    </div>
  );
};

export default AdminUsersManager;
