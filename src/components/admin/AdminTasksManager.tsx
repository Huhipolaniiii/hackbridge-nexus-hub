
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrashIcon } from 'lucide-react';
import { Task } from '@/types/task';
import { toast } from 'sonner';

interface AdminTasksManagerProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const AdminTasksManager = ({ tasks, setTasks }: AdminTasksManagerProps) => {
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    toast.success('Задание удалено');
  };

  return (
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
  );
};

export default AdminTasksManager;
