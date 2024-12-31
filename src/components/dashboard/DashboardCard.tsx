import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  className?: string;
  colorCondition?: 'positive' | 'negative' | 'neutral';
}

export function DashboardCard({ title, value, className, colorCondition }: DashboardCardProps) {
  const getValueColor = () => {
    if (!colorCondition) return '';
    switch (colorCondition) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return '';
    }
  };

  return (
    <div 
      className={cn(
        "bg-card rounded-xl border border-border p-4 relative group min-h-[120px] transition-all hover:shadow-lg",
        className
      )}
    >
      <div 
        className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 cursor-move"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col justify-between h-full">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className={cn("text-2xl font-bold", getValueColor())}>{value}</p>
      </div>
    </div>
  );
}