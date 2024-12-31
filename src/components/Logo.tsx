import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <img 
        src="/images/logo.svg" 
        alt="Trading Journal Logo"
        className={cn("h-8 w-auto", className)}
      />
      <span className="text-lg font-semibold">Trading Journal</span>
    </div>
  );
}