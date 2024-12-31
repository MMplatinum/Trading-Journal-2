import { useState } from 'react';
import { usePlaybook } from '@/hooks/usePlaybook';
import { Strategy } from '@/types/playbook';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { StrategyDialog } from '../playbook/StrategyDialog';
import { useToast } from '@/hooks/use-toast';
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

export function Playbook() {
  const { strategies, addStrategy, updateStrategy, deleteStrategy } = usePlaybook();
  const [editStrategy, setEditStrategy] = useState<Strategy | null>(null);
  const [deleteConfirmStrategy, setDeleteConfirmStrategy] = useState<Strategy | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAdd = (data: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>) => {
    addStrategy(data);
    setDialogOpen(false);
    toast({
      title: 'Strategy Added',
      description: 'Your trading strategy has been saved.',
    });
  };

  const handleEdit = (data: Partial<Strategy>) => {
    if (editStrategy) {
      updateStrategy(editStrategy.id, data);
      setEditStrategy(null);
      toast({
        title: 'Strategy Updated',
        description: 'Your trading strategy has been updated.',
      });
    }
  };

  const handleDelete = () => {
    if (deleteConfirmStrategy) {
      deleteStrategy(deleteConfirmStrategy.id);
      setDeleteConfirmStrategy(null);
      toast({
        title: 'Strategy Deleted',
        description: 'The trading strategy has been removed.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Strategy Playbook</h2>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Strategy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {strategies.map((strategy) => (
          <Card key={strategy.id} className="group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="line-clamp-1">{strategy.title}</CardTitle>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditStrategy(strategy)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteConfirmStrategy(strategy)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {strategy.description}
              </p>
              <ul className="list-disc list-inside space-y-1">
                {strategy.rules.map((rule, index) => (
                  <li key={index} className="text-sm line-clamp-1">
                    {rule}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <StrategyDialog
        open={dialogOpen || !!editStrategy}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditStrategy(null);
        }}
        strategy={editStrategy}
        onSubmit={editStrategy ? handleEdit : handleAdd}
      />

      <AlertDialog 
        open={!!deleteConfirmStrategy} 
        onOpenChange={(open) => !open && setDeleteConfirmStrategy(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Strategy</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this strategy? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}