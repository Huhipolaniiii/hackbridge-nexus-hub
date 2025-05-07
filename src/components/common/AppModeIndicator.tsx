
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';

const AppModeIndicator = () => {  
  return (
    <Badge 
      variant="outline" 
      className="text-xs gap-1 border-blue-500 text-blue-400"
    >
      <Globe className="h-3 w-3" />
      Browser
    </Badge>
  );
};

export default AppModeIndicator;
