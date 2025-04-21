
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import TaskCard from '@/components/tasks/TaskCard';
import { Task } from '@/types/task';
import { simulateApiRequest, tasks } from '@/services/mockData';
import { Search, Plus, Building } from 'lucide-react';

const Tasks = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [isCompanyAccount, setIsCompanyAccount] = useState(false);
  
  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const data = await simulateApiRequest(tasks);
        setAllTasks(data);
        setFilteredTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
    
    // For demo, check if we're a company account
    const userRole = localStorage.getItem('userRole');
    setIsCompanyAccount(userRole === 'company');
  }, []);
  
  // Filter and sort tasks
  useEffect(() => {
    let result = [...allTasks];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(task => task.category === categoryFilter);
    }
    
    // Apply difficulty filter
    if (difficultyFilter) {
      result = result.filter(task => task.difficulty === difficultyFilter);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        // In a real app, you'd sort by date
        result = [...result]; 
        break;
      case 'oldest':
        // In a real app, you'd sort by date
        result = [...result].reverse();
        break;
      case 'highestReward':
        result = [...result].sort((a, b) => b.reward - a.reward);
        break;
      case 'lowestReward':
        result = [...result].sort((a, b) => a.reward - b.reward);
        break;
      default:
        break;
    }
    
    setFilteredTasks(result);
  }, [allTasks, searchTerm, categoryFilter, difficultyFilter, sortOption]);
  
  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Задания</h1>
            <p className="text-muted-foreground mt-1">
              Найдите задания от компаний и получите вознаграждение за их выполнение
            </p>
          </div>
          
          {isCompanyAccount && (
            <Button 
              className="bg-hack-blue hover:bg-hack-blue/80 text-black hover-scale gap-2"
              onClick={() => window.location.href = '/tasks/post'}
            >
              <Plus className="h-4 w-4" />
              Разместить задание
            </Button>
          )}
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск заданий..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все категории</SelectItem>
              <SelectItem value="Web">Web</SelectItem>
              <SelectItem value="Mobile">Mobile</SelectItem>
              <SelectItem value="Crypto">Crypto</SelectItem>
              <SelectItem value="OSINT">OSINT</SelectItem>
              <SelectItem value="Forensics">Forensics</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Сложность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Любая сложность</SelectItem>
              <SelectItem value="Лёгкая">Лёгкая</SelectItem>
              <SelectItem value="Средняя">Средняя</SelectItem>
              <SelectItem value="Сложная">Сложная</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger>
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Сначала новые</SelectItem>
              <SelectItem value="oldest">Сначала старые</SelectItem>
              <SelectItem value="highestReward">Сначала высокая награда</SelectItem>
              <SelectItem value="lowestReward">Сначала низкая награда</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-64 animate-pulse bg-hack-dark rounded-lg" />
            ))}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-hack-dark flex items-center justify-center mb-4">
              <Building className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Задания не найдены</h3>
            <p className="text-muted-foreground max-w-md">
              По вашему запросу не найдено заданий. Попробуйте изменить параметры поиска или фильтры.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Tasks;
