
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-hack-darker p-4">
      <div className="text-center max-w-md mx-auto animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-hack-red/20 flex items-center justify-center animate-pulse">
            <AlertCircle className="h-12 w-12 text-hack-red" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-4 hack-gradient-text">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Упс! Страница не найдена
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Запрошенный путь <span className="text-hack-red font-mono">{location.pathname}</span> не существует
        </p>
        
        <div className="flex justify-center">
          <Button 
            asChild
            className="bg-hack-blue hover:bg-hack-blue/80 text-black hover-scale transition-all duration-300 gap-2"
          >
            <Link to="/">
              <Home className="h-5 w-5" />
              Вернуться на главную
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
