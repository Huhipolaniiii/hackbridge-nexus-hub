
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2 select-none"
    >
      <div className="relative">
        <ShieldCheck className="h-8 w-8 text-hack-blue animate-pulse-glow" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold tracking-tighter text-lg hack-gradient-text">
          HackBridge
        </span>
        <span className="text-xs text-muted-foreground hidden sm:inline-block">
          мост между обучением и практикой
        </span>
      </div>
    </Link>
  );
};

export default Logo;
