
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Лёгкая':
        return 'bg-green-500/20 text-green-500 hover:bg-green-500/30';
      case 'Средняя':
        return 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30';
      case 'Сложная':
        return 'bg-red-500/20 text-red-500 hover:bg-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Web':
        return 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30';
      case 'Mobile':
        return 'bg-purple-500/20 text-purple-500 hover:bg-purple-500/30';
      case 'Crypto':
        return 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30';
      case 'OSINT':
        return 'bg-orange-500/20 text-orange-500 hover:bg-orange-500/30';
      case 'Forensics':
        return 'bg-pink-500/20 text-pink-500 hover:bg-pink-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card 
      className="hack-card relative cursor-pointer" 
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      <header className="absolute top-3 right-3 flex gap-2 flex-wrap justify-end max-w-[70%]">
        <Badge variant="secondary" className={getDifficultyColor(task.difficulty)}>
          {task.difficulty}
        </Badge>
        <Badge variant="secondary" className={getCategoryColor(task.category)}>
          {task.category}
        </Badge>
      </header>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
        <span className="flex items-center text-sm text-muted-foreground">
          <Building className="h-4 w-4 mr-1.5" />
          {task.companyName}
        </span>
        <CardDescription className="line-clamp-2 mt-2">{task.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <section className="space-y-3">
          <article className="flex justify-between items-center">
            <span className="text-sm">Сложность:</span>
            <Badge variant="secondary" className={getDifficultyColor(task.difficulty)}>
              {task.difficulty}
            </Badge>
          </article>
          <article className="flex justify-between items-center">
            <span className="text-sm">Категория:</span>
            <Badge variant="secondary" className={getCategoryColor(task.category)}>
              {task.category}
            </Badge>
          </article>
        </section>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-border pt-3">
        <strong className="font-bold text-hack-green">
          {task.reward} ₽
        </strong>
        <Button 
          variant="default" 
          size="sm"
          className="bg-hack-blue hover:bg-hack-blue/80 text-black gap-2"
          onClick={() => navigate(`/tasks/${task.id}`)}
        >
          Подробнее
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
