import type { HTMLAttributes } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagBadgeProps extends HTMLAttributes<HTMLDivElement> {
  tag: string;
  interactive?: boolean;
  onClick?: (tag: string) => void;
  isActive?: boolean;
}

export function TagBadge({ tag, interactive = false, onClick, isActive, className, ...props }: TagBadgeProps) {
  const handleClick = () => {
    if (interactive && onClick) {
      onClick(tag);
    }
  };

  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={cn(
        "text-xs rounded-full font-medium transition-all",
        interactive && "cursor-pointer hover:bg-primary/80 hover:text-primary-foreground",
        isActive && "bg-primary text-primary-foreground",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {tag}
    </Badge>
  );
}
