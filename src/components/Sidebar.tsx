import { LayoutDashboard, ListOrdered, Calendar, Wallet, Settings, BarChart2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TabType } from '../App';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'trades' as const, label: 'Trades List', icon: ListOrdered },
  { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
  { id: 'accounts' as const, label: 'Accounts', icon: Wallet },
  { id: 'analytics' as const, label: 'Widgets', icon: BarChart2 },
  { id: 'playbook' as const, label: 'Strategy Playbook', icon: BookOpen },
  { id: 'settings' as const, label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-16 bg-card border-r border-border flex flex-col items-center py-6">
      <TooltipProvider delayDuration={0}>
        <nav className="space-y-4">
          {navItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-lg transition-colors',
                    activeTab === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-primary/5'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </div>
  );
}