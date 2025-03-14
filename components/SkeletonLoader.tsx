import React from "react";
import { cn } from "@/lib/utils"; // Assuming you have the cn utility from shadcn

/**
 * Base Skeleton component from shadcn
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-primary/10 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

/**
 * Props for the SkeletonLoader component
 */
interface SkeletonLoaderProps {
  /** Text to display in the middle of the skeleton */
  text?: string;
  /** Width of the skeleton (Tailwind class) */
  width?: string;
  /** Height of the skeleton (Tailwind class) */
  height?: string;
  /** Border radius (Tailwind class) */
  rounded?: string;
  /** Text size (Tailwind class) */
  textSize?: string;
  /** Text color (Tailwind class) */
  textColor?: string;
  /** Whether to animate the skeleton */
  animate?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SkeletonLoader component
 * A customizable skeleton loader with text in the middle using shadcn's Skeleton
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  text = "Loading...",
  width = "w-full",
  height = "h-24",
  rounded = "rounded-md",
  textSize = "text-sm",
  textColor = "text-gray-500",
  animate = true,
  className = "",
}) => {
  return (
    <div className={`relative ${width} ${height} ${className}`}>
      <Skeleton
        className={cn(
          "w-full h-full",
          rounded,
          animate ? "animate-pulse" : "",
          className
        )}
      />

      {/* Text overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className={`${textSize} ${textColor} font-medium`}>{text}</span>
      </div>
    </div>
  );
};

export default SkeletonLoader;
