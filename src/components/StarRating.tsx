import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ rating, onRatingChange, readonly = false, size = "md" }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  const handleStarClick = (star: number) => {
    if (readonly || !onRatingChange) return;
    onRatingChange(star);
  };

  const handleStarHover = (star: number) => {
    if (readonly) return;
    setHoveredRating(star);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoveredRating(0);
  };

  return (
    <div className="flex gap-1" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoveredRating || rating);
        return (
          <Star
            key={star}
            className={`${sizeClasses[size]} transition-all cursor-pointer ${
              isActive 
                ? "fill-rating text-rating" 
                : "text-rating-muted hover:text-rating/70"
            } ${readonly ? "cursor-default" : "hover:scale-110"}`}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
          />
        );
      })}
    </div>
  );
}