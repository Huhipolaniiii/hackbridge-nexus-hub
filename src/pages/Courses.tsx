
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Search, 
  Filter, 
  BookOpen, 
  Star, 
  SortAsc, 
  Clock, 
  Zap
} from 'lucide-react';
import { Course } from '@/types/course';
import { courses } from '@/services/mockData';
import CourseCard from '@/components/courses/CourseCard';
import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const fetchCourses = async (): Promise<Course[]> => {
  // В реальном приложении здесь был бы API запрос
  return new Promise((resolve) => {
    setTimeout(() => resolve(courses), 800);
  });
};

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [sortBy, setSortBy] = useState('popular');

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  const categories = [
    { name: 'Web', color: 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30' },
    { name: 'Mobile', color: 'bg-green-500/20 text-green-500 hover:bg-green-500/30' },
    { name: 'Crypto', color: 'bg-purple-500/20 text-purple-500 hover:bg-purple-500/30' },
    { name: 'Forensics', color: 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' },
    { name: 'OSINT', color: 'bg-red-500/20 text-red-500 hover:bg-red-500/30' },
  ];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const filteredCourses = React.useMemo(() => {
    if (!coursesData) return [];
    
    return coursesData
      .filter(course => {
        // Фильтрация по поисковому запросу
        const matchesSearch = 
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          course.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Фильтрация по категориям
        const matchesCategory = 
          selectedCategories.length === 0 || 
          selectedCategories.some(cat => course.categories?.includes(cat));
        
        // Фильтрация по сложности
        const matchesDifficulty = 
          !selectedDifficulty || 
          course.difficulty === selectedDifficulty;
        
        return matchesSearch && matchesCategory && matchesDifficulty;
      })
      .sort((a, b) => {
        // Сортировка
        switch (sortBy) {
          case 'priceAsc':
            return a.price - b.price;
          case 'priceDesc':
            return b.price - a.price;
          case 'newest':
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          default: // popular
            return b.studentsCount - a.studentsCount;
        }
      });
  }, [coursesData, searchQuery, selectedCategories, selectedDifficulty, sortBy]);

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Курсы по кибербезопасности</h1>
            <p className="text-muted-foreground">
              Изучайте современные техники и методологии хакинга от экспертов отрасли
            </p>
          </div>
          
          <div className="relative mt-4 md:mt-0 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Поиск курсов..." 
              className="pl-9 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Фильтры */}
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 animate-fade-in animation-delay-200">
          <div className="space-y-6 hack-card p-4 rounded-lg bg-hack-dark/50">
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Фильтры
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Категории</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Badge 
                        key={category.name}
                        variant={selectedCategories.includes(category.name) ? "default" : "outline"} 
                        className={`${selectedCategories.includes(category.name) ? category.color : ''} cursor-pointer hover-scale transition-all duration-300`}
                        onClick={() => handleCategoryToggle(category.name)}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Сложность</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Лёгкая', 'Средняя', 'Сложная'].map(difficulty => (
                      <Badge 
                        key={difficulty}
                        variant={selectedDifficulty === difficulty ? "default" : "outline"} 
                        className={`cursor-pointer hover-scale transition-all duration-300 ${
                          selectedDifficulty === difficulty 
                            ? difficulty === 'Лёгкая' 
                              ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                              : difficulty === 'Средняя'
                              ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
                              : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                            : ''
                        }`}
                        onClick={() => setSelectedDifficulty(prev => prev === difficulty ? '' : difficulty)}
                      >
                        {difficulty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Сортировка</h4>
                  <Select 
                    value={sortBy} 
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Сортировать по" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular" className="flex items-center gap-2">
                        <Star className="h-4 w-4" /> Популярные
                      </SelectItem>
                      <SelectItem value="newest" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Новые
                      </SelectItem>
                      <SelectItem value="priceAsc" className="flex items-center gap-2">
                        <SortAsc className="h-4 w-4" /> Цена (по возрастанию)
                      </SelectItem>
                      <SelectItem value="priceDesc" className="flex items-center gap-2">
                        <SortAsc className="h-4 w-4 transform rotate-180" /> Цена (по убыванию)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategories([]);
                    setSelectedDifficulty('');
                    setSortBy('popular');
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 animate-fade-in animation-delay-300">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all" className="gap-2">
                  <BookOpen className="h-4 w-4" /> Все курсы
                </TabsTrigger>
                <TabsTrigger value="popular" className="gap-2">
                  <Star className="h-4 w-4" /> Популярные
                </TabsTrigger>
                <TabsTrigger value="new" className="gap-2">
                  <Zap className="h-4 w-4" /> Новинки
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="hack-card h-[320px] animate-pulse">
                        <div className="h-48 bg-muted/50 rounded-t-lg"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-muted/50 rounded w-3/4"></div>
                          <div className="h-4 bg-muted/50 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course, index) => (
                      <div 
                        key={course.id} 
                        className="animate-fade-in" 
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CourseCard course={course} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium">Курсы не найдены</h3>
                    <p className="text-muted-foreground mt-2">
                      Попробуйте изменить параметры поиска или фильтры
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="popular" className="mt-0">
                {/* Содержимое вкладки "Популярные" - можно использовать тот же код с фильтрацией */}
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="hack-card h-[320px] animate-pulse">
                        <div className="h-48 bg-muted/50 rounded-t-lg"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-muted/50 rounded w-3/4"></div>
                          <div className="h-4 bg-muted/50 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses
                      .sort((a, b) => b.studentsCount - a.studentsCount)
                      .slice(0, 6)
                      .map((course, index) => (
                        <div 
                          key={course.id} 
                          className="animate-fade-in" 
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <CourseCard course={course} />
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="new" className="mt-0">
                {/* Содержимое вкладки "Новинки" - можно использовать тот же код с фильтрацией */}
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="hack-card h-[320px] animate-pulse">
                        <div className="h-48 bg-muted/50 rounded-t-lg"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-muted/50 rounded w-3/4"></div>
                          <div className="h-4 bg-muted/50 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses
                      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                      .slice(0, 6)
                      .map((course, index) => (
                        <div 
                          key={course.id} 
                          className="animate-fade-in" 
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <CourseCard course={course} />
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {filteredCourses.length > 0 && (
              <div className="flex justify-center animate-fade-in animation-delay-500">
                <Button variant="outline" className="gap-2 hover-scale transition-all duration-300">
                  Загрузить ещё
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Courses;
