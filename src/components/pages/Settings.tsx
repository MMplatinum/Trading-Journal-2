import { useState } from 'react';
import { Button } from '@/components/ui/button'; 
import { Moon, Sun, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { resetAllData } from '@/lib/storage/reset';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';

export function Settings() {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleReset = async () => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to reset your data.',
        variant: 'destructive',
      });
      return;
    }

    setIsResetting(true);
    try {
      await resetAllData(user.id);
      setResetDialogOpen(false);
      toast({
        title: 'Trading Journal Reset',
        description: 'All data has been cleared and the journal has been reset to its initial state.',
      });
    } catch (error) {
      console.error('Error resetting data:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset trading journal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Theme</h3>
          <p className="text-muted-foreground">
            Choose between light and dark mode for the application interface.
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
              className="w-24"
            >
              <Sun className="w-4 h-4 mr-2" />
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
              className="w-24"
            >
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reset Trading Journal</h3>
          <p className="text-muted-foreground">
            Clear all data and reset the trading journal to its initial state. This action cannot be undone.
          </p>
          <Button 
            variant="destructive" 
            onClick={() => setResetDialogOpen(true)}
            disabled={isResetting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isResetting ? 'Resetting...' : 'Reset Journal'}
          </Button>
        </div>
      </div>

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Trading Journal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the trading journal? This will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All trading accounts</li>
                <li>All recorded trades</li>
                <li>All transactions</li>
                <li>Dashboard layout preferences</li>
                <li>Analytics configurations</li>
              </ul>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isResetting}
            >
              {isResetting ? 'Resetting...' : 'Reset Journal'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}