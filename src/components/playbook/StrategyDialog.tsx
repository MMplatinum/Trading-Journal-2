import { useState, useEffect } from 'react';
import { Strategy } from '@/types/playbook';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface StrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategy?: Strategy | null;
  onSubmit: (data: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function StrategyDialog({ 
  open, 
  onOpenChange, 
  strategy, 
  onSubmit 
}: StrategyDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState<string[]>(['']);

  useEffect(() => {
    if (strategy) {
      setTitle(strategy.title);
      setDescription(strategy.description);
      setRules(strategy.rules.length > 0 ? strategy.rules : ['']);
    } else {
      setTitle('');
      setDescription('');
      setRules(['']);
    }
  }, [strategy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredRules = rules.filter(rule => rule.trim() !== '');
    onSubmit({
      title,
      description,
      rules: filteredRules,
    });
  };

  const addRule = () => {
    setRules(prev => [...prev, '']);
  };

  const removeRule = (index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, value: string) => {
    setRules(prev => prev.map((rule, i) => i === index ? value : rule));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {strategy ? 'Edit Strategy' : 'Add Strategy'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Strategy Name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Trading Rules</Label>
            <div className="space-y-2">
              {rules.map((rule, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={rule}
                    onChange={(e) => updateRule(index, e.target.value)}
                    placeholder={`Rule ${index + 1}`}
                  />
                  {rules.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRule(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addRule}
              className="w-full mt-2"
            >
              Add Rule
            </Button>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {strategy ? 'Save Changes' : 'Add Strategy'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}