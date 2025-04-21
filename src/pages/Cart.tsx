
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { courses as allCourses, simulateApiRequest } from '@/services/mockData';
import { Course } from '@/types/course';
import { toast } from 'sonner';
import { ShoppingCart, Trash, CreditCard } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);
      try {
        // In a real app, you'd fetch from an API
        // For demo, we'll just mark some courses as in cart
        const mockCartItems = allCourses
          .slice(0, 2)
          .map(course => ({ ...course, inCart: true }));
          
        await simulateApiRequest(mockCartItems);
        setCartItems(mockCartItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCartItems();
  }, []);
  
  const handleRemoveFromCart = (courseId: string) => {
    setCartItems(cartItems.filter(course => course.id !== courseId));
    toast.success('Курс удален из корзины');
  };
  
  const handleCheckout = () => {
    toast.success('Покупка успешно совершена!');
    setCartItems([]);
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((total, course) => total + course.price, 0);
  };
  
  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Корзина</h1>
          <p className="text-muted-foreground mt-1">
            Управляйте выбранными курсами и завершите покупку
          </p>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="h-32 animate-pulse bg-hack-dark rounded-lg" />
            ))}
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(course => (
                <Card key={course.id} className="hack-card overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div 
                      className="w-full md:w-48 h-40 md:h-auto bg-cover bg-center" 
                      style={{ backgroundImage: `url(${course.imageUrl})` }}
                    />
                    <div className="flex-1 flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {course.lessonsCount} уроков • {course.difficulty}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center border-t border-border pt-3">
                        <div className="font-bold text-hack-green">
                          {course.price} ₽
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="gap-2"
                          onClick={() => handleRemoveFromCart(course.id)}
                        >
                          <Trash className="h-4 w-4" />
                          Удалить
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div>
              <Card className="hack-card animate-slide-up">
                <CardHeader>
                  <CardTitle>Сводка заказа</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Всего курсов:</span>
                    <span>{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Итого:</span>
                    <span className="text-hack-green">{calculateTotal()} ₽</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-hack-blue hover:bg-hack-blue/80 text-black gap-2"
                    onClick={handleCheckout}
                  >
                    <CreditCard className="h-4 w-4" />
                    Оформить заказ
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-hack-dark flex items-center justify-center mb-4">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ваша корзина пуста</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Добавьте курсы в корзину, чтобы приступить к обучению
            </p>
            <Button 
              className="bg-hack-blue hover:bg-hack-blue/80 text-black hover-scale"
              onClick={() => window.location.href = '/courses'}
            >
              Просмотреть курсы
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Cart;
