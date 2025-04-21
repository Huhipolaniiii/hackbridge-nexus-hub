
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Course } from '@/types/course';
import { toast } from 'sonner';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if user is logged in
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      toast.error('Необходимо войти в аккаунт для добавления курса в корзину');
      navigate('/login');
      return;
    }
    
    setIsAddingToCart(true);
    
    // Get existing cart from localStorage
    const cartString = localStorage.getItem('userCart');
    let cart = cartString ? JSON.parse(cartString) : [];
    
    // Check if course is already in cart
    const isInCart = cart.some((item: any) => item.id === course.id);
    
    if (isInCart) {
      toast.info('Этот курс уже в корзине');
      setIsAddingToCart(false);
      return;
    }
    
    // Add course to cart
    cart.push({
      id: course.id,
      title: course.title,
      price: course.price,
      type: 'course'
    });
    
    // Save updated cart
    localStorage.setItem('userCart', JSON.stringify(cart));
    
    // Show success message
    setTimeout(() => {
      setIsAddingToCart(false);
      toast.success('Курс добавлен в корзину');
    }, 500);
  };

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

  return (
    <Card 
      className="hack-card cursor-pointer" 
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.imageUrl} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute top-2 right-2 flex flex-wrap justify-end gap-2">
          <Badge variant="secondary" className={getDifficultyColor(course.difficulty)}>
            {course.difficulty}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">{course.title}</CardTitle>
        </div>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-muted-foreground text-sm">
            <BookOpen className="h-4 w-4 mr-1" />
            {course.lessonsCount} уроков
          </div>
          <p className="font-semibold text-lg">{course.price} ₽</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full gap-1"
          onClick={(e) => handleAddToCart(e)}
          disabled={isAddingToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          В корзину
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/courses/${course.id}`);
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
