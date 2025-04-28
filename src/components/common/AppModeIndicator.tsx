
import { useEffect, useState } from 'react';
import { isElectron } from '@/services/electronService';
import { Badge } from '@/components/ui/badge';
import { Monitor, Globe } from 'lucide-react';

const AppModeIndicator = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  
  useEffect(() => {
    setIsDesktop(isElectron());
  }, []);
  
  return (
    <Badge 
      variant="outline" 
      className={`text-xs gap-1 ${isDesktop ? 'border-green-500 text-green-400' : 'border-blue-500 text-blue-400'}`}
    >
      {isDesktop ? (
        <>
          <Monitor className="h-3 w-3" />
          Desktop
        </>
      ) : (
        <>
          <Globe className="h-3 w-3" />
          Browser
        </>
      )}
    </Badge>
  );
};

export default AppModeIndicator;
