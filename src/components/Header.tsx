import { PlusCircle } from 'lucide-react';
import { UserMenu } from './dashboard/UserMenu';
import { Logo } from './Logo';

interface HeaderProps {
  onAddTrade: () => void;
}

export function Header({ onAddTrade }: HeaderProps) {
  return (
    <div className="h-auto sm:h-16 border-b border-border px-4 sm:px-8 py-4 sm:py-0 flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between bg-card/50 sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-card/50 space-y-4 sm:space-y-0">
      <Logo className="h-8 w-auto" />
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-end">
        <button
          onClick={onAddTrade}
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Trade</span>
        </button>
        <UserMenu />
      </div> 
    </div>
  );
}