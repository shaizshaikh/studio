
import type { HTMLAttributes } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagBadgeProps extends HTMLAttributes<HTMLDivElement> {
  tag: string;
  interactive?: boolean;
  onClick?: (tag: string) => void;
  isActive?: boolean;
}

export function TagBadge({ 
  tag, 
  interactive = false, 
  onClick: onTagClick, // Renamed prop for clarity within the component
  isActive, 
  className, 
  ...props 
}: TagBadgeProps) {
  
  // Determine if the badge should actually behave interactively
  const isActuallyInteractive = interactive && !!onTagClick;

  const handleInteraction = () => {
    if (isActuallyInteractive) {
      // Safe to call onTagClick because isActuallyInteractive ensures it exists
      onTagClick!(tag);
    }
  };

  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={cn(
        "text-xs rounded-full font-medium transition-all",
        isActuallyInteractive && "cursor-pointer", // Add cursor only if interactive
        // Hover styles are part of Badge variants by default
        className
      )}
      onClick={isActuallyInteractive ? handleInteraction : undefined}
      onKeyDown={isActuallyInteractive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // Prevent page scroll on spacebar
          handleInteraction();
        }
      } : undefined}
      role={isActuallyInteractive ? "button" : undefined}
      tabIndex={isActuallyInteractive ? 0 : undefined}
      // aria-pressed can be passed via ...props by the parent component if needed
      {...props}
    >
      {tag}
    </Badge>
  );
}
