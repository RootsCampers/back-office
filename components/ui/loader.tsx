import { Loader2 } from "lucide-react";
import { cn } from "@/lib/styles";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function Loader({ size = 16, className, ...props }: LoaderProps) {
  return (
    <div
      className={cn("animate-spin", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <Loader2 size={size} />
    </div>
  );
}
