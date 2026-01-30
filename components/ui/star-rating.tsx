import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/styles";

interface StarRatingProps {
  maxStars: number;
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  className?: string;
}

export function StarRating({
  maxStars = 5,
  rating,
  onRatingChange,
  size = "md",
  readOnly = false,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index: number) => {
    if (readOnly) return;
    onRatingChange?.(index);
  };

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const starSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className={cn("flex", className)}>
      {[...Array(maxStars)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <button
            type="button"
            key={i}
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => handleMouseEnter(ratingValue)}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "p-0.5 focus:outline-none transition-colors",
              !readOnly && "cursor-pointer",
              readOnly && "cursor-default",
            )}
            disabled={readOnly}
            aria-label={`Rate ${ratingValue} out of ${maxStars} stars`}
          >
            <Star
              className={cn(
                starSizes[size],
                "transition-colors duration-150",
                ratingValue <= (hoverRating || rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-gray-300",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
