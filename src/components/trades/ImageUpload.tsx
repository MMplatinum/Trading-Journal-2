import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadTradeImage } from '@/lib/supabase/storage';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  label: string;
  type: 'entry' | 'exit';
  value?: string;
  onChange: (value?: string) => void;
}

export function ImageUpload({ label, type, value, onChange }: ImageUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setIsUploading(true);
      const url = await uploadTradeImage(user.id, file, type);
      onChange(url);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error uploading image',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer relative ${
          value ? 'border-primary' : 'border-muted-foreground/25'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt={label}
              className="max-h-48 mx-auto rounded-lg"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
            {isUploading ? (
              <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary" />
            ) : (
              <Upload className="w-8 h-8 mb-2" />
            )}
            <p className="text-sm">Drop {label.toLowerCase()} or click to select</p>
            <p className="text-xs text-muted-foreground mt-1">Maximum size: 0.5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}