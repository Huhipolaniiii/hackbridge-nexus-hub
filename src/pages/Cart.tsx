
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
import { simulateApiRequest, courses as allCourses } from '@/services/mockData';
import { Course } from '@/types/course';
import { toast } from 'sonner';
import { ShoppingCart, Trash, CreditCard } from 'lucide-react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  type: string;
  imageUrl?: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);
      try {
        // Get cart from localStorage
        const cartString = localStorage.getItem('userCart');
        const userCart = cartString ? JSON.parse(cartString) : [];
        
        // Simulate a small delay for loading effect
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setCartItems(userCart);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast.error('Ошибка при загрузке корзины');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCartItems();
  }, []);
  
  const handleRemoveFromCart = (itemId: string) => {
    // Remove from state
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    
    // Update localStorage
    localStorage.setItem('userCart', JSON.stringify(updatedCart));
    
    toast.success('Товар удален из корзины');
  };
  
  const handleCheckout = () => {
    toast.success('Покупка успешно совершена!');
    setCartItems([]);
    localStorage.setItem('userCart', JSON.stringify([]));
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
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
              {cartItems.map(item => (
                <Card key={item.id} className="hack-card overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div 
                      className="w-full md:w-48 h-40 md:h-auto bg-cover bg-center" 
                      style={{ backgroundImage: `url(${item.imageUrl || '/placeholder.svg'})` }}
                    />
                    <div className="flex-1 flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {item.type === 'course' ? 'Курс' : 'Задание'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {item.type === 'course' ? 'Доступ навсегда' : 'Единоразовая оплата'}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center border-t border-border pt-3">
                        <div className="font-bold text-hack-green">
                          {item.price} ₽
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="gap-2"
                          onClick={() => handleRemoveFromCart(item.id)}
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
                    <span>Всего товаров:</span>
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
